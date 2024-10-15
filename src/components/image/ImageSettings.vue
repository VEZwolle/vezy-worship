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
          <div class="row q-gutter-md">
            <div class="col">
              <q-input v-model="settings.title" outlined label="Naam" :rules="['required']" class="q-mt-sm" />
            </div>
            <div v-if="!defaultPresetId" class="col2">
              <q-btn-dropdown color="primary" label="standaard" class="q-mt-sm">
                <q-list>
                  <q-item v-for="preset, index of presentationPresets" :key="index" v-close-popup clickable @click="setPreset(preset.id)">
                    <q-item-section>
                      <q-item-label>{{ preset.settings.title }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
          </div>
          <div class="inputs-header">
            Selecteer afbeelding(en):
            <q-toggle v-model="equal" label="Zelfde bestand & positie voor beamer & livestream" @update:model-value="toggleEqual" />
          </div>

          <div class="row q-gutter-md">
            <div class="col">
              <ImageSelect :key="resetPreview" :label="equal ? 'Beamer & livestream' : 'Beamer'" :settings="settings.beamer" @update-file="updateTitle">
                <OutputPreview :component="ImageOutputBeamer" :presentation="{ settings }" bg-show="beamer" />
              </ImageSelect>
            </div>

            <div class="col" :class="{ disabled: equal }">
              <ImageSelect :key="equal + resetPreview" label="Livestream" :settings="equal ? settings.beamer : settings.livestream">
                <OutputPreview :component="ImageOutputLivestream" :presentation="{ settings }" bg-show="livestream" />
              </ImageSelect>
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
import ImageSelect from './ImageSelect.vue'
import BackgroundSetting from '../presentation/BackgroundSetting.vue'
import OutputPreview from '../output/OutputPreview.vue'
import ImageOutputBeamer from './ImageOutputBeamer.vue'
import ImageOutputLivestream from './ImageOutputLivestream.vue'
import presentationPresets from '../presentation-presets'

export default {
  components: { OutputPreview, ImageSelect, BackgroundSetting },
  extends: BaseSettings,
  setup () {
    return { ImageOutputBeamer, ImageOutputLivestream }
  },
  data () {
    return {
      tab: 'image',
      equal: !this.presentation.settings.livestream.fileId,
      resetPreview: 0
    }
  },
  computed: {
    presentationPresets () {
      return presentationPresets
    },
    defaultPresetId () {
      return this.presentationPresets.find(p => p.id === this.presentation.id) !== undefined
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
      if (file) this.settings.title = file.name
    },
    setPreset (id) {
      const preset = this.presentationPresets.find(p => p.id === id)
      this.settings.livestream = { ...preset.settings.livestream }
      this.settings.beamer = { ...preset.settings.beamer }
      this.resetPreview += 1
      this.equal = !this.settings.livestream.fileId
      this.settings.title = preset.settings.title
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
