<template>
  <div
    v-shortkey="shortkeysNextBack"
    class="q-pa-md"
    @shortkey="baseHandleArrow"
  >
    <video
      ref="player"
      :src="fileUrl"
      preload="auto"
      muted
      class="full-width"
      playsinline
      disablePictureInPicture
      controlsList="nodownload noremoteplayback noplaybackrate"
      x-webkit-airplay="deny"
      @timeupdate="timeupdate"
      @loadedmetadata="loadedmetadata"
      @canplaythrough="canplaythrough"
    />
  </div>
  <div v-if="duration" class="q-px-md row">
    <div class="q-pa-md col2">
      <q-btn
        v-shortkey="shortkeysPlay"
        round
        color="primary"
        :icon="iconPlayPause"
        @click="togglePlayPause"
        @shortkey="togglePlayPause"
      >
        <q-tooltip>Start/Pause</q-tooltip>
      </q-btn>
    </div>
    <div class="q-px-md col">
      <q-badge color="secondary">
        {{ `${currentTimeF} (${settings.play ? 'Bezig met afspelen' : 'gestopt'})` }}
      </q-badge>
      <q-slider
        v-model="currentTime"
        track-size="1vh"
        color="primary"
        inner-track-color="secondary"
        :min="0"
        :max="duration"
        :inner-min="settings.startTime"
        :inner-max="settings.endTime"
        label
        :label-value="currentTimeF"
        :marker-labels="markerLabels"
        @pan="moveTime"
        @click="moveTime"
      />
    </div>
    <div class="q-px-md col2">
      <h6>{{ remainingF }}</h6>
    </div>
  </div>
</template>

<script>
import BaseControl from '../presentation/BaseControl.vue'

export default {
  extends: BaseControl,
  data () {
    return {
      currentTime: null,
      duration: 0,
      readyStateFirst: -1,
      moveSlider: false,
      movePlayState: false,
      markerLabels: []
    }
  },
  computed: {
    fileUrl () {
      return this.$store.getMediaUrl(this.settings.fileId)
    },
    player () {
      return this.$refs.player
    },
    iconPlayPause () {
      return this.settings.play ? 'pause' : 'play_arrow'
    },
    remainingF () {
      return timeFormat((this.settings.endTime || this.duration) - this.currentTime)
    },
    currentTimeF () {
      return timeFormat(this.currentTime)
    },
    shortkeysPlay () {
      return this.$store.shortkeysPlay()
    }
  },
  watch: {
    'settings.play' (val) {
      if (!this.player) return
      val ? this.player.play() : this.player.pause()
    },
    'settings.time' (val) {
      if (!this.player) return
      this.player.currentTime = val
    },
    'currentTime' (val) {
      if (val >= this.settings.endTime) this.end()
      if (!this.moveSlider) return
      this.settings.time = val
    },
    'remainingF' (val) {
      this.settings.remainingF = val
    },
    clear (val) {
      if (this.preview) return

      if (val === false) {
        this.play()
        return
      }

      setTimeout(() => this.pause(), 300)
    }
  },
  mounted () {
    this.pause()
    this.readyStateFirst = -1
    if (this.preview) this.settings.time = this.settings.startTime
  },
  methods: {
    togglePlayPause () {
      if (!this.settings.play && this.currentTime >= this.settings.endTime) return
      if (this.settings.play) {
        this.settings.play = false
        this.settings.time = this.currentTime
      } else {
        this.play()
      }
    },
    moveTime (phase) {
      if (phase === 'start') {
        this.movePlayState = this.settings.play
        this.pause()
        this.moveSlider = true
      } else {
        this.moveSlider = false
        this.settings.play = this.movePlayState
      }
      this.settings.time = this.currentTime
    },
    play () {
      if (this.player.readyState < 4) {
        setTimeout(() => this.play(), 50)
        return
      }
      this.settings.play = true
    },
    pause () {
      this.settings.play = false
    },
    timeupdate (e) {
      this.currentTime = e.target.currentTime
    },
    loadedmetadata (e) {
      if (this.readyStateFirst < 1 && e.target.readyState > 0) {
        // start time
        if (this.settings.time < (this.settings.startTime || 0)) {
          this.settings.time = (this.settings.startTime || 0) + 0.0001 * (Math.random() + 0.0001)
        } else { // always different starting point from previous movie to reset to that point
          this.settings.time += 0.0001 * (Math.random() + 0.0001)
        }
        // end time
        this.duration = e.target.duration
        if (this.settings.endTime <= (this.settings.startTime || 0)) this.settings.endTime = this.duration
        // labels slider
        this.markerLabels = [
          { value: this.settings.startTime, label: timeFormat(this.settings.startTime) },
          { value: this.settings.endTime, label: timeFormat(this.settings.endTime) }
        ]
        this.readyStateFirst = 1
      }
    },
    canplaythrough (e) {
      if (this.readyStateFirst < 4 && e.target.readyState === 4) {
        if (!this.clear && !this.preview) {
          this.play()
        }
        this.readyStateFirst = 4
      }
    },
    end () {
      this.pause()
    }
  }
}

function timeFormat (totalSeconds) {
  if (typeof totalSeconds !== 'number') return ''
  if (totalSeconds < 0) return '0:00'

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = (totalSeconds % 60).toFixed(0).toString().padStart(2, '0')

  if (totalSeconds >= 3600) return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds}`

  return `${minutes}:${seconds}`
}
</script>

<style scoped>
video::-webkit-media-controls-volume-slider,
video::-webkit-media-controls-mute-button,
video::-webkit-media-controls-fullscreen-button {
  display: none;
}
</style>
