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
      this.$refs.editor.runCmd('insertText', text)
      // eslint-disable-next-line
      this.content = this.content.replace(/  /g, '&nbsp;&nbsp;').replace(/\r*\n/g, '<br>')
    },
    cleanText () {
      let text = this.content
        .replace(/<\/?span(.*?)>/gi, '') //    verwijder alle <span ...> & </span> elementen
        .replace(/ style="(.*?);">/gi, '>') // verwijder alle extra "style" elementen
        .replace(/\r*\n/g, '<br>') //          nieuwe regeleinde vervangen door <br>, soms door plakken/drag-drop.
        .replace(/(?<!&nbsp;| )&nbsp;(?!&nbsp;| )/g, ' ').replace(/(?<=>) (?=<)/g, '&nbsp;') //                       losse spaties als ' ' plaatsen, tenzij tussen <div> </div>
        .replace(/([^>])((<\/?([briuspmal]*?)>)*?)<br>((<\/([biuspmal]*?)>)*?)<\/div><div>/g, '$1$2$5</div><div>') // drag-drop to empy line, remove <br>
        .replace(/([^>])((<\/?([briuspmal]*?)>)*?)<br>((<\/([biuspmal]*?)>)*?)<div>/g, '$1$2$5<div>') //              drag-drop to empy line, remove <br>
      let textStep = ''
      while (textStep !== text) {
        textStep = text
        text = text.replace(/<([biuspmal]*?)><\/\1>/g, '').replace(/<\/([biuspmal]*?)><\1>/g, '') // opmaak aan & direct weer uit <i></i> of andersom </i><i> er uit halen. (5x?? genesteld mogelijk)
      }
      this.content = text.replace(/(<div>){2,}/g, '<div>').replace(/(<\/div>){2,}/g, '</div>') // vervang dubbele (of meer) <div> door een enkele
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
