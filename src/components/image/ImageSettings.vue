<template>
  <div>
    <q-tabs v-model="tab" class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator :breakpoint="0">
      <q-tab name="image" label="Afbeelding" />
      <q-tab name="background" label="Achtergrond" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="image">
        <q-card-section>
          <q-input v-model="settings.title" outlined label="Naam" :rules="['required']" class="q-mt-sm" />
          <div class="inputs-header">
            Selecteer afbeelding(en):
            <q-toggle v-model="equal" label="Zelfde bestand & positie voor beamer & livestream" @update:model-value="toggleEqual" />
          </div>

          <div class="row q-gutter-md">
            <div class="col">
              <ImageSelect :label="equal ? 'Beamer & livestream' : 'Beamer'" :settings="settings.beamer" @update-file="updateTitle">
                <OutputPreview :component="ImageOutputBeamer" :presentation="{ settings }" />
              </ImageSelect>
            </div>

            <div class="col" :class="{ disabled: equal }">
              <ImageSelect :key="equal" label="Livestream" :settings="equal ? settings.beamer : settings.livestream">
                <OutputPreview :component="ImageOutputLivestream" :presentation="{ settings }" />
              </ImageSelect>
            </div>
          </div>
        </q-card-section>
      </q-tab-panel>
      <q-tab-panel name="background">
        <BackgroundSetting v-model:bgFileId="settings.bgFileId" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import BaseSettings from '../presentation/BaseSettings.vue'
import ImageSelect from './ImageSelect.vue'
import BackgroundSetting from '../presentation/BackgroundSetting.vue'
import OutputPreview from '../output/OutputPreview.vue'
import ImageOutputBeamer from './ImageOutputBeamer.vue'
import ImageOutputLivestream from './ImageOutputLivestream.vue'

export default {
  components: { OutputPreview, ImageSelect, BackgroundSetting },
  extends: BaseSettings,
  setup () {
    return { ImageOutputBeamer, ImageOutputLivestream }
  },
  data () {
    return {
      tab: 'image',
      equal: !this.presentation.settings.livestream.fileId
    }
  },
  methods: {
    toggleEqual (equal) {
      if (equal) {
        this.settings.livestream = {
          fileId: null,
          ratio: null,
          advanced: false,
          zoom: 100,
          x: 0,
          y: 0,
          rotate: 0
        }
      } else {
        this.settings.livestream = { ...this.settings.beamer }
      }
    },
    updateTitle (file) {
      this.settings.title = file.name
    }
  }
}
</script>

<style scoped>
.q-card__section {
  overflow-x: hidden;
}

.inputs-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.disabled {
  pointer-events: none;
}
</style>
