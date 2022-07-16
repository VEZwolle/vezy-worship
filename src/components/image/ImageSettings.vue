<template>
  <q-card-section>
    <q-input v-if="fileUrl" v-model="settings.title" outlined label="Naam" :rules="['required']" class="q-mt-sm" />
    <div class="inputs-header">
      Selecteer afbeelding(en):
      <q-toggle v-if="fileUrl" v-model="equal" label="Zelfde bestand & positie voor beamer & livestream" @update:model-value="toggleEqual" />
    </div>

    <div class="row q-gutter-md">
      <div class="col">
        <q-file v-model="file" accept="image/*" :label="equal ? 'Beamer & livestream' : 'Beamer'" outlined @update:model-value="updateFile">
          <template #prepend>
            <q-icon name="image" />
          </template>
        </q-file>
        <q-toggle v-model="settings.beamer.default" label="Standaard (volledig breedte gebruiken)" @update:model-value="updateBeamerDefault" />
        <q-slider
          v-if="!settings.beamer.default"
          v-model="settings.beamer.zoom"
          :min="0"
          :max="100"
          label
          :label-value="'Zoom: ' + settings.beamer.zoom + '%'"
          label-always
          class="slider-h"
          @update:model-value="toggleEqual"
        />
        <q-slider
          v-if="!settings.beamer.default"
          v-model="settings.beamer.rotate"
          :min="-180"
          :max="180"
          label
          :label-value="'Draai: ' + settings.beamer.rotate + '%'"
          label-always
          class="slider-h"
          @update:model-value="toggleEqual"
        />
        <div class="row">
          <q-slider
            v-if="!settings.beamer.default"
            v-model="settings.beamer.y"
            vertical
            :min="-110"
            :max="110"
            label
            :label-value="'Midden op: ' + settings.beamer.y + '%'"
            class="slider-v"
            @update:model-value="toggleEqual"
          />
          <ImageOutput :id="'beamer'" :scale="scale" :presentation="presentation" />
        </div>
        <q-slider
          v-if="!settings.beamer.default"
          v-model="settings.beamer.x"
          :min="-110"
          :max="110"
          label
          :label-value="'Midden op: ' + settings.beamer.x + '%'"
          class="slider-h"
          @update:model-value="toggleEqual"
        />
        <div v-if="imageLoaded">
          {{ settings.beamer.width }} x {{ settings.beamer.height }}
        </div>
      </div>

      <div class="col" :class="{ disabled: equal }">
        <q-file v-model="fileLivestream" :readonly="equal" accept="image/*" label="Livestream" outlined @update:model-value="updateFileLivestream">
          <template #prepend>
            <q-icon name="image" />
          </template>
        </q-file>
        <q-toggle v-model="settings.livestream.default" :disable="equal" label="Standaard (volledig breedte gebruiken)" @update:model-value="updateLivestreamDefault" />
        <q-slider
          v-if="!settings.livestream.default"
          v-model="settings.livestream.zoom"
          :disable="equal"
          :min="0"
          :max="100"
          label
          :label-value="'Zoom: ' + settings.livestream.zoom + '%'"
          label-always
          class="slider-h"
        />
        <q-slider
          v-if="!settings.livestream.default"
          v-model="settings.livestream.rotate"
          :disable="equal"
          :min="-180"
          :max="180"
          label
          :label-value="'Draai: ' + settings.livestream.rotate + '%'"
          label-always
          class="slider-h"
        />
        <div class="row">
          <q-slider
            v-if="!settings.livestream.default"
            v-model="settings.livestream.y"
            :disable="equal"
            vertical
            :min="-110"
            :max="110"
            label
            :label-value="'Midden op: ' + settings.livestream.y + '%'"
            class="slider-v"
          />
          <ImageOutput :id="'livestream'" :scale="scale" :presentation="presentation" />
        </div>
        <q-slider
          v-if="!settings.livestream.default"
          v-model="settings.livestream.x"
          :disable="equal"
          :min="-110"
          :max="110"
          label
          :label-value="'Midden op: ' + settings.livestream.x + '%'"
          class="slider-h"
        />
        <div v-if="imageLoaded">
          {{ settings.livestream.width }} x {{ settings.livestream.height }}
        </div>
      </div>
    </div>
  </q-card-section>
</template>

<script>
import BaseSettings from '../presentation/BaseSettings.vue'
import ImageOutput from './ImageOutput.vue'

export default {
  components: { ImageOutput },
  extends: BaseSettings,
  data () {
    return {
      file: null,
      fileLivestream: null,
      equal: true,
      scale: 0,
      imageLoaded: false // tijdelijke var voor inlezen maat image
    }
  },
  computed: {
    fileUrl () {
      return this.$store.media[this.settings.beamer.fileId]
    },
    fileLivestreamUrl () {
      return this.$store.media[this.settings.livestream.fileId] || this.fileUrl
    }
  },
  created () {
    if (this.settings.livestream.fileId || this.settings.beamer.zoom !== this.settings.livestream.zoom || this.settings.beamer.x !== this.settings.livestream.x || this.settings.beamer.y !== this.settings.livestream.y || this.settings.beamer.rotate !== this.settings.livestream.rotate) {
      this.equal = false
    }
  },
  mounted () { // toekomst nog aanpassen aan output formaten
    this.scale = ((this.$el.offsetWidth * 0.5) - 80) / 1920
  },
  methods: {
    updateFile (file) {
      this.settings.beamer.fileId = this.$store.addMedia(file)
      const fileUrl = URL.createObjectURL(file)
      this.settings.title = file.name
      // read witdh / height
      this.imageLoaded = false
      const img = new Image()
      img.onload = () => {
        this.settings.beamer.width = img.width
        this.settings.beamer.height = img.height
        this.imageLoaded = true
      }
      img.src = fileUrl
      this.toggleEqual()
    },
    updateFileLivestream (fileLivestream) {
      this.settings.livestream.fileId = this.$store.addMedia(fileLivestream)
      const fileUrl = URL.createObjectURL(fileLivestream)
      // read witdh / height
      this.imageLoaded = false
      const img = new Image()
      img.onload = () => {
        this.settings.livestream.width = img.width
        this.settings.livestream.height = img.height
        this.imageLoaded = true
      }
      img.src = fileUrl
    },
    toggleEqual () {
      if (this.equal) {
        this.settings.livestream.fileId = null
        this.fileLivestream = null
        this.settings.livestream.width = this.settings.beamer.width
        this.settings.livestream.height = this.settings.beamer.height
        this.settings.livestream.zoom = this.settings.beamer.zoom
        this.settings.livestream.x = this.settings.beamer.x
        this.settings.livestream.y = this.settings.beamer.y
        this.settings.livestream.rotate = this.settings.beamer.rotate
        this.settings.livestream.default = this.settings.beamer.default
      } else {
        if (this.settings.livestream.zoom !== 100 || this.settings.livestream.x !== 0 || this.settings.livestream.y !== 0 || this.settings.livestream.rotate !== 0) {
          this.settings.livestream.default = false
        } else {
          this.settings.livestream.default = true
        }
      }
    },
    updateBeamerDefault () {
      if (this.settings.beamer.default) {
        this.settings.beamer.zoom = 100
        this.settings.beamer.x = 0
        this.settings.beamer.y = 0
        this.settings.beamer.rotate = 0
      }
      this.toggleEqual()
    },
    updateLivestreamDefault () {
      if (this.settings.livestream.default) {
        this.settings.livestream.zoom = 100
        this.settings.livestream.x = 0
        this.settings.livestream.y = 0
        this.settings.livestream.rotate = 0
      }
    }
  }
}
</script>

<style scoped>
.inputs-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.slider-h {
  padding: 0px 35px;
}
.slider-v {
  height: auto;
}
</style>
