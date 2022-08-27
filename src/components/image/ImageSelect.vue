<template>
  <q-file v-model="file" accept="image/*" :label="label" :loading="isLoading" outlined @update:model-value="updateFile">
    <template #prepend>
      <q-icon name="image" />
    </template>
  </q-file>

  <div v-if="fileUrl" class="q-mt-md">
    <!-- Zoom -->
    <div v-if="settings.advanced" class="row">
      <div class="col-narrow">
        <q-btn flat round dense :label="fitType" class="reset-button" @click="fit">
          <q-tooltip>Reset zoom naar volledige {{ fitType === '↕' ? 'hoogte' : 'breedte' }}</q-tooltip>
        </q-btn>
      </div>

      <div class="col">
        <q-slider
          v-model="settings.zoom"
          :min="0"
          :max="100"
          label
          :label-value="`Zoom: ${settings.zoom}%`"
          label-always
        />
      </div>
    </div>

    <!-- Rotate -->
    <div v-if="settings.advanced" class="row">
      <div class="col-narrow">
        <q-btn flat round dense label="🗘" class="reset-button" @click="resetRotate">
          <q-tooltip>Reset rotatie naar 0°</q-tooltip>
        </q-btn>
      </div>

      <div class="col">
        <q-slider
          v-model="settings.rotate"
          :min="-180"
          :max="180"
          label
          :label-value="`Rotatie: ${settings.rotate}°`"
          label-always
        />
      </div>
    </div>

    <div class="row">
      <div v-if="settings.advanced" class="col-narrow">
        <q-slider
          v-model="settings.y"
          vertical
          :min="-110"
          :max="110"
          label
          :label-value="`Vanaf midden: ${settings.y > 0 ? '+' : ''}${settings.y}%`"
          class="full-height"
        />
      </div>

      <div class="col relative-position">
        <OutputPreview :component="ImageOutput" :presentation="{ settings }" />

        <div v-if="settings.advanced" class="position-buttons">
          <div>
            <q-btn flat round dense label="⭦" @click="align('top', 'left')" />
            <q-btn flat round dense label="⭡" @click="align('top', 'center')" />
            <q-btn flat round dense label="⭧" @click="align('top', 'right')" />
          </div>
          <div>
            <q-btn flat round dense label="⭠" @click="align('center', 'left')" />
            <q-btn flat round dense label="⊙" @click="align('center', 'center')" />
            <q-btn flat round dense label="⭢" @click="align('center', 'right')" />
          </div>
          <div>
            <q-btn flat round dense label="⭩" @click="align('bottom', 'left')" />
            <q-btn flat round dense label="⭣" @click="align('bottom', 'center')" />
            <q-btn flat round dense label="⭨" @click="align('bottom', 'right')" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="settings.advanced" class="row">
      <div class="col-narrow" />

      <div class="col">
        <q-slider
          v-model="settings.x"
          :min="-110"
          :max="110"
          label
          :label-value="`Vanaf midden: ${settings.x > 0 ? '+' : ''}${settings.x}%`"
          class="q-pt-xs"
        />
      </div>
    </div>

    <div class="text-center q-mt-xs">
      <q-toggle v-model="settings.advanced" size="xs" label="Geavanceerde instellingen" @click="toggleAdvanced">
        <q-tooltip>Toon instellingen als zoom, positie, etc.</q-tooltip>
      </q-toggle>
    </div>
  </div>
</template>

<script>
import OutputPreview from '../output/OutputPreview.vue'
import ImageOutput from './ImageOutput.vue'

export default {
  components: { OutputPreview },
  props: {
    label: String,
    settings: Object
  },
  emits: ['updateFile'],
  setup () {
    return { ImageOutput }
  },
  data () {
    return {
      file: null,
      fitType: '↕',
      isLoading: false
    }
  },
  computed: {
    fileUrl () {
      return this.$store.media[this.settings.fileId]
    },
    factor () {
      return this.$store.outputRatio / this.settings.ratio
    }
  },
  methods: {
    async updateFile (file) {
      this.isLoading = true

      this.settings.ratio = await this.getImageRatio(file)
      this.settings.fileId = this.$store.addMedia(file)

      this.$emit('updateFile', file)

      this.isLoading = false
    },
    getImageRatio (file) {
      return new Promise((resolve) => {
        const img = new Image()

        img.onload = () => {
          const ratio = img.width / img.height
          resolve(ratio)
        }

        img.onerror = () => {
          resolve(1) // Default to 1:1 ratio if something goes wrong
        }

        img.src = URL.createObjectURL(file)
      })
    },
    fit () {
      if (this.fitType === '↕') {
        this.settings.zoom = 100 / this.factor
        this.fitType = '↔'
      } else {
        this.settings.zoom = 100
        this.fitType = '↕'
      }
    },
    reset () {
      this.resetZoom()
      this.resetRotate()
      this.resetPosition()
    },
    resetZoom () {
      this.settings.zoom = 100
    },
    resetRotate () {
      this.settings.rotate = 0
    },
    resetPosition () {
      this.settings.x = 0
      this.settings.y = 0
    },
    toggleAdvanced () {
      if (!this.settings.advanced) {
        this.reset()
      }
    },
    align (y, x) {
      const { zoom } = this.settings

      const top = ((this.factor * zoom) - 100) / (this.factor + 1)
      const bottom = -1 * top
      const left = -50 + (zoom / 2)
      const right = 50 - (zoom / 2)
      const center = 0

      const bounds = { top, bottom, left, right, center }

      this.settings.y = bounds[y]
      this.settings.x = bounds[x]
    }
  }
}
</script>

<style scoped lang="scss">
.col-narrow {
  width: 30px;
}

.reset-button {
  transform: translate(-3px, -4px);
}

.position-buttons {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  opacity: 0.3;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
}
</style>
