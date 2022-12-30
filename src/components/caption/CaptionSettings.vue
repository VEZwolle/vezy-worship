<template>
  <div>
    <q-tabs v-model="tab" class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator :breakpoint="0">
      <q-tab name="caption" label="Ondertitel" />
      <q-tab name="background" label="Achtergrond" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="caption">
        <q-card-section>
          <label class="label">Titel</label>
          <q-input v-model="settings.title" outlined :rules="['required']" />

          <label class="label">Tekst</label>
          <q-editor ref="editor" v-model="settings.text" min-height="80px" :toolbar="[['bold', 'italic', 'underline']]" class="q-mb-md" @paste.prevent.stop="pastePlainText" />

          <label class="label">Preview</label>
          <div class="preview">
            <OutputPreview :component="CaptionOutput" :presentation="{ settings }" />
          </div>
        </q-card-section>
      </q-tab-panel>
      <q-tab-panel name="background">
        <BackgroundSetting v-model:bgFileId="settings.bgFileId" v-model:bgOpacity="settings.bgOpacity" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import BaseSettings from '../presentation/BaseSettings.vue'
import OutputPreview from '../output/OutputPreview.vue'
import CaptionOutput from './CaptionOutput.vue'
import BackgroundSetting from '../presentation/BackgroundSetting.vue'

export default {
  components: { OutputPreview, BackgroundSetting },
  extends: BaseSettings,
  setup () {
    return { CaptionOutput }
  },
  data () {
    return {
      tab: 'caption'
    }
  },
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

.preview {
  max-width: 700px;
}
</style>
