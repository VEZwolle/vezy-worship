<template>
  <div class="q-pa-md">
    <video
      ref="player"
      :src="fileUrl"
      controls
      muted
      class="full-width"
      playsinline
      disablePictureInPicture
      controlsList="nodownload noremoteplayback noplaybackrate"
      x-webkit-airplay="deny"
      @play="play"
      @pause="pause"
      @seeked="seeked"
    />
  </div>
</template>

<script>
import BaseControl from '../presentation/BaseControl.vue'

export default {
  extends: BaseControl,
  computed: {
    fileUrl () {
      return this.$store.getMediaUrl(this.settings.fileId)
    }
  },
  watch: {
    clear (val) {
      if (this.preview) {
        return
      }

      if (val === false) {
        this.$refs.player.play()
        return
      }

      setTimeout(() => this.$refs.player.pause(), 300)
    }
  },
  mounted () {
    if (!this.clear && !this.preview) {
      this.$refs.player.play()
    }
  },
  methods: {
    play () {
      this.settings.play = true
    },
    pause () {
      this.settings.play = false
    },
    seeked (e) {
      this.settings.time = e.target.currentTime
    }
  }
}
</script>

<style scoped>
video::-webkit-media-controls-volume-slider,
video::-webkit-media-controls-mute-button,
video::-webkit-media-controls-fullscreen-button {
  display: none;
}
</style>
