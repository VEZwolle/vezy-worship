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
              label="Hoofdstuk"
              :rules="['required']"
            />
          </div>

          <div class="col-1 q-pl-sm">
            <q-input
              v-model.number="settings.verseFrom"
              type="number"
              outlined
              stack-label
              label="Vers van"
              :rules="['required']"
            />
          </div>

          <div class="col-1 q-pl-sm">
            <q-input
              v-model.number="settings.verseTo"
              type="number"
              outlined
              stack-label
              label="Vers t/m"
              :rules="['required']"
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

        <q-editor
          ref="editor"
          v-model="settings.text"
          min-height="60vh"
          :toolbar="[['bold', 'italic', 'underline', 'superscript']]"
          @paste.prevent.stop="pastePlainText"
        />
      </q-tab-panel>

      <q-tab-panel name="background">
        <q-file v-model="background" accept="image/*" label="Selecteer achtergrondafbeelding" outlined @update:model-value="updateBackground">
          <template #prepend>
            <q-icon name="image" />
          </template>

          <template v-if="settings.backgroundImageId" #append>
            <q-icon name="cancel" class="cursor-pointer" @click="resetBackground" />
          </template>
        </q-file>

        <img :src="backgroundUrl" class="q-mt-sm full-width">
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import BaseSettings from '../presentation/BaseSettings.vue'
import bibles from './bibles'
import books from './books'

export default {
  extends: BaseSettings,
  data () {
    return {
      tab: 'text',
      background: null,
      isLoadingScripture: false
    }
  },
  computed: {
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
    },
    backgroundUrl () {
      return this.$store.media[this.settings.backgroundImageId || this.$store.service.backgroundImageId]
    }
  },
  methods: {
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
    },
    pastePlainText (e) {
      const text = e.clipboardData.getData('text/plain')
      this.$refs.editor.runCmd('insertText', text)
    },
    updateBackground (file) {
      this.settings.backgroundImageId = this.$store.addMedia(file)
    },
    resetBackground () {
      this.settings.backgroundImageId = null
      this.background = null
    }
  }
}
</script>
