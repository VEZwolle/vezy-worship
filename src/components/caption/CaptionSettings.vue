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
          <VezyEditor v-model="settings.text" min-height="80px" />

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
import CaptionOutputLivestream from './CaptionOutputLivestream.vue'
import CaptionOutputBeamer from './CaptionOutputBeamer.vue'
import BackgroundSetting from '../presentation/BackgroundSetting.vue'
import VezyEditor from '../common/VezyEditor.vue'

export default {
  components: { OutputPreview, BackgroundSetting, VezyEditor },
  extends: BaseSettings,
  setup () {
    return { CaptionOutputLivestream, CaptionOutputBeamer }
  },
  data () {
    return {
      tab: 'caption',
      formatLivestream: [
        'Standaard',
        'Breed',
        'Geen'
      ],
      formatBeamer: [
        'Geen',
        'Standaard',
        'Bijbeltekst',
        'Alleen tekst',
        'Titel',
        'Thema'
      ]
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
