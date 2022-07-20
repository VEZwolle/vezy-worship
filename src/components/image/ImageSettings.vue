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
        <template v-if="fileUrl">
          <q-toggle v-model="settings.beamer.default" :label="settings.beamer.default ? 'Standaard (volledig breedte gebruiken)' : 'reset'" @update:model-value="updateBeamerDefault" />
          <div v-if="!settings.beamer.default" class="row">
            <div class="w-col1">
              <q-btn flat round dense :label="btnLabelZoomToggleBeamer" @click="toggleBeamerZoom" />
            </div>
            <div class="col">
              <q-slider
                v-model="settings.beamer.zoom"
                :min="0"
                :max="100"
                label
                :label-value="'Zoom: ' + settings.beamer.zoom + '%'"
                label-always
                class="slider-h"
                @update:model-value="toggleEqual"
              />
            </div>
          </div>
          <div v-if="!settings.beamer.default" class="row">
            <div class="w-col1">
              <q-btn flat round dense label="🗘" @click="resetBeamerAngle" />
            </div>
            <div class="col">
              <q-slider
                v-model="settings.beamer.rotate"
                :min="-180"
                :max="180"
                label
                :label-value="'Draai: ' + settings.beamer.rotate + '°'"
                label-always
                class="slider-h"
                @update:model-value="toggleEqual"
              />
            </div>
          </div>
          <div class="row position-relative">
            <div class="w-col1">
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
            </div>
            <div class="col preview">
              <OutputPreview :id="'beamer'" :component="ImageOutput" :presentation="{ settings }" />
              <div v-if="!settings.beamer.default" class="btn-position">
                <div>
                  <q-btn flat round dense label="⭶" @click="alignTopLeftBeamer" />
                  <q-btn flat round dense label="⭱" @click="alignTopBeamer" />
                  <q-btn flat round dense label="⭷" @click="alignTopRightBeamer" />
                </div>
                <div>
                  <q-btn flat round dense label="⭰" @click="alignLeftBeamer" />
                  <q-btn flat round dense label="⊙" @click="alignCenterBeamer" />
                  <q-btn flat round dense label="⭲" @click="alignRightBeamer" />
                </div>
                <div>
                  <q-btn flat round dense label="⭹" @click="alignBottomLeftBeamer" />
                  <q-btn flat round dense label="⭳" @click="alignBottomBeamer" />
                  <q-btn flat round dense label="⭸" @click="alignBottomRightBeamer" />
                </div>
              </div>
            </div>
          </div>
          <div v-if="!settings.beamer.default" class="row">
            <div class="w-col1" />
            <div class="col">
              <q-slider
                v-model="settings.beamer.x"
                :min="-110"
                :max="110"
                label
                :label-value="'Midden op: ' + settings.beamer.x + '%'"
                class="slider-h"
                @update:model-value="toggleEqual"
              />
            </div>
          </div>
          <div v-if="imageLoaded" class="image-dim">
            {{ settings.beamer.width }} x {{ settings.beamer.height }}
          </div>
        </template>
      </div>

      <div class="col" :class="{ disabled: equal }">
        <q-file v-model="fileLivestream" :readonly="equal" accept="image/*" label="Livestream" outlined @update:model-value="updateFileLivestream">
          <template #prepend>
            <q-icon name="image" />
          </template>
        </q-file>
        <template v-if="fileUrl">
          <q-toggle v-model="settings.livestream.default" :disable="equal" :label="settings.livestream.default ? 'Standaard (volledig breedte gebruiken)' : 'reset'" @update:model-value="updateLivestreamDefault" />
          <div v-if="!settings.livestream.default" class="row">
            <div class="w-col1">
              <q-btn flat round dense :label="btnLabelZoomToggleLivestream" @click="toggleLivestreamZoom" />
            </div>
            <div class="col">
              <q-slider
                v-model="settings.livestream.zoom"
                :disable="equal"
                :min="0"
                :max="100"
                label
                :label-value="'Zoom: ' + settings.livestream.zoom + '%'"
                label-always
                class="slider-h"
              />
            </div>
          </div>
          <div v-if="!settings.livestream.default" class="row">
            <div class="w-col1">
              <q-btn flat round dense label="🗘" @click="resetLivestreamAngle" />
            </div>
            <div class="col">
              <q-slider
                v-model="settings.livestream.rotate"
                :disable="equal"
                :min="-180"
                :max="180"
                label
                :label-value="'Draai: ' + settings.livestream.rotate + '°'"
                label-always
                class="slider-h"
              />
            </div>
          </div>
          <div class="row position-relative">
            <div class="w-col1">
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
            </div>
            <div class="col preview">
              <OutputPreview :id="'livestream'" :component="ImageOutput" :presentation="{ settings }" />
              <div v-if="!settings.livestream.default" class="btn-position">
                <div>
                  <q-btn flat round dense label="⭶" @click="alignTopLeftLivestream" />
                  <q-btn flat round dense label="⭱" @click="alignTopLivestream" />
                  <q-btn flat round dense label="⭷" @click="alignTopRightLivestream" />
                </div>
                <div>
                  <q-btn flat round dense label="⭰" @click="alignLeftLivestream" />
                  <q-btn flat round dense label="⊙" @click="alignCenterLivestream" />
                  <q-btn flat round dense label="⭲" @click="alignRightLivestream" />
                </div>
                <div>
                  <q-btn flat round dense label="⭹" @click="alignBottomLeftLivestream" />
                  <q-btn flat round dense label="⭳" @click="alignBottomLivestream" />
                  <q-btn flat round dense label="⭸" @click="alignBottomRightLivestream" />
                </div>
              </div>
            </div>
          </div>
          <div v-if="!settings.livestream.default" class="row">
            <div class="w-col1" />
            <div class="col">
              <q-slider
                v-model="settings.livestream.x"
                :disable="equal"
                :min="-110"
                :max="110"
                label
                :label-value="'Midden op: ' + settings.livestream.x + '%'"
                class="slider-h"
              />
            </div>
          </div>
          <div v-if="imageLoaded" class="image-dim">
            {{ settings.livestream.width }} x {{ settings.livestream.height }}
          </div>
        </template>
      </div>
    </div>
  </q-card-section>
</template>

<script>
import BaseSettings from '../presentation/BaseSettings.vue'
import OutputPreview from '../output/OutputPreview.vue'
import ImageOutput from './ImageOutput.vue'

export default {
  components: { OutputPreview },
  extends: BaseSettings,
  setup () {
    return { ImageOutput }
  },
  data () {
    return {
      file: null,
      fileLivestream: null,
      equal: true,
      btnLabelZoomToggleBeamer: '↕',
      btnLabelZoomToggleLivestream: '↕',
      imageLoaded: false // variabele voor inlezen maat image
    }
  },
  computed: {
    fileUrl () {
      return this.$store.media[this.settings.fileId]
    },
    fileLivestreamUrl () {
      return this.$store.media[this.settings.fileLivestreamId] || this.fileUrl
    },
    factorBeamer () {
      if (this.settings.beamer.width !== 0 && this.settings.beamer.height !== 0) {
        return (16 / 9) / (this.settings.beamer.width / this.settings.beamer.height)
      }
      return 1
    },
    factorLivestream () {
      if (this.settings.livestream.width !== 0 && this.settings.livestream.height !== 0) {
        return (16 / 9) / (this.settings.livestream.width / this.settings.livestream.height)
      }
      return 1
    }
  },
  created () {
    if (this.settings.fileLivestreamId || this.settings.beamer.zoom !== this.settings.livestream.zoom || this.settings.beamer.x !== this.settings.livestream.x || this.settings.beamer.y !== this.settings.livestream.y || this.settings.beamer.rotate !== this.settings.livestream.rotate) {
      this.equal = false
    }
  },
  methods: {
    updateFile (file) {
      this.settings.fileId = this.$store.addMedia(file)
      const imageUrl = URL.createObjectURL(file)
      this.settings.title = file.name
      // read witdh / height
      this.imageLoaded = false
      const img = new Image()
      img.onload = () => {
        this.settings.beamer.width = img.width
        this.settings.beamer.height = img.height
        this.imageLoaded = true
        this.toggleEqual()
      }
      img.src = imageUrl
    },
    updateFileLivestream (fileLivestream) {
      this.settings.fileLivestreamId = this.$store.addMedia(fileLivestream)
      const imageUrl = URL.createObjectURL(fileLivestream)
      // read witdh / height
      this.imageLoaded = false
      const img = new Image()
      img.onload = () => {
        this.settings.livestream.width = img.width
        this.settings.livestream.height = img.height
        this.imageLoaded = true
      }
      img.src = imageUrl
    },
    toggleEqual () {
      if (this.equal) {
        this.settings.fileLivestreamId = null
        this.fileLivestream = null
        this.settings.livestream.default = this.settings.beamer.default
        this.settings.livestream.width = this.settings.beamer.width
        this.settings.livestream.height = this.settings.beamer.height
        this.settings.livestream.zoom = this.settings.beamer.zoom
        this.settings.livestream.x = this.settings.beamer.x
        this.settings.livestream.y = this.settings.beamer.y
        this.settings.livestream.rotate = this.settings.beamer.rotate
        this.btnLabelZoomToggleLivestream = this.btnLabelZoomToggleBeamer
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
    toggleBeamerZoom () {
      if (this.btnLabelZoomToggleBeamer === '↕') {
        this.settings.beamer.zoom = 100 / this.factorBeamer
        this.btnLabelZoomToggleBeamer = '↔'
      } else {
        this.settings.beamer.zoom = 100
        this.btnLabelZoomToggleBeamer = '↕'
      }
      this.toggleEqual()
    },
    resetBeamerAngle () {
      this.settings.beamer.rotate = 0
      this.toggleEqual()
    },
    alignLeftBeamer () {
      this.settings.beamer.x = -50 + this.settings.beamer.zoom / 2
      this.settings.beamer.y = 0
      this.toggleEqual()
    },
    alignRightBeamer () {
      this.settings.beamer.x = 50 - this.settings.beamer.zoom / 2
      this.settings.beamer.y = 0
      this.toggleEqual()
    },
    alignTopBeamer () {
      this.settings.beamer.x = 0
      this.settings.beamer.y = (this.factorBeamer * this.settings.beamer.zoom - 100) / (this.factorBeamer + 1)
      this.toggleEqual()
    },
    alignBottomBeamer () {
      this.settings.beamer.x = 0
      this.settings.beamer.y = -1 * (this.factorBeamer * this.settings.beamer.zoom - 100) / (this.factorBeamer + 1)
      this.toggleEqual()
    },
    alignTopLeftBeamer () {
      this.settings.beamer.x = -50 + this.settings.beamer.zoom / 2
      this.settings.beamer.y = (this.factorBeamer * this.settings.beamer.zoom - 100) / (this.factorBeamer + 1)
      this.toggleEqual()
    },
    alignBottomLeftBeamer () {
      this.settings.beamer.x = -50 + this.settings.beamer.zoom / 2
      this.settings.beamer.y = -1 * (this.factorBeamer * this.settings.beamer.zoom - 100) / (this.factorBeamer + 1)
      this.toggleEqual()
    },
    alignBottomRightBeamer () {
      this.settings.beamer.x = 50 - this.settings.beamer.zoom / 2
      this.settings.beamer.y = -1 * (this.factorBeamer * this.settings.beamer.zoom - 100) / (this.factorBeamer + 1)
      this.toggleEqual()
    },
    alignTopRightBeamer () {
      this.settings.beamer.x = 50 - this.settings.beamer.zoom / 2
      this.settings.beamer.y = (this.factorBeamer * this.settings.beamer.zoom - 100) / (this.factorBeamer + 1)
      this.toggleEqual()
    },
    alignCenterBeamer () {
      this.settings.beamer.x = 0
      this.settings.beamer.y = 0
      this.toggleEqual()
    },
    updateLivestreamDefault () {
      if (this.settings.livestream.default) {
        this.settings.livestream.zoom = 100
        this.settings.livestream.x = 0
        this.settings.livestream.y = 0
        this.settings.livestream.rotate = 0
      }
    },
    toggleLivestreamZoom () {
      if (this.btnLabelZoomToggleLivestream === '↕') {
        this.settings.livestream.zoom = 100 / this.factorLivestream
        this.btnLabelZoomToggleLivestream = '↔'
      } else {
        this.settings.livestream.zoom = 100
        this.btnLabelZoomToggleLivestream = '↕'
      }
    },
    resetLivestreamAngle () {
      this.settings.livestream.rotate = 0
    },
    alignLeftLivestream () {
      this.settings.livestream.x = -50 + this.settings.livestream.zoom / 2
      this.settings.livestream.y = 0
    },
    alignRightLivestream () {
      this.settings.livestream.x = 50 - this.settings.livestream.zoom / 2
      this.settings.livestream.y = 0
    },
    alignTopLivestream () {
      this.settings.livestream.x = 0
      this.settings.livestream.y = (this.factorLivestream * this.settings.livestream.zoom - 100) / (this.factorLivestream + 1)
    },
    alignBottomLivestream () {
      this.settings.livestream.x = 0
      this.settings.livestream.y = -1 * (this.factorLivestream * this.settings.livestream.zoom - 100) / (this.factorLivestream + 1)
    },
    alignTopLeftLivestream () {
      this.settings.livestream.x = -50 + this.settings.livestream.zoom / 2
      this.settings.livestream.y = (this.factorLivestream * this.settings.livestream.zoom - 100) / (this.factorLivestream + 1)
    },
    alignBottomLeftLivestream () {
      this.settings.livestream.x = -50 + this.settings.livestream.zoom / 2
      this.settings.livestream.y = -1 * (this.factorLivestream * this.settings.livestream.zoom - 100) / (this.factorLivestream + 1)
    },
    alignBottomRightLivestream () {
      this.settings.livestream.x = 50 - this.settings.livestream.zoom / 2
      this.settings.livestream.y = -1 * (this.factorLivestream * this.settings.livestream.zoom - 100) / (this.factorLivestream + 1)
    },
    alignTopRightLivestream () {
      this.settings.livestream.x = 50 - this.settings.livestream.zoom / 2
      this.settings.livestream.y = (this.factorLivestream * this.settings.livestream.zoom - 100) / (this.factorLivestream + 1)
    },
    alignCenterLivestream () {
      this.settings.livestream.x = 0
      this.settings.livestream.y = 0
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
.preview {
  margin-right: 40px;
}
.slider-h {
  padding: 0px 40px 0px 0px;
}
.slider-v {
  padding: 0px 0px 0px 0px;
  height: 100%;
}
.image-dim {
  color: grey;
}
.w-col1 {
  width: 28px;
}
.position-relative {
  position: relative;
}
.btn-position {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  opacity: 0.5;
}
</style>
