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

        <q-editor
          ref="editor"
          v-model="settings.text"
          min-height="50vh"
          :toolbar="[['bold', 'italic', 'underline', 'superscript', 'removeFormat']]"
          @paste.prevent.stop="pastePlainText"
          @dragend="removeTextSize"
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
import bibles from './bibles'
import books from './books'
import BackgroundSetting from '../presentation/BackgroundSetting.vue'

export default {
  components: { BackgroundSetting },
  extends: BaseSettings,
  data () {
    return {
      tab: 'text',
      titleBook: '',
      titleBible: '',
      isLoadingScripture: false
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
  mounted () {
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
    pastePlainText (e) {
      const text = e.clipboardData.getData('text/plain')
      this.$refs.editor.runCmd('insertText', text)
      // eslint-disable-next-line
      this.settings.text = this.settings.text.replace(/  /g, '&nbsp;&nbsp;').replace(/\r*\n/g, '<br>')
    },
    removeTextSize (e) {
      this.settings.text = this.settings.text
        .replace(/<\/?span(.*?)>/gi, '')
        .replace(/ style="(.*?);">/gi, '>')
        .replace(/\r*\n/g, '<br>') // nieuwe regeleinde vervangen door <br>, soms door plakken/drag-drop.
        .replace(/<([biuspmal]*?)><\/\1>/g, '').replace(/<\/([biuspmal]*?)><\1>/g, '') // opmaak aan & direct weer uit <i></i> of andersom </i><i> er uit halen. (5x?? genesteld mogelijk)
        .replace(/<([biuspmal]*?)><\/\1>/g, '').replace(/<\/([biuspmal]*?)><\1>/g, '') // herhaal
        .replace(/<([biuspmal]*?)><\/\1>/g, '').replace(/<\/([biuspmal]*?)><\1>/g, '') // herhaal
        .replace(/<([biuspmal]*?)><\/\1>/g, '').replace(/<\/([biuspmal]*?)><\1>/g, '') // herhaal
        .replace(/<([biuspmal]*?)><\/\1>/g, '').replace(/<\/([biuspmal]*?)><\1>/g, '') // herhaal
        .replace(/(<div>){2,}/g, '<div>').replace(/(<\/div>){2,}/g, '</div>') // vervang dubbele (of meer) <div> door een enkele
        .replace(/(?<!&nbsp;| )&nbsp;(?!&nbsp;| )/g, ' ').replace(/(?<=>) (?=<)/g, '&nbsp;') // losse spaties als ' ' plaatsen, tenzij tussen <div> </div>
        .replace(/([^>])((<\/?([briuspmal]*?)>)*?)<br>((<\/([biuspmal]*?)>)*?)<\/div><div>/g, '$1$2$5</div><div>') // drag-drop to empy line
        .replace(/([^>])((<\/?([briuspmal]*?)>)*?)<br>((<\/([biuspmal]*?)>)*?)<div>/g, '$1$2$5<div>') // drag-drop to empy line
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
