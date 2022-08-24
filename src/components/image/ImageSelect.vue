<template>
  <q-file v-model="file" accept="image/*" :label="label" outlined @update:model-value="updateFile">
    <template #prepend>
      <q-icon name="image" />
    </template>
  </q-file>

  <div v-if="fileUrl" class="q-mt-md">
    <!-- Zoom -->
    <div v-if="settings.advanced" class="row">
      <div class="col-narrow">
        <q-btn flat round dense :label="fitType" size="sm" @click="resetToggleZoom">
          <q-tooltip>Reset zoom naar volledige breedte of hoogte</q-tooltip>
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
        <q-btn flat round dense icon="autorenew" size="sm" @click="resetRotate">
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
          :label-value="`Vanaf midden: ${settings.y}%`"
          class="full-height"
        />
      </div>

      <div class="col relative-position">
        <OutputPreview :component="ImageOutput" :presentation="{ settings }" />

        <div v-if="settings.advanced" class="position-buttons">
          <div>
            <q-btn flat round dense label="⭦" @click="alignTopLeft" />
            <q-btn flat round dense label="⭡" @click="alignTop" />
            <q-btn flat round dense label="⭧" @click="alignTopRight" />
          </div>
          <div>
            <q-btn flat round dense label="⭠" @click="alignLeft" />
            <q-btn flat round dense label="⊙" @click="alignCenter" />
            <q-btn flat round dense label="⭢" @click="alignRight" />
          </div>
          <div>
            <q-btn flat round dense label="⭩" @click="alignBottomLeft" />
            <q-btn flat round dense label="⭣" @click="alignBottom" />
            <q-btn flat round dense label="⭨" @click="alignBottomRight" />
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
          :label-value="`Vanaf midden: ${settings.x}%`"
          class="q-pt-xs"
        />
      </div>
    </div>

    <div class="text-center q-mt-xs">
      <q-toggle v-model="settings.advanced" size="xs" label="Geavanceerde instellingen" @click="toggleAdvanced">
        <q-tooltip>Toon instellingen als zoom, positie, etc.</q-tooltip>
      </q-toggle>
      <div v-if="imageLoaded" style="height: 0; overflow: hidden;">
        {{ settings.ratio }}
      </div>
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
  setup () {
    return { ImageOutput }
  },
  data () {
    return {
      file: null,
      fitType: '↕',
      imageLoaded: false // variabele voor inlezen maat image
    }
  },
  computed: {
    fileUrl () {
      return this.$store.media[this.settings.fileId]
    },
    factor () { // toekomst ratio output uit variabele halen
      if (this.settings.ratio !== null && this.settings.ratio !== 0) {
        return (16 / 9) / this.settings.ratio
      }
      return 1
    }
  },
  methods: {
    updateFile (file) {
      this.settings.fileId = this.$store.addMedia(file)
      if (!this.settings.title) { // dit gaat niet terug naar de titel --> zit nu onder sub van beamer of livestream
        this.settings.title = file.name
      }
      // read ratio (witdh / height)
      const imageUrl = URL.createObjectURL(file)
      this.imageLoaded = false
      const img = new Image()
      img.onload = () => {
        this.settings.ratio = (img.width / img.height)
        this.imageLoaded = true
      }
      img.src = imageUrl
    },
    resetToggleZoom () {
      if (this.fitType === '↕') {
        this.settings.zoom = 100 / this.factor
        this.fitType = '↔'
      } else {
        this.settings.zoom = 100
        this.fitType = '↕'
      }
    },
    resetRotate () {
      this.settings.rotate = 0
    },
    toggleAdvanced () {
      if (!this.settings.advanced) {
        this.settings.zoom = 100
        this.settings.rotate = 0
        this.settings.x = 0
        this.settings.y = 0
      }
    },

    // Alignment
    alignTopLeft () {
      this.settings.x = -50 + this.settings.zoom / 2
      this.settings.y = (this.factor * this.settings.zoom - 100) / (this.factor + 1)
    },
    alignTop () {
      this.settings.x = 0
      this.settings.y = (this.factor * this.settings.zoom - 100) / (this.factor + 1)
    },
    alignTopRight () {
      this.settings.x = 50 - this.settings.zoom / 2
      this.settings.y = (this.factor * this.settings.zoom - 100) / (this.factor + 1)
    },
    alignLeft () {
      this.settings.x = -50 + this.settings.zoom / 2
      this.settings.y = 0
    },
    alignCenter () {
      this.settings.x = 0
      this.settings.y = 0
    },
    alignRight () {
      this.settings.x = 50 - this.settings.zoom / 2
      this.settings.y = 0
    },
    alignBottomLeft () {
      this.settings.x = -50 + this.settings.zoom / 2
      this.settings.y = -1 * (this.factor * this.settings.zoom - 100) / (this.factor + 1)
    },
    alignBottom () {
      this.settings.x = 0
      this.settings.y = -1 * (this.factor * this.settings.zoom - 100) / (this.factor + 1)
    },
    alignBottomRight () {
      this.settings.x = 50 - this.settings.zoom / 2
      this.settings.y = -1 * (this.factor * this.settings.zoom - 100) / (this.factor + 1)
    }
  }
}
</script>

<style scoped lang="scss">
.col-narrow {
  width: 30px;
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
