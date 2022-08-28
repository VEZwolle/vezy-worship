<template>
  <q-card-section>
    <label class="label">Titel</label>
    <q-input v-model="settings.title" outlined :rules="['required']" />
    <label class="label">Tekst</label>
    <q-editor ref="editor" v-model="settings.text" min-height="80px" :toolbar="[['bold', 'italic', 'underline']]" class="q-mb-md" @paste.prevent.stop="pastePlainText" />

    <div class="q-pa-md row q-gutter-md">
      <div class="col">
        <q-select v-model="settings.formatBeamer" :options="formatBeamer" fill-input outlined label="Opmaak type" />
        <label class="label">Voorbeeld Beamer</label>
        <div>
          <OutputPreview :component="CaptionOutputBeamer" :presentation="{ settings }" />
        </div>
      </div>
      <div class="col">
        <q-select v-model="settings.formatLivestream" :options="formatLivestream" fill-input outlined label="Opmaak type" />
        <label class="label">Voorbeeld Livestream</label>
        <div>
          <OutputPreview :component="CaptionOutputLivestream" :presentation="{ settings }" />
        </div>
      </div>
    </div>
  </q-card-section>
</template>

<script>
import BaseSettings from '../presentation/BaseSettings.vue'
import OutputPreview from '../output/OutputPreview.vue'
import CaptionOutputLivestream from './CaptionOutputLivestream.vue'
import CaptionOutputBeamer from './CaptionOutputBeamer.vue'

export default {
  components: { OutputPreview },
  extends: BaseSettings,
  setup () {
    return { CaptionOutputLivestream, CaptionOutputBeamer }
  },
  data () {
    return {
      formatLivestream: [
        'Standaard',
        'Groot rechts',
        'Groot onder'
      ],
      formatBeamer: [
        'Geen',
        'Standaard',
        'Standaard omgekeerd'
      ]
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
</style>
