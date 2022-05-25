<template>
  <div class="caption-settings">
    <label class="label">Titel</label>
    <q-input v-model="settings.title" outlined :rules="['required']" />

    <label class="label">Tekst</label>
    <q-editor ref="editor" v-model="settings.text" min-height="5rem" :toolbar="[['bold', 'italic', 'underline']]" class="q-mb-md" @paste.prevent.stop="pastePlainText" />

    <label class="label">Preview</label>
    <OutputPreview :zoom="0.8">
      <CaptionOutput :presentation="{ settings }" />
    </OutputPreview>
  </div>
</template>

<script>
import BaseSettings from '../presentation/BaseSettings.vue'
import OutputPreview from '../output/OutputPreview.vue'
import CaptionOutput from './CaptionOutput.vue'

export default {
  components: { OutputPreview, CaptionOutput },
  extends: BaseSettings,
  methods: {
    pastePlainText (e) {
      const text = e.clipboardData.getData('text/plain')
      this.$refs.editor.runCmd('insertText', text)
    }
  }
}
</script>

<style scoped>
.label {
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.8rem;
  line-height: 1.5rem;
}

.caption {
  zoom: 0.7;
}
</style>
