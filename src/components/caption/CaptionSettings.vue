<template>
  <div>
    <q-tabs v-model="tab" class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator :breakpoint="0">
      <q-tab name="caption" label="Ondertitel" />
      <q-tab name="background" label="Achtergrond" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="caption">
        <q-card-section>
          <label class="label">Titel</label>
          <q-input v-model="settings.title" outlined :rules="['required']" />

          <label class="label">Tekst</label>
          <VezyEditor ref="vezyEditor" v-model="settings.text" v-model:savedPos="savedPos" min-height="80px" />
          <div class="row q-gutter-md">
            <div class="col">
              <q-select v-model="settings.formatBeamer" :options="formatBeamer" fill-input outlined label="Opmaak type" />
              <label class="label">Voorbeeld Beamer</label>
              <div>
                <OutputPreview :key="`beamer${keyTeller}`" :component="CaptionOutputBeamer" :presentation="{ settings, sections, beamerTitleLines, selectedSectionIndex, selectedSlideIndex }" bg-show="beamer" />
              </div>
            </div>
            <div class="col">
              <div class="row">
                <q-select v-model="settings.formatLivestream" :options="formatLivestream" fill-input class="col q-pb-none" outlined label="Opmaak type" />
                <q-input
                  v-model.number="settings.maxLivestreamChar"
                  type="number"
                  outlined
                  stack-label
                  class="col2 q-pl-md q-pb-none"
                  min="100"
                  step="50"
                  label="max tekens"
                  :rules="[min100]"
                />
              </div>
              <label class="label">Voorbeeld Livestream</label>
              <div>
                <OutputPreview :key="`stream${keyTeller}`" :component="CaptionOutputLivestream" :presentation="{ settings, sections, beamerTitleLines, selectedSectionIndex, selectedSlideIndex }" bg-show="livestream" />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-tab-panel>
      <q-tab-panel name="background">
        <BackgroundSetting v-model:bgFileId="settings.bgFileId" v-model:bgOpacity="settings.bgOpacity" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import BaseSettings from '../presentation/BaseSettings.vue'
import OutputPreview from '../output/OutputPreview.vue'
import CaptionOutputLivestream from './CaptionOutputLivestream.vue'
import CaptionOutputBeamer from './CaptionOutputBeamer.vue'
import BackgroundSetting from '../presentation/BackgroundSetting.vue'
import VezyEditor from '../common/VezyEditor.vue'
import { splitTextCaption, titleLines } from '../caption/CaptionSplit.js'
import { debounce } from 'quasar'

export default {
  components: { OutputPreview, BackgroundSetting, VezyEditor },
  extends: BaseSettings,
  setup () {
    return { CaptionOutputLivestream, CaptionOutputBeamer }
  },
  data () {
    return {
      tab: 'caption',
      formatLivestream: [
        'Standaard',
        'Breed',
        'Geen'
      ],
      formatBeamer: [
        'Geen',
        'Standaard',
        'Bijbeltekst',
        'Alleen tekst',
        'Titel',
        'Thema'
      ],
      sections: null,
      beamerTitleLines: null,
      selectedSectionIndex: 0,
      selectedSlideIndex: 0,
      keyTeller: 0,
      savedPos: 0,
      sectionsCount: []
    }
  },
  watch: {
    'settings.text' (val) {
      this.splitSlidesDebounce()
    },
    'settings.title' (val) {
      this.beamerTitleDebounce()
    },
    'settings.formatBeamer' (val) {
      this.beamerTitleDebounce()
      this.splitSlidesDebounce()
    },
    'settings.maxLivestreamChar' (val) {
      this.splitSlidesDebounce()
    },
    'savedPos' (val) {
      this.setActiveSlide()
    },
    'selectedSectionIndex' (val) {
      this.keyTeller++
    },
    'selectedSlideIndex' (val) {
      this.keyTeller++
    }
  },
  created () {
    this.beamerTitle()
    this.splitSlides()
    this.beamerTitleDebounce = debounce(this.beamerTitleDebounce, 500)
    this.splitSlidesDebounce = debounce(this.splitSlidesDebounce, 500)
  },
  methods: {
    min100 (val) {
      if (typeof val !== 'number') {
        return
      }
      return val >= 100 || 'Minimaal 100'
    },
    beamerTitle () {
      // title beamer
      this.beamerTitleLines = titleLines(this.settings.title, this.settings.formatBeamer)
      this.keyTeller++
    },
    beamerTitleDebounce () {
      this.beamerTitle()
    },
    splitSlides () {
      // slides livestream & beamer
      this.sections = splitTextCaption(this.settings.text, this.settings.formatBeamer, this.settings.maxLivestreamChar || 500)
      this.countCharSections()
      this.keyTeller++
    },
    splitSlidesDebounce () {
      this.splitSlides()
    },
    countCharSections () {
      const sumCharLength = []
      let sumLength = 0
      for (let i = 0; i < this.sections.length; i++) {
        for (let j = 0; j < this.sections[i].slides.length; j++) {
          if (this.sections[i].slides[j][0]) {
            const charLength = this.sections[i].slides[j][0]
              .replace(/<.+?>/g, '')
              .replace(/&nbsp;/g, ' ')
              .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') // html-entities
              .length
            sumLength += charLength
          }
          sumCharLength.push({ count: sumLength, section: i, slide: j })
        }
      }
      this.sectionsCount = sumCharLength
      this.setActiveSlide()
    },
    setActiveSlide () {
      if (!this.sectionsCount.length) {
        this.selectedSectionIndex = 0
        this.selectedSlideIndex = 0
        return
      }
      for (const slide of this.sectionsCount) {
        if (this.savedPos <= slide.count) {
          this.selectedSectionIndex = slide.section
          this.selectedSlideIndex = slide.slide
          return
        }
      }
      this.selectedSectionIndex = this.sectionsCount[this.sectionsCount.length - 1].section
      this.selectedSlideIndex = this.sectionsCount[this.sectionsCount.length - 1].slide
    }
  }
}
</script>

<style scoped>
.label {
  color: rgba(0, 0, 0, 0.6);
  font-size: 12px;
  line-height: 22px;
}

.preview {
  max-width: 700px;
}
</style>
