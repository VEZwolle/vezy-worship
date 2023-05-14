<template>
  <q-card-section>
    <q-input v-if="fileUrl" v-model="settings.title" outlined label="Naam" :rules="['required']" class="q-mt-sm" />

    <q-file v-model="file" accept="video/*" label="Selecteer video" outlined @update:model-value="update">
      <template #prepend>
        <q-icon name="smart_display" />
      </template>
    </q-file>

    <div v-if="fileUrl">
      <div class="q-pa-md row">
        <video
          v-if="fileUrl"
          ref="player"
          :src="fileUrl"
          controls
          muted
          playsinline
          disablePictureInPicture
          controlsList="nodownload noremoteplayback noplaybackrate"
          x-webkit-airplay="deny"
          class="full-width"
          @timeupdate="timeupdate"
          @loadedmetadata="loadedmetadata"
        />
      </div>

      <div class="q-px-xl q-py-md row">
        <q-range
          v-model="range"
          :min="0"
          :max="duration"
          :left-label-value="rangeTimeMinFormat"
          :right-label-value="rangeTimeMaxFormat"
          label-always
          color="secondary"
          @change="rangeChange"
        />
      </div>
      <div class="q-pa-md row">
        <div class="col2">
          <q-btn color="primary" icon="first_page" label="huidig = start positie" class="float-left" dense @click="setStartTime" />
          <q-btn round color="secondary" icon="play_arrow" class="float-left" dense @click="playStart">
            <q-tooltip>speel vanaf start positie af</q-tooltip>
          </q-btn>
        </div>
        <div class="col" />
        <div class="col2">
          <q-btn color="primary" icon-right="last_page" label="huidig = stop positie" dense class="float-right" @click="setEndTime" />
          <q-btn round color="secondary" icon="play_arrow" class="float-right" dense @click="playEnd">
            <q-tooltip>speel laatste 5 sec af</q-tooltip>
          </q-btn>
          <br>
          <q-toggle v-model="endPause" label="Stop op 'stop positie'" left-label class="float-right" />
        </div>
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
      duration: 0,
      range: {
        min: 0,
        max: this.duration
      },
      endPause: false
    }
  },
  computed: {
    fileUrl () {
      return this.$store.getMediaUrl(this.settings.fileId)
    },
    rangeTimeMinFormat () {
      return timeFormat(this.range.min)
    },
    rangeTimeMaxFormat () {
      return timeFormat(this.range.max)
    }
  },
  methods: {
    setStartTime () {
      if (this.$refs.player.currentTime >= this.range.max) return
      this.range.min = this.$refs.player.currentTime
      this.rangeChange()
    },
    setEndTime () {
      if (this.$refs.player.currentTime <= this.range.min) return
      this.range.max = this.$refs.player.currentTime
      this.rangeChange()
    },
    update (file) {
      this.settings.fileId = this.$store.addMedia(file)
      this.settings.title = file.name
      this.settings.setStartTime = 0
      this.settings.endTime = -1
    },
    rangeChange () {
      this.settings.startTime = this.range.min
      this.settings.endTime = this.range.max
    },
    timeupdate (e) {
      if (this.endPause && e.target.currentTime >= this.settings.endTime) e.target.pause()
    },
    loadedmetadata (e) {
      if (e.target.readyState > 0) {
        // end time
        this.duration = e.target.duration
        if (this.settings.endTime <= this.settings.startTime || 0) this.settings.endTime = this.duration
        // range
        this.range = {
          min: this.settings.startTime,
          max: this.settings.endTime
        }
      }
    },
    playStart () {
      this.$refs.player.pause()
      this.$refs.player.currentTime = this.settings.startTime
      this.$refs.player.play()
    },
    playEnd () {
      this.$refs.player.pause()
      this.endPause = true
      this.$refs.player.currentTime = this.settings.endTime - 5
      this.$refs.player.play()
    }
  }
}

function timeFormat (totalSeconds) {
  if (typeof totalSeconds !== 'number') return ''

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = (totalSeconds % 60).toFixed(0).toString().padStart(2, '0')

  if (totalSeconds >= 3600) return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds}`

  return `${minutes}:${seconds}`
}
</script>

<style scoped>
video {
  height: 40vh
}
</style>
