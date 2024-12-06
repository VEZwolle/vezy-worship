<template>
  <div class="row">
    <q-file v-model="file" accept="image/*" :label="label" :loading="isLoading" outlined class="col" @update:model-value="updateFile">
      <template #prepend>
        <q-icon name="image" />
      </template>
    </q-file>
    <q-btn-dropdown v-if="imageIds.length" :disable="!imageIds.length" flat>
      <q-list>
        <q-item v-for="id in imageIds" :key="id" v-close-popup clickable @click="setMedia(id)">
          <q-item-section>
            <q-img :src="$store.getMediaUrl(id)" loading="lazy" fit="contain" height="8vh" width="16vh">
              <q-tooltip>{{ id }}</q-tooltip>
            </q-img>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>

  <div v-if="fileUrl && imageSettings.ratio" class="q-mt-md">
    <!-- Zoom -->
    <div v-if="imageSettings.advanced" class="row">
      <div class="col-narrow">
        <q-btn flat round dense :label="fitType" class="reset-button" @click="fit">
          <q-tooltip>Reset zoom naar volledige {{ fitType === '↕' ? 'hoogte' : 'breedte' }}</q-tooltip>
        </q-btn>
      </div>

      <div class="col">
        <q-slider
          v-model="imageSettings.zoom"
          :min="0"
          :max="100"
          label
          :label-value="`Zoom: ${imageSettings.zoom}%`"
          label-always
        />
      </div>
    </div>

    <!-- Rotate -->
    <div v-if="imageSettings.advanced" class="row">
      <div class="col-narrow">
        <q-btn flat round dense label="🗘" class="reset-button" @click="resetRotate">
          <q-tooltip>Reset rotatie naar 0°</q-tooltip>
        </q-btn>
      </div>

      <div class="col">
        <q-slider
          v-model="imageSettings.rotate"
          :min="-180"
          :max="180"
          label
          :label-value="`Rotatie: ${imageSettings.rotate}°`"
          label-always
        />
      </div>
    </div>

    <div class="row">
      <div v-if="imageSettings.advanced" class="col-narrow">
        <q-slider
          v-model="imageSettings.y"
          vertical
          :min="-110"
          :max="110"
          label
          :label-value="`Vanaf midden: ${imageSettings.y > 0 ? '+' : ''}${imageSettings.y}%`"
          class="full-height"
        />
      </div>

      <div class="col relative-position">
        <slot />
        <div v-if="imageSettings.advanced" class="position-buttons">
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

    <div v-if="imageSettings.advanced" class="row">
      <div class="col-narrow" />

      <div class="col">
        <q-slider
          v-model="imageSettings.x"
          :min="-110"
          :max="110"
          label
          :label-value="`Vanaf midden: ${imageSettings.x > 0 ? '+' : ''}${imageSettings.x}%`"
          class="q-pt-xs"
        />
      </div>
    </div>

    <div class="text-center q-mt-xs">
      <q-toggle v-model="imageSettings.advanced" size="xs" label="Geavanceerde instellingen" @click="toggleAdvanced">
        <q-tooltip>Toon instellingen als zoom, positie, etc.</q-tooltip>
      </q-toggle>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    settings: Object
  },
  emits: ['updateFile'],
  data () {
    return {
      imageSettings: this.settings,
      file: null,
      fitType: '↕',
      isLoading: false
    }
  },
  computed: {
    fileUrl () {
      return this.$store.getMediaUrl(this.imageSettings.fileId)
    },
    factor () {
      if (this.$store.outputRatio && this.imageSettings.ratio) {
        return this.$store.outputRatio / this.imageSettings.ratio
      }
      return 1
    },
    imageIds () {
      return this.$store.getImageIds()
    }
  },
  methods: {
    async updateFile (file) {
      this.isLoading = true

      this.imageSettings.fileId = this.$store.addMedia(file)
      this.imageSettings.ratio = await this.getImageRatio(this.imageSettings.fileId)

      this.$emit('updateFile', file)

      this.isLoading = false
    },
    async setMedia (id) {
      this.file = null
      this.isLoading = true

      this.imageSettings.fileId = id
      this.imageSettings.ratio = await this.getImageRatio(id)

      this.isLoading = false
    },
    getImageRatio (id) {
      return new Promise((resolve) => {
        const img = new Image()

        img.onload = () => {
          const ratio = img.width / img.height
          resolve(ratio)
        }

        img.onerror = () => {
          resolve(1) // Default to 1:1 ratio if something goes wrong
        }

        img.src = this.$store.getMediaUrl(id)
      })
    },
    fit () {
      if (this.fitType === '↕') {
        this.imageSettings.zoom = 100 / this.factor
        this.fitType = '↔'
      } else {
        this.imageSettings.zoom = 100
        this.fitType = '↕'
      }
    },
    reset () {
      this.resetZoom()
      this.resetRotate()
      this.resetPosition()
    },
    resetZoom () {
      this.imageSettings.zoom = 100
    },
    resetRotate () {
      this.imageSettings.rotate = 0
    },
    resetPosition () {
      this.imageSettings.x = 0
      this.imageSettings.y = 0
    },
    toggleAdvanced () {
      if (!this.imageSettings.advanced) {
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

      this.imageSettings.y = bounds[y]
      this.imageSettings.x = bounds[x]
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
