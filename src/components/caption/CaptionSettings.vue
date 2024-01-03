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
                <OutputPreview :component="CaptionOutputBeamer" :presentation="{ settings, control }" bg-show="beamer" />
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
                <OutputPreview :component="CaptionOutputLivestream" :presentation="{ settings, control }" bg-show="livestream" />
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
      savedPos: 0,
      updated: false,
      sectionsCount: [],
      control: {
        sections: null,
        beamerTitleLines: null,
        selectedSectionIndex: 0,
        selectedSlideIndex: 0
      }
    }
  },
  watch: {
    'settings.text' (val) {
      this.updated = false
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
      this.updated = false
      this.splitSlidesDebounce()
    },
    'savedPos' (val) {
      if (this.updated) this.setActiveSlide()
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
      this.control.beamerTitleLines = titleLines(this.settings.title, this.settings.formatBeamer)
    },
    beamerTitleDebounce () {
      this.beamerTitle()
    },
    splitSlides () {
      // slides livestream & beamer
      this.control.sections = splitTextCaption(this.settings.text, this.settings.formatBeamer, this.settings.maxLivestreamChar || 500)
      this.countCharSections()
    },
    splitSlidesDebounce () {
      this.splitSlides()
    },
    countCharSections () {
      const sumCharLength = []
      let sumLength = 0
      for (let i = 0; i < this.control.sections.length; i++) {
        for (let j = 0; j < this.control.sections[i].slides.length; j++) {
          if (this.control.sections[i].slides[j][0]) {
            const charLength = this.control.sections[i].slides[j][0]
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
      this.updated = true
      this.setActiveSlide()
    },
    setActiveSlide () {
      if (!this.sectionsCount.length) {
        this.control.selectedSectionIndex = 0
        this.control.selectedSlideIndex = 0
        return
      }
      for (const slide of this.sectionsCount) {
        if (this.savedPos <= slide.count) {
          this.control.selectedSectionIndex = slide.section
          this.control.selectedSlideIndex = slide.slide
          return
        }
      }
      this.control.selectedSectionIndex = this.sectionsCount[this.sectionsCount.length - 1].section
      this.control.selectedSlideIndex = this.sectionsCount[this.sectionsCount.length - 1].slide
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
