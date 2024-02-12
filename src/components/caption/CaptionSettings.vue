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
          <VezyEditor ref="vezyEditor" v-model="settings.text" v-model:savedPos="savedPos" min-height="80px" />
          <CaptionSettingsPreview
            v-model:formatBeamer="settings.formatBeamer"
            v-model:formatLivestream="settings.formatLivestream"
            v-model:maxLivestreamChar="settings.maxLivestreamChar"
            :settings="settings"
            :saved-pos="savedPos"
          />
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
import CaptionSettingsPreview from './CaptionSettingsPreview.vue'
import BackgroundSetting from '../presentation/BackgroundSetting.vue'
import VezyEditor from '../common/VezyEditor.vue'

export default {
  components: { CaptionSettingsPreview, BackgroundSetting, VezyEditor },
  extends: BaseSettings,
  data () {
    return {
      tab: 'caption',
      savedPos: 0
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
