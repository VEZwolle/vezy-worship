<template>
  <q-card-section>
    <q-input v-if="settings.beamer.fileUrl" v-model="settings.beamer.title" outlined label="Naam" :rules="['required']" class="q-mt-sm" />
    <q-toggle v-if="settings.beamer.fileUrl" v-model="equalFile" label="Zelfde bestand & positie voor Beamer & Livestream" @update:model-value="updateEqual" />
    <div class="row">
      <q-file v-model="file" accept="image/*" :label="labelFile" outlined class="width50" @update:model-value="update">
        <template #prepend>
          <q-icon name="image" />
        </template>
      </q-file>
      <q-file v-if="!equalFile" v-model="fileLivestream" accept="image/*" label="Selecteer afbeelding Livestream" outlined class="width50" @update:model-value="updateLivestream">
        <template #prepend>
          <q-icon name="image" />
        </template>
      </q-file>
    </div>
    <div v-if="settings.beamer.fileUrl" class="row">
      <div class="width50">
        <q-toggle v-model="beamerDefault" label="Volledig scherm gebruiken" @update:model-value="updateBeamerDefault" />
        <q-slider
          v-if="!beamerDefault"
          v-model="settings.beamer.zoom"
          :min="0"
          :max="100"
          label
          :label-value="'Zoom: ' + settings.beamer.zoom + '%'"
          label-always
          color="purple"
        />
        <q-slider
          v-if="!beamerDefault"
          v-model="settings.beamer.rotate"
          :min="-180"
          :max="180"
          label
          :label-value="'Draai: ' + settings.beamer.rotate + '%'"
          label-always
          color="purple"
        />
        <div class="row">
          <q-slider
            v-if="!beamerDefault"
            v-model="settings.beamer.y"
            vertical
            :min="-50"
            :max="150"
            label
            :label-value="'Midden op: ' + settings.beamer.y + '%'"
            label-always
            color="purple"
          />
          <div :style="styleOutputRoot">
            <div class="Output" :style="styleOutput">
              <img :src="settings.beamer.fileUrl" class="positionabsolute" :style="styleImgBeamer">
            </div>
          </div>
        </div>
        <q-slider
          v-if="!beamerDefault"
          v-model="settings.beamer.x"
          :min="-50"
          :max="150"
          label
          :label-value="'Midden op: ' + settings.beamer.x + '%'"
          label-always
          color="purple"
        />
      </div>
      <div v-if="settings.livestream.fileUrl && !equalFile" class="width50">
        <q-toggle v-model="livestreamDefault" label="Volledig scherm gebruiken" @update:model-value="updateLivestreamDefault" />
        <q-slider
          v-if="!livestreamDefault"
          v-model="settings.livestream.zoom"
          :min="0"
          :max="100"
          label
          :label-value="'Zoom: ' + settings.livestream.zoom + '%'"
          label-always
          color="purple"
        />
        <q-slider
          v-if="!livestreamDefault"
          v-model="settings.livestream.rotate"
          :min="-180"
          :max="180"
          label
          :label-value="'Draai: ' + settings.livestream.rotate + '%'"
          label-always
          color="purple"
        />
        <div class="row">
          <q-slider
            v-if="!livestreamDefault"
            v-model="settings.livestream.y"
            vertical
            :min="-50"
            :max="150"
            label
            :label-value="'Midden op: ' + settings.livestream.y + '%'"
            label-always
            color="purple"
          />
          <div :style="styleOutputRoot">
            <div class="Output" :style="styleOutput">
              <img :src="settings.livestream.fileUrl" class="positionabsolute" :style="styleImgLivestream">
            </div>
          </div>
        </div>
        <q-slider
          v-if="!livestreamDefault"
          v-model="settings.livestream.x"
          :min="-50"
          :max="150"
          label
          :label-value="'Midden op: ' + settings.livestream.x + '%'"
          label-always
          color="purple"
        />
      </div>
    </div>
  </q-card-section>
</template>

<script>
import BaseSettings from '../presentation/BaseSettings.vue'

export default {
  extends: BaseSettings,
  data () {
    return {
      file: null,
      fileLivestream: null,
      equalFile: true,
      beamerDefault: true,
      livestreamDefault: true,
      labelFile: 'Selecteer afbeelding',
      scale: 0
    }
  },
  computed: {
    styleOutputRoot () { // toekomst nog aanpassen aan output formaten, nu uitgegaan van zelfde maat
      return {
        width: 1920 * this.scale + 'px',
        height: 1080 * this.scale + 'px',
        overflow: 'hidden'
      }
    },
    styleOutput () { // toekomst nog aanpassen aan output formaten, nu uitgegaan van zelfde maat
      return {
        width: '1920px',
        height: '1080px',
        transform: `scale(${this.scale})`,
        transformOrigin: 'top left'
      }
    },
    styleImgBeamer () {
      return {
        width: this.settings.beamer.zoom + '%',
        left: this.settings.beamer.x - this.settings.beamer.zoom / 2 + '%',
        top: this.settings.beamer.y - this.settings.beamer.zoom / 2 + '%',
        transform: 'rotate(' + this.settings.beamer.rotate + 'deg)'
      }
    },
    styleImgLivestream () {
      return {
        width: this.settings.livestream.zoom + '%',
        left: this.settings.livestream.x - this.settings.livestream.zoom / 2 + '%',
        top: this.settings.livestream.y - this.settings.livestream.zoom / 2 + '%',
        transform: 'rotate(' + this.settings.livestream.rotate + 'deg)'
      }
    }
  },
  created () {
    if (this.settings.beamer.fileId !== this.settings.livestream.fileId) {
      this.equalFile = false
    }
  },
  mounted () { // toekomst nog aanpassen aan output formaten
    this.scale = ((this.$el.offsetWidth * 0.5) - 60) / 1920
  },
  methods: {
    update (file) {
      this.settings.beamer.fileId = this.$fs.createFileId(file)
      this.settings.beamer.fileUrl = URL.createObjectURL(file)
      this.settings.beamer.title = file.name
      this.updateEqual()
    },
    updateLivestream (fileLivestream) {
      this.settings.livestream.fileId = this.$fs.createFileId(fileLivestream)
      this.settings.livestream.fileUrl = URL.createObjectURL(fileLivestream)
      this.settings.livestream.title = fileLivestream.name
    },
    updateEqual () {
      if (this.equalFile) {
        this.settings.livestream.fileId = this.settings.beamer.fileId
        this.settings.livestream.fileUrl = this.settings.beamer.fileUrl
        this.settings.livestream.title = this.settings.beamer.title
        this.settings.livestream.zoom = this.settings.beamer.zoom
        this.settings.livestream.x = this.settings.beamer.x
        this.settings.livestream.y = this.settings.beamer.y
        this.settings.livestream.rotate = this.settings.beamer.rotate
        this.labelFile = 'Selecteer afbeelding'
      } else {
        this.labelFile = 'Selecteer afbeelding Beamer'
      }
    },
    updateBeamerDefault () {
      if (this.beamerDefault) {
        this.settings.beamer.zoom = 100
        this.settings.beamer.x = 50
        this.settings.beamer.y = 50
        this.settings.beamer.rotate = 0
      }
    },
    updateLivestreamDefault () {
      if (this.livestreamDefault) {
        this.settings.livestream.zoom = 100
        this.settings.livestream.x = 50
        this.settings.livestream.y = 50
        this.settings.livestream.rotate = 0
      }
    }
  }
}
</script>

<style scope>
.width50 {
  position: relative;
  width: 50%;
}
.Output {
  position: relative;
  background-color: grey;
}
.positionabsolute {
  position: absolute;
}

</style>
