<template>
  <div class="bg-output" :style="styleBgBeamer">
    <Transition name="q-transition--fade">
      <div v-if="alpha" v-show="!clear && show" class="alpha" :style="styleOpacityBeamer" />
      <video v-else v-show="!clear && show" ref="player" :muted="muted" :src="fileUrl" class="video" />
    </Transition>
  </div>
</template>

<script>
import BaseOutput from '../output/BaseOutput.vue'

export default {
  extends: BaseOutput,
  props: {
    muted: Boolean,
    outputlivestream: Boolean
  },
  computed: {
    fileUrl () {
      return this.$store.getMediaUrl(this.settings.fileId)
    },
    player () {
      return this.$refs.player
    },
    show () {
      if (!this.outputlivestream) return true
      return !this.settings.noLivestream
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
    }
  }
}
</script>

<style scoped>
.video,
.alpha {
  position: absolute;
  width: 100%;
  height: 100%;
}

.alpha {
  background: #fff;
}
</style>
