<template>
  <q-file v-model="file" accept="image/*" :label="label" outlined @update:model-value="updateFile">
    <template #prepend>
      <q-icon name="image" />
    </template>
  </q-file>

  <div v-if="fileUrl" class="q-mt-md">
    <!-- Zoom -->
    <div v-if="advanced" class="row">
      <div class="col-narrow">
        <q-btn flat round dense icon="zoom_out_map" size="sm" @click="resetZoom">
          <q-tooltip>Reset zoom naar 100%</q-tooltip>
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
    <div v-if="advanced" class="row">
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
      <div v-if="advanced" class="col-narrow">
        <q-slider
          v-model="settings.y"
          vertical
          :min="0"
          :max="100"
          label
          :label-value="`Vanaf top: ${settings.y}%`"
          class="full-height"
        />
      </div>

      <div class="col relative-position">
        <OutputPreview :component="ImageOutput" :presentation="{ settings }" />

        <div v-if="advanced" class="position-buttons">
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

    <div v-if="advanced" class="row">
      <div class="col-narrow" />

      <div class="col">
        <q-slider
          v-model="settings.x"
          :min="0"
          :max="100"
          label
          :label-value="`Vanaf links: ${settings.x}%`"
          class="q-pt-xs"
        />
      </div>
    </div>

    <div class="text-center q-mt-xs">
      <q-toggle v-model="advanced" size="xs" label="Geavanceerde instellingen">
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
  setup () {
    return { ImageOutput }
  },
  data () {
    return {
      file: null,
      advanced: this.settings.zoom !== 100,
      fitType: '↔'
    }
  },
  computed: {
    fileUrl () {
      return this.$store.media[this.settings.fileId]
    }
  },
  methods: {
    updateFile (file) {
      this.settings.fileId = this.$store.addMedia(file)

      if (!this.settings.title) {
        this.settings.title = file.name
      }
    },
    resetZoom () {
      this.settings.zoom = 100
    },
    resetRotate () {
      this.settings.rotate = 0
    },

    // Alignment
    alignTopLeft () {
      this.settings.x = 0
      this.settings.y = 0
    },
    alignTop () {
      this.settings.x = 50
      this.settings.y = 0
    },
    alignTopRight () {
      this.settings.x = 100
      this.settings.y = 0
    },
    alignLeft () {
      this.settings.x = 0
      this.settings.y = 50
    },
    alignCenter () {
      this.settings.x = 50
      this.settings.y = 50
    },
    alignRight () {
      this.settings.x = 100
      this.settings.y = 50
    },
    alignBottomLeft () {
      this.settings.x = 0
      this.settings.y = 100
    },
    alignBottom () {
      this.settings.x = 50
      this.settings.y = 100
    },
    alignBottomRight () {
      this.settings.x = 100
      this.settings.y = 100
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
