<template>
  <q-card-section>
    <label class="label">Titel</label>
    <q-input v-model="settings.title" outlined :rules="['required']" />

    <label class="label">Tekst</label>
    <q-editor ref="editor" v-model="settings.text" min-height="80px" :toolbar="[['bold', 'italic', 'underline']]" class="q-mb-md" @paste.prevent.stop="pastePlainText" />

    <label class="label">Preview</label>
    <OutputPreview :zoom="0.8">
      <CaptionOutput :presentation="{ settings }" />
    </OutputPreview>
  </q-card-section>
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
  font-size: 12px;
  line-height: 22px;
}

.caption {
  zoom: 0.7;
}
</style>
