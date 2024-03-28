<template>
  <q-editor
    ref="editor"
    v-model="content"
    :height="height"
    :toolbar="[]"
    content-class="scroll-y"
    class="q-mb-md"
    @paste.prevent.stop="pastePlainText"
    @dragstart="backup"
    @dragend="cleanText"
    @update:model-value="updateContent"
  />
</template>

<script>
import { CleanText } from './CleanText.js'
import { debounce, scroll } from 'quasar'
import { splitSong } from '../song/SongControl.vue'
import { getCaret, setCaret } from './Caret.js'
const { getScrollTarget, getVerticalScrollPosition, setVerticalScrollPosition } = scroll

export default {
  props: {
    modelValue: {
      type: String,
      required: true,
      default: ''
    },
    height: String,
    modelBackup: String
  },
  emits: [
    'update:modelValue',
    'update:modelBackup'
  ],
  data () {
    return {
      content: '',
      lastEmitText: '',
      lastEmitHtml: '',
      contentBackup: ''
    }
  },
  computed: {
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
      this.content = this.content.replace(/ {2}/g, '&nbsp;&nbsp;') // dubbele SPATIE vervangen
      this.cleanText()
    },
    cleanText () {
      // save q-editor cusor position (without new line) | saved in: this.$refs.editor.caret.savedPos
      this.$refs.editor.caret.savePosition()
      // only if active edit (had cursor selection) get/set caret position
      const cursorPosition = (this.$refs.editor.caret.savedPos > -1) ? getCaret(this.$refs.editor.getContentEl()) : false
      this.lastEmitText = this.htmlToText(CleanText(this.content))
      this.$emit('update:modelValue', this.lastEmitText)
      this.content = this.textToHtml(this.lastEmitText)
      if (cursorPosition) {
        // nexttick ivm caret without newline position of q-editor
        this.$nextTick(() => {
          setCaret(this.$refs.editor.getContentEl(), cursorPosition.start, cursorPosition.end)
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
        // do not use color end space now; first update caret.js toe use parent/child node change add/remove whith cound offset en startnode.
        // .replace(/((&nbsp;)+)<\/div>/g, '<span class="bg-grey-4">$1</span></div>') // color bg end space(s)
      if (!htmlText) return ''
      return htmlText
    }
  }
}
</script>
