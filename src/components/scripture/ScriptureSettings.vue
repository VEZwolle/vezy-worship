<template>
  <div>
    <q-tabs v-model="tab" class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator :breakpoint="0">
      <q-tab name="text" label="Bijbeltekst" />
      <q-tab name="background" label="Achtergrond" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="text">
        <div class="row">
          <div class="col">
            <q-input v-model="titleBook" outlined label="Titel (boek, vers)" :rules="['required']" @change="titleUpdate" />
          </div>
          <div class="col q-pl-sm">
            <q-input v-model="titleBible" outlined label="Titel (vertaling)" :rules="['required']" @change="titleUpdate" />
          </div>
        </div>

        <div class="row">
          <div class="col-4">
            <q-select
              v-model="settings.bible"
              label="Bijbel"
              emit-value
              map-options
              outlined
              options-dense
              :options="bibleOptions"
            />
          </div>

          <div class="col-3 q-pl-sm">
            <q-select
              v-model="settings.book"
              label="Boek"
              emit-value
              map-options
              outlined
              options-dense
              :options="bookOptions"
            />
          </div>

          <div class="col-1 q-pl-sm">
            <q-input
              v-model.number="settings.chapter"
              type="number"
              outlined
              stack-label
              min="1"
              label="Hoofdstuk"
              :rules="[required, min1]"
            />
          </div>

          <div class="col-1 q-pl-sm">
            <q-input
              v-model.number="settings.verseFrom"
              type="number"
              outlined
              stack-label
              min="1"
              label="Vers van"
              :rules="[required, min1]"
            />
          </div>

          <div class="col-1 q-pl-sm">
            <q-input
              v-model.number="settings.verseTo"
              type="number"
              outlined
              stack-label
              min="1"
              label="Vers t/m"
              :rules="[min1]"
            />
          </div>

          <div class="col-2 q-pl-sm">
            <q-btn
              stack
              outline
              color="primary"
              label="Tekst inladen"
              icon="download"
              class="full-width"
              :disabled="!settings.chapter || !settings.verseFrom"
              :loading="isLoadingScripture"
              @click="loadScripture"
            />
          </div>
        </div>

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
              <q-select v-model="settings.formatLivestream" :options="formatLivestream" fill-input outlined class="col q-pb-none" label="Opmaak type" />
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
import CaptionOutputLivestream from '../caption/CaptionOutputLivestream.vue'
import CaptionOutputBeamer from '../caption/CaptionOutputBeamer.vue'
import bibles from './bibles'
import books from './books'
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
      tab: 'text',
      titleBook: '',
      titleBible: '',
      isLoadingScripture: false,
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
  computed: {
    title () {
      const bookDefinition = books.find(b => b.id === this.settings.book)
      let title = `${bookDefinition.name} ${this.settings.chapter}:${this.settings.verseFrom}`
      if (this.settings.verseTo) {
        title += `-${this.settings.verseTo}`
      }
      return `${title}`
    },
    bibleOptions () {
      return bibles.map(b => ({
        label: b.name,
        value: b.id
      }))
    },
    bookOptions () {
      return books.map(b => ({
        label: b.name,
        value: b.id
      }))
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
    if (this.settings.title) {
      const i = this.settings.title.indexOf('<small>(')
      this.titleBook = i > -1 ? this.settings.title.substring(0, i - 1).trim() : this.settings.title
      this.titleBible = i > -1 ? this.settings.title.substring(i + 8, this.settings.title.length - 9).trim() : ''
    }
    this.beamerTitle()
    this.splitSlides()
    this.beamerTitleDebounce = debounce(this.beamerTitleDebounce, 500)
    this.splitSlidesDebounce = debounce(this.splitSlidesDebounce, 500)
  },
  mounted () {
  },
  methods: {
    titleUpdate () {
      this.settings.title = this.titleBible ? `${this.titleBook} <small>(${this.titleBible})</small>` : `${this.titleBook}`
    },
    async loadScripture () {
      this.isLoadingScripture = true

      try {
        const { bible, book, chapter, verseFrom, verseTo } = this.settings

        const result = await this.$api.post('/scripture', {
          bible,
          book,
          chapter,
          verseFrom,
          verseTo
        })

        this.settings.text = result.verses
          .reduce((result, verse) => `${result} <sup>${verse.verse}</sup> ${verse.content}`, '')
          .trim()
      } catch {
        this.$q.notify({ type: 'negative', message: 'Er is iets fout gegaan met het ophalen van de Bijbeltekst. Probeer het later opnieuw.' })
      } finally {
        this.isLoadingScripture = false
      }
      this.titleBook = this.title
      this.titleBible = this.settings.bible
      this.titleUpdate()
    },
    required (val) {
      return !!val || 'Verplicht'
    },
    min1 (val) {
      if (typeof val !== 'number') {
        return
      }
      return val > 0 || 'Minimaal 1'
    },
    min100 (val) {
      if (typeof val !== 'number') {
        return
      }
      return val >= 100 || 'Minimaal 100'
    },
    beamerTitle () {
      // title beamer
      this.titleUpdate()
      this.beamerTitleLines = titleLines(this.settings.title, this.settings.formatBeamer)
      this.keyTeller++
    },
    beamerTitleDebounce () {
      this.beamerTitle()
    },
    splitSlides () {
      // slides livestream & beamer
      this.sections = splitTextCaption(this.settings.text, this.settings.formatBeamer, this.settings.maxLivestreamChar || 350)
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
</style>
