<template>
  <q-editor
    :id="id"
    ref="editor"
    v-model="content"
    :height="height"
    :toolbar="[]"
    content-class="scroll-y"
    class="q-mb-md"
    :class="borderReadOnlyClass"
    @paste.prevent.stop="pastePlainText"
    @dragstart="backup"
    @dragend="cleanText"
    @update:model-value="updateContent"
    @click.right="savePosition"
    @scroll="$emit('scroll')"
  />
  <q-menu context-menu :target="`#${id}`">
    <q-list dense>
      <q-item v-for="label, index of labels" :key="index" v-close-popup clickable @click="insertLabel(label.key)">
        <q-item-section>
          <q-item-label>{{ label.key }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script>
import { CleanText } from './CleanText.js'
import { debounce, scroll } from 'quasar'
import { splitSong } from '../song/SongControl.vue'
import { getCaretLine, setCaretLine } from './Caret.js'
import labels from '../song/labels.js'
const { getScrollTarget, getVerticalScrollPosition, setVerticalScrollPosition } = scroll

export default {
  props: {
    modelValue: {
      type: String,
      required: true,
      default: ''
    },
    height: String,
    modelBackup: String,
    id: {
      type: String,
      default: 'editor'
    },
    borderReadOnly: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'update:modelValue',
    'update:modelBackup', 'scroll'
  ],
  data () {
    return {
      content: '',
      lastEmitText: '',
      lastEmitHtml: '',
      contentBackup: '',
      savedPosition: null
    }
  },
  computed: {
    borderReadOnlyClass () {
      return this.borderReadOnly ? 'borderReadOnly' : ''
    },
    labels () {
      return labels
    },
    scrollEl () {
      // give content class - editor: "scroll" or "scroll-y" to find correct one
      return getScrollTarget(this.$refs.editor.getContentEl())
    }
  },
  watch: {
    'modelValue' (val) {
      if (this.lastEmitText !== val) {
        this.lastEmitText = val
        this.content = this.textToHtml(val)
      }
    },
    'content' (val) {
      if (this.lastEmitHtml !== val) this.updateContent()
    }
  },
  mounted () {
    this.content = this.textToHtml(this.modelValue)
    this.backup()
  },
  created () {
    this.cleanTextDebounce = debounce(this.cleanTextDebounce, 500)
  },
  methods: {
    savePosition () {
      this.savedPosition = getCaretLine(this.$refs.editor.getContentEl())
    },
    getScrollPosition () {
      return getVerticalScrollPosition(this.scrollEl) // returns a Number (pixels)
    },
    setScrollPosition (offset) {
      setVerticalScrollPosition(this.scrollEl, offset)
    },
    updateContent () {
      this.lastEmitHtml = this.content
      this.cleanTextDebounce()
    },
    pastePlainText (e) {
      this.backup()
      const text = e.clipboardData.getData('text/plain')
      this.$refs.editor.runCmd('insertText', text.replace(/(\r*\n)|(\r(?!\n))|(\v)/g, '\n')) // set all line breaks to \n [LF], due to proper convert to <br> and </div><div>
      // [CR][LF] = \r\n  |  [LF] = \n  |  [CR] = \r  |  [VT] = \v  (Carriage Return, Line Feed, Vertical Tab)
      // gebeurt bij text to html via clean text
      // this.content = this.content.replace(/ {2}/g, '&nbsp;&nbsp;') // dubbele SPATIE vervangen
      this.cleanText()
    },
    cleanText () {
      const cursorPosition = getCaretLine(this.$refs.editor.getContentEl())
      this.lastEmitText = this.htmlToText(CleanText(this.content))
      this.$emit('update:modelValue', this.lastEmitText)
      this.content = this.textToHtml(this.lastEmitText)
      if (cursorPosition) {
        // nexttick ivm caret without newline position of q-editor
        this.$nextTick(() => {
          setCaretLine(this.$refs.editor.getContentEl(), cursorPosition.start, cursorPosition.end)
        })
      }
    },
    cleanTextDebounce () {
      this.cleanText()
    },
    backup () {
      this.contentBackup = this.content
      this.$emit('update:modelBackup', this.htmlToText(CleanText(this.contentBackup)))
    },
    htmlToText (htmlText) {
      // first run cleantext in editor
      return htmlText
        .replace(/(<\/?b>)|(<\/?i>)|(<\/?u>)|(<\/?sup>)|(<\/?small>)*?/g, '') // verwijder alle opmaak elementen
        .replace(/^(<div><br><\/div>|<div>)/g, '') // verwijder 1e nieuwe regel of 1e regelstart
        .replace(/<div><br><\/div>/g, '\n') // vervang lege regel door newline
        .replace(/<div>/g, '\n') // vervang regelstart door newline
        .replace(/<\/div>/g, '') // verwijder overige </div>
        .replace(/&nbsp;/g, ' ') // html spatie --> spatie
    },
    textToHtml (text) {
      const sections = splitSong(text, 100, 0, false) // no auto split due to extra empty lines to be added
      let htmlText = ''
      for (const section of sections) { // beamer split
        if (section.label) {
          htmlText += `<div class="section-label text-white bg-${section.label.color}">${section.label.value}</div>`
        }
        for (const slide of section.slides) { // livestream split
          for (const line of slide) { // lines
            htmlText += line.length ? `<div>${line}</div>` : '<div><br></div>'
          }
        }
        htmlText += '<div class="bg-grey-3" style="font-size: 0.7em;"><br></div>' // empty line
      }
      htmlText = htmlText
        .replace(/<div class="bg-grey-3" style="font-size: 0.7em;"><br><\/div>$/g, '') // remove last section new line
        .replace(/ {2}/g, '&nbsp;&nbsp;') // replace dubble space with code otherwise it will not be displayed in editor
        .replace(/ <\/div>/g, '&nbsp;</div>') // replace end space with code otherwise it will not be displayed in editor
        .replace(/<div> /g, '<div>&nbsp;') // replace start space with code otherwise it will not be displayed in editor
        .replace(/((&nbsp;)+)<\/div>/g, '<span class="bg-grey-4">$1</span></div>') // color bg end space(s)
        .replace(/<div>((&nbsp;)+)/g, '<div><span class="bg-grey-4">$1</span>') // color bg start space(s)
      if (!htmlText) return ''
      return htmlText
    },
    insertLabel (textLabel) {
      this.backup()
      const cursorPosition = this.savedPosition
      const line = cursorPosition?.start.container[0] || 0
      const lines = this.htmlToText(CleanText(this.content)).replace(/\r?\n/g, '<br>').split('<br>')
      let insertLine = 0
      // search 1st empty line above text lines
      for (let lineNr = Math.min(line, lines.length - 1); lineNr >= 0; lineNr--) {
        if (lines[lineNr].length === 0) {
          insertLine = lineNr + 1
          break
        }
      }
      lines.splice(insertLine, 0, textLabel)
      this.lastEmitText = lines.join('\n')
      this.$emit('update:modelValue', this.lastEmitText)
      this.content = this.textToHtml(this.lastEmitText)
      if (cursorPosition) {
        // nexttick ivm caret without newline position of q-editor
        this.$nextTick(() => {
          setCaretLine(this.$refs.editor.getContentEl(), cursorPosition.start, cursorPosition.end)
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.borderReadOnly {
  border-style: dashed;
}
</style>
