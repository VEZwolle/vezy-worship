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
            <q-btn-dropdown
              split
              stack
              outline
              color="primary"
              label="Tekst inladen"
              icon="download"
              class="full-width"
              :disable-main-btn="!settings.chapter || !settings.verseFrom"
              :disable-dropdown="!settings.chapter || !settings.verseFrom || !settings.text"
              :loading="isLoadingScripture"
              @click="loadScripture(true)"
            >
              <q-list>
                <q-item v-close-popup clickable @click="loadScripture(false)">
                  <q-item-section>
                    <q-item-label>Toevoegen aan...</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
        </div>

        <VezyEditor ref="vezyEditor" v-model="settings.text" v-model:savedPos="savedPos" min-height="80px" />

        <CaptionSettingsPreview
          v-model:formatBeamer="settings.formatBeamer"
          v-model:formatLivestream="settings.formatLivestream"
          v-model:maxLivestreamChar="settings.maxLivestreamChar"
          :settings="settings"
          :saved-pos="savedPos"
        />
      </q-tab-panel>

      <q-tab-panel name="background">
        <BackgroundSetting v-model:bgFileId="settings.bgFileId" v-model:bgOpacity="settings.bgOpacity" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import BaseSettings from '../presentation/BaseSettings.vue'
import CaptionSettingsPreview from '../caption/CaptionSettingsPreview.vue'
import bibles from './bibles'
import books from './books'
import BackgroundSetting from '../presentation/BackgroundSetting.vue'
import VezyEditor from '../common/VezyEditor.vue'
import { CleanText } from '../common/CleanText.js'

export default {
  components: { CaptionSettingsPreview, BackgroundSetting, VezyEditor },
  extends: BaseSettings,
  data () {
    return {
      tab: 'text',
      titleBook: '',
      titleBible: '',
      isLoadingScripture: false,
      savedPos: 0
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
  created () {
    if (this.settings.title) {
      const i = this.settings.title.indexOf('<small>(')
      this.titleBook = i > -1 ? this.settings.title.substring(0, i - 1).trim() : this.settings.title
      this.titleBible = i > -1 ? this.settings.title.substring(i + 8, this.settings.title.length - 9).trim() : ''
    }
  },
  methods: {
    titleUpdate () {
      this.settings.title = this.titleBible ? `${this.titleBook} <small>(${this.titleBible})</small>` : `${this.titleBook}`
    },
    async loadScripture (newText = true) {
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

        if (newText) {
          this.settings.text = result.verses
            .reduce((result, verse) => `${result} <sup>${verse.verse}</sup> ${verse.content}`, '')
            .trim()
        } else {
          this.settings.text += `<div><br></div><div>${this.title}</div>`
          this.settings.text += result.verses
            .reduce((result, verse) => `${result} <sup>${verse.verse}</sup> ${verse.content}`, '')
            .trim()
        }
      } catch {
        this.$q.notify({ type: 'negative', message: 'Er is iets fout gegaan met het ophalen van de Bijbeltekst. Probeer het later opnieuw.' })
      } finally {
        this.isLoadingScripture = false
      }
      if (newText) {
        this.titleBook = this.title
        this.titleBible = this.settings.bible
        this.titleUpdate()
      }
      this.settings.text = CleanText(this.settings.text)
    },
    required (val) {
      return !!val || 'Verplicht'
    },
    min1 (val) {
      if (typeof val !== 'number') {
        return
      }
      return val > 0 || 'Minimaal 1'
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
