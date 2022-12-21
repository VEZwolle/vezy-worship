<template>
  <q-card-section>
    <div class="row q-gutter-md">
      <div class="col">
        <q-input v-model="settings.title" outlined label="Naam" :rules="['required']" class="q-mt-sm" />
      </div>
      <div class="col2">
        <q-btn-dropdown color="primary" label="standaard afbeeldingen">
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
        <ImageSelect :label="equal ? 'Beamer & livestream' : 'Beamer'" :settings="settings.beamer" @update-file="updateTitle" />
      </div>

      <div class="col" :class="{ disabled: equal }">
        <ImageSelect :key="equal" label="Livestream" :settings="equal ? settings.beamer : settings.livestream" />
      </div>
    </div>
  </q-card-section>
</template>

<script>
import BaseSettings from '../presentation/BaseSettings.vue'
import ImageSelect from './ImageSelect.vue'
import presentationPresets from '../presentation-presets'

export default {
  components: { ImageSelect },
  extends: BaseSettings,
  data () {
    return {
      equal: !this.presentation.settings.livestream.fileId
    }
  },
  computed: {
    presentationPresets () {
      return presentationPresets
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
    },
    setPreset (id) {
      const preset = this.presentationPresets.find(p => p.id === id)
      this.settings.livestream = { ...preset.settings.livestream }
      this.settings.beamer = { ...preset.settings.beamer }
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
