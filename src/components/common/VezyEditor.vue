<template>
  <q-editor
    ref="editor"
    v-model="content"
    :min-height="minHeight"
    :toolbar="[['bold', 'italic', 'underline', 'superscript', 'removeFormat']]"
    class="q-mb-md"
    @paste.prevent.stop="pastePlainText"
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
      lastEmit: ''
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
      const text = e.clipboardData.getData('text/plain')
      this.$refs.editor.runCmd('insertText', text)
      // eslint-disable-next-line
      this.content = this.content.replace(/  /g, '&nbsp;&nbsp;').replace(/\r*\n/g, '<br>')
    },
    cleanText (e) {
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
    }
  }
}
</script>
