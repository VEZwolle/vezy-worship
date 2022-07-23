<template>
  <q-card-section>
    <q-input v-if="fileBeamerUrl" v-model="settings.title" outlined label="Naam" :rules="['required']" class="q-mt-sm" />
    <div class="inputs-header">
      Selecteer afbeelding(en)
      <q-btn-dropdown
        split
        flat
        no-caps
        dense
        label="Of kies een standaard"
        @click="updateFileDefault(imageDefaults[0].idName)"
      >
        <q-list>
          <q-item v-for="(imgDefault, index) in imageDefaults" :key="index" v-close-popup dense clickable @click="updateFileDefault(imgDefault.idName)">
            <q-item-section>
              <q-item-label>{{ imgDefault.title }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-toggle v-if="fileBeamerUrl" v-model="equal" label="Zelfde bestand & positie voor beamer & livestream" @update:model-value="toggleEqual" />
    </div>

    <div class="row q-gutter-md">
      <div class="col">
        <q-file v-model="file" accept="image/*" :label="equal ? 'Beamer & livestream' : 'Beamer'" outlined @update:model-value="updateFile">
          <template #prepend>
            <q-icon name="image" />
          </template>
        </q-file>
        <template v-if="fileBeamerUrl">
          <q-toggle v-model="settings.beamerDefault" :label="settings.beamerDefault ? 'Standaard (volledig breedte gebruiken)' : 'reset'" @update:model-value="updateBeamerDefault" />
          <div v-if="!settings.beamerDefault" class="row">
            <div class="w-col1">
              <q-btn flat round dense :label="btnLabelZoomToggleBeamer" @click="toggleBeamerZoom" />
            </div>
            <div class="col">
              <q-slider
                v-model="settings.beamerZoom"
                :min="0"
                :max="100"
                label
                :label-value="'Zoom: ' + settings.beamerZoom + '%'"
                label-always
                class="slider-h"
                @update:model-value="toggleEqual"
              />
            </div>
          </div>
          <div v-if="!settings.beamerDefault" class="row">
            <div class="w-col1">
              <q-btn flat round dense label="🗘" @click="resetBeamerAngle" />
            </div>
            <div class="col">
              <q-slider
                v-model="settings.beamerRotate"
                :min="-180"
                :max="180"
                label
                :label-value="'Draai: ' + settings.beamerRotate + '°'"
                label-always
                class="slider-h"
                @update:model-value="toggleEqual"
              />
            </div>
          </div>
          <div class="row position-relative">
            <div class="w-col1">
              <q-slider
                v-if="!settings.beamerDefault"
                v-model="settings.beamerY"
                vertical
                :min="-110"
                :max="110"
                label
                :label-value="'Midden op: ' + settings.beamerY + '%'"
                class="slider-v"
                @update:model-value="toggleEqual"
              />
            </div>
            <div class="col preview">
              <OutputPreview :id="'beamer'" :component="ImageOutput" :presentation="{ settings }" />
              <div v-if="!settings.beamerDefault" class="btn-position">
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
          <div v-if="!settings.beamerDefault" class="row">
            <div class="w-col1" />
            <div class="col">
              <q-slider
                v-model="settings.beamerX"
                :min="-110"
                :max="110"
                label
                :label-value="'Midden op: ' + settings.beamerX + '%'"
                class="slider-h"
                @update:model-value="toggleEqual"
              />
            </div>
          </div>
          <div v-if="imageLoaded" class="image-dim">
            {{ settings.beamerWidth }} x {{ settings.beamerHeight }}
          </div>
        </template>
      </div>

      <div class="col" :class="{ disabled: equal }">
        <q-file v-model="fileLivestream" :readonly="equal" accept="image/*" label="Livestream" outlined @update:model-value="updateFileLivestream">
          <template #prepend>
            <q-icon name="image" />
          </template>
        </q-file>
        <template v-if="fileBeamerUrl">
          <q-toggle v-model="settings.livestreamDefault" :disable="equal" :label="settings.livestreamDefault ? 'Standaard (volledig breedte gebruiken)' : 'reset'" @update:model-value="updateLivestreamDefault" />
          <div v-if="!settings.livestreamDefault" class="row">
            <div class="w-col1">
              <q-btn flat round dense :label="btnLabelZoomToggleLivestream" @click="toggleLivestreamZoom" />
            </div>
            <div class="col">
              <q-slider
                v-model="settings.livestreamZoom"
                :disable="equal"
                :min="0"
                :max="100"
                label
                :label-value="'Zoom: ' + settings.livestreamZoom + '%'"
                label-always
                class="slider-h"
              />
            </div>
          </div>
          <div v-if="!settings.livestreamDefault" class="row">
            <div class="w-col1">
              <q-btn flat round dense label="🗘" @click="resetLivestreamAngle" />
            </div>
            <div class="col">
              <q-slider
                v-model="settings.livestreamRotate"
                :disable="equal"
                :min="-180"
                :max="180"
                label
                :label-value="'Draai: ' + settings.livestreamRotate + '°'"
                label-always
                class="slider-h"
              />
            </div>
          </div>
          <div class="row position-relative">
            <div class="w-col1">
              <q-slider
                v-if="!settings.livestreamDefault"
                v-model="settings.livestreamY"
                :disable="equal"
                vertical
                :min="-110"
                :max="110"
                label
                :label-value="'Midden op: ' + settings.livestreamY + '%'"
                class="slider-v"
              />
            </div>
            <div class="col preview">
              <OutputPreview :id="'livestream'" :component="ImageOutput" :presentation="{ settings }" />
              <div v-if="!settings.livestreamDefault" class="btn-position">
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
          <div v-if="!settings.livestreamDefault" class="row">
            <div class="w-col1" />
            <div class="col">
              <q-slider
                v-model="settings.livestreamX"
                :disable="equal"
                :min="-110"
                :max="110"
                label
                :label-value="'Midden op: ' + settings.livestreamX + '%'"
                class="slider-h"
              />
            </div>
          </div>
          <div v-if="imageLoaded" class="image-dim">
            {{ settings.livestreamWidth }} x {{ settings.livestreamHeight }}
          </div>
        </template>
      </div>
    </div>
  </q-card-section>
</template>

<script>
import ImageDefault from './ImageDefault.vue'
import OutputPreview from '../output/OutputPreview.vue'
import ImageOutput from './ImageOutput.vue'

export default {
  components: { OutputPreview },
  extends: ImageDefault,
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
    factorBeamer () { // toekomst naar ratio output variabele
      if (this.settings.beamerWidth !== 0 && this.settings.beamerHeight !== 0) {
        return (16 / 9) / (this.settings.beamerWidth / this.settings.beamerHeight)
      }
      return 1
    },
    factorLivestream () { // toekomst naar ratio output variabele
      if (this.settings.livestreamWidth !== 0 && this.settings.livestreamHeight !== 0) {
        return (16 / 9) / (this.settings.livestreamWidth / this.settings.livestreamHeight)
      }
      return 1
    }
  },
  created () {
    if (this.settings.fileLivestreamId || this.settings.beamerZoom !== this.settings.livestreamZoom || this.settings.beamerX !== this.settings.livestreamX || this.settings.beamerY !== this.settings.livestreamY || this.settings.beamerRotate !== this.settings.livestreamRotate) {
      this.equal = false
    }
  },
  methods: {
    updateFileDefault (idName) {
      const imageDefault = this.imageDefaults.find(t => t.idName === idName)
      this.settings.fileId = idName
      this.settings.fileLivestreamId = idName
      this.settings.title = imageDefault.title
      this.settings.beamerWidth = imageDefault.width
      this.settings.beamerHeight = imageDefault.height
      this.settings.livestreamWidth = imageDefault.width
      this.settings.livestreamHeight = imageDefault.height
      this.settings.livestreamDefault = true
      this.settings.beamerDefault = true
      this.updateLivestreamDefault()
      this.updateBeamerDefault()
    },
    updateFile (file) {
      this.settings.fileId = this.$store.addMedia(file)
      const imageUrl = URL.createObjectURL(file)
      this.settings.title = file.name
      // read witdh / height
      this.imageLoaded = false
      const img = new Image()
      img.onload = () => {
        this.settings.beamerWidth = img.width
        this.settings.beamerHeight = img.height
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
        this.settings.livestreamWidth = img.width
        this.settings.livestreamHeight = img.height
        this.imageLoaded = true
      }
      img.src = imageUrl
    },
    toggleEqual () {
      if (this.equal) {
        this.settings.fileLivestreamId = null
        this.fileLivestream = null
        this.settings.livestreamDefault = this.settings.beamerDefault
        this.settings.livestreamWidth = this.settings.beamerWidth
        this.settings.livestreamHeight = this.settings.beamerHeight
        this.settings.livestreamZoom = this.settings.beamerZoom
        this.settings.livestreamX = this.settings.beamerX
        this.settings.livestreamY = this.settings.beamerY
        this.settings.livestreamRotate = this.settings.beamerRotate
        this.btnLabelZoomToggleLivestream = this.btnLabelZoomToggleBeamer
      } else {
        if (this.settings.livestreamZoom !== 100 || this.settings.livestreamX !== 0 || this.settings.livestreamY !== 0 || this.settings.livestreamRotate !== 0) {
          this.settings.livestreamDefault = false
        } else {
          this.settings.livestreamDefault = true
        }
      }
    },
    updateBeamerDefault () {
      if (this.settings.beamerDefault) {
        this.settings.beamerZoom = 100
        this.settings.beamerX = 0
        this.settings.beamerY = 0
        this.settings.beamerRotate = 0
      }
      this.toggleEqual()
    },
    toggleBeamerZoom () {
      if (this.btnLabelZoomToggleBeamer === '↕') {
        this.settings.beamerZoom = 100 / this.factorBeamer
        this.btnLabelZoomToggleBeamer = '↔'
      } else {
        this.settings.beamerZoom = 100
        this.btnLabelZoomToggleBeamer = '↕'
      }
      this.toggleEqual()
    },
    resetBeamerAngle () {
      this.settings.beamerRotate = 0
      this.toggleEqual()
    },
    alignLeftBeamer () {
      this.settings.beamerX = -50 + this.settings.beamerZoom / 2
      this.settings.beamerY = 0
      this.toggleEqual()
    },
    alignRightBeamer () {
      this.settings.beamerX = 50 - this.settings.beamerZoom / 2
      this.settings.beamerY = 0
      this.toggleEqual()
    },
    alignTopBeamer () {
      this.settings.beamerX = 0
      this.settings.beamerY = (this.factorBeamer * this.settings.beamerZoom - 100) / (this.factorBeamer + 1)
      this.toggleEqual()
    },
    alignBottomBeamer () {
      this.settings.beamerX = 0
      this.settings.beamerY = -1 * (this.factorBeamer * this.settings.beamerZoom - 100) / (this.factorBeamer + 1)
      this.toggleEqual()
    },
    alignTopLeftBeamer () {
      this.settings.beamerX = -50 + this.settings.beamerZoom / 2
      this.settings.beamerY = (this.factorBeamer * this.settings.beamerZoom - 100) / (this.factorBeamer + 1)
      this.toggleEqual()
    },
    alignBottomLeftBeamer () {
      this.settings.beamerX = -50 + this.settings.beamerZoom / 2
      this.settings.beamerY = -1 * (this.factorBeamer * this.settings.beamerZoom - 100) / (this.factorBeamer + 1)
      this.toggleEqual()
    },
    alignBottomRightBeamer () {
      this.settings.beamerX = 50 - this.settings.beamerZoom / 2
      this.settings.beamerY = -1 * (this.factorBeamer * this.settings.beamerZoom - 100) / (this.factorBeamer + 1)
      this.toggleEqual()
    },
    alignTopRightBeamer () {
      this.settings.beamerX = 50 - this.settings.beamerZoom / 2
      this.settings.beamerY = (this.factorBeamer * this.settings.beamerZoom - 100) / (this.factorBeamer + 1)
      this.toggleEqual()
    },
    alignCenterBeamer () {
      this.settings.beamerX = 0
      this.settings.beamerY = 0
      this.toggleEqual()
    },
    updateLivestreamDefault () {
      if (this.settings.livestreamDefault) {
        this.settings.livestreamZoom = 100
        this.settings.livestreamX = 0
        this.settings.livestreamY = 0
        this.settings.livestreamRotate = 0
      }
    },
    toggleLivestreamZoom () {
      if (this.btnLabelZoomToggleLivestream === '↕') {
        this.settings.livestreamZoom = 100 / this.factorLivestream
        this.btnLabelZoomToggleLivestream = '↔'
      } else {
        this.settings.livestreamZoom = 100
        this.btnLabelZoomToggleLivestream = '↕'
      }
    },
    resetLivestreamAngle () {
      this.settings.livestreamRotate = 0
    },
    alignLeftLivestream () {
      this.settings.livestreamX = -50 + this.settings.livestreamZoom / 2
      this.settings.livestreamY = 0
    },
    alignRightLivestream () {
      this.settings.livestreamX = 50 - this.settings.livestreamZoom / 2
      this.settings.livestreamY = 0
    },
    alignTopLivestream () {
      this.settings.livestreamX = 0
      this.settings.livestreamY = (this.factorLivestream * this.settings.livestreamZoom - 100) / (this.factorLivestream + 1)
    },
    alignBottomLivestream () {
      this.settings.livestreamX = 0
      this.settings.livestreamY = -1 * (this.factorLivestream * this.settings.livestreamZoom - 100) / (this.factorLivestream + 1)
    },
    alignTopLeftLivestream () {
      this.settings.livestreamX = -50 + this.settings.livestreamZoom / 2
      this.settings.livestreamY = (this.factorLivestream * this.settings.livestreamZoom - 100) / (this.factorLivestream + 1)
    },
    alignBottomLeftLivestream () {
      this.settings.livestreamX = -50 + this.settings.livestreamZoom / 2
      this.settings.livestreamY = -1 * (this.factorLivestream * this.settings.livestreamZoom - 100) / (this.factorLivestream + 1)
    },
    alignBottomRightLivestream () {
      this.settings.livestreamX = 50 - this.settings.livestreamZoom / 2
      this.settings.livestreamY = -1 * (this.factorLivestream * this.settings.livestreamZoom - 100) / (this.factorLivestream + 1)
    },
    alignTopRightLivestream () {
      this.settings.livestreamX = 50 - this.settings.livestreamZoom / 2
      this.settings.livestreamY = (this.factorLivestream * this.settings.livestreamZoom - 100) / (this.factorLivestream + 1)
    },
    alignCenterLivestream () {
      this.settings.livestreamX = 0
      this.settings.livestreamY = 0
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
  padding: 0px 0px 0px 28px;
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
