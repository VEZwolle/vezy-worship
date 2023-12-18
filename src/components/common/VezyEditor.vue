<template>
  <q-editor
    ref="editor"
    v-model="content"
    :definitions="{
      numberUp: {
        tip: 'Alle nummers naar superscript plaatsen',
        label: 'Nummers',
        handler: numberSup
      },
      restore: {
        tip: 'herstel vorige stand',
        icon: 'settings_backup_restore',
        handler: undochange
      }
    }"
    :min-height="minHeight"
    :toolbar="[['bold', 'italic', 'underline', 'superscript'],['removeFormat', 'numberUp', 'restore']]"
    class="q-mb-md"
    @paste.prevent.stop="pastePlainText"
    @dragstart="backup"
    @dragend="cleanText"
    @update:model-value="update"
  />
</template>

<script>
import { CleanText } from './CleanText.js'

export default {
  props: {
    modelValue: {
      type: String,
      required: true
    },
    minHeight: String
  },
  emits: [
    'update:modelValue'
  ],
  data () {
    return {
      content: '',
      lastEmit: '',
      contentBackup: ''
    }
  },
  watch: {
    'modelValue' (val) {
      if (this.lastEmit !== val) {
        this.lastEmit = val
        this.content = val
      }
    },
    'content' (val) {
      if (this.lastEmit !== val) this.update()
    }
  },
  mounted () {
    this.content = this.modelValue
    this.cleanText()
    this.backup()
  },
  beforeUnmount () {
    this.cleanText()
    this.update()
  },
  methods: {
    update () {
      this.lastEmit = this.content
      this.$emit('update:modelValue', this.content)
    },
    pastePlainText (e) {
      this.backup()
      const text = e.clipboardData.getData('text/plain')
      this.$refs.editor.runCmd('insertText', text.trim()) // begin/eind spaties e.d. verwijderen
      this.content = this.content
        .replace(/\r*\n/g, '<br>') // (Carriage Return[CR] en/of) Linefeed [LF] (alinea-eind)
        .replace(/\v/g, '<br>') // vertical tab [VT] (nieuwe regel)
        .replace(/ {2}/g, '&nbsp;&nbsp;') // dubbele SPATIE vervangen [VT] wordt ook als spatie gezien, hierna.)
        .replace(/<div> <\/div>/g, '') // <div>SPATIE</div> verwijderen
        .replace(/ <div>/g, '<div>').replace(/ <\/div>/g, '</div>') // SPATIE<div> verwijderen & SPATIE</div> verwijderen
        // uitzoeken losse <br> aanpassen naar <div> etc. volgens editor manier
    },
    cleanText () {
      this.content = CleanText(this.content)
    },
    numberSup () {
      this.backup()
      const contents = this.content.split('<sup>')
      let result = contents[0].replace(/(\d\w|\d)/g, '<sup>$1</sup>')
      for (let i = 1; i < contents.length; i++) {
        const supNormal = contents[i].split('</sup>')
        if (supNormal.length === 1) {
          result += '<sup>' + supNormal[0]
        } else {
          result += '<sup>' + supNormal[0] + '</sup>'
          for (let j = 1; j < supNormal.length; j++) {
            result += supNormal[j].replace(/(\d\w|\d)/g, '<sup>$1</sup>')
          }
        }
      }
      this.content = result
    },
    backup () {
      this.contentBackup = this.content
    },
    undochange () {
      const b = this.content
      this.content = this.contentBackup
      this.contentBackup = b
    }
  }
}
</script>
