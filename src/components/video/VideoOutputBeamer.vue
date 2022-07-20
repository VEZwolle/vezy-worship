<template>
  <div v-if="!clear && alpha" class="alpha" />
  <video v-else v-show="!clear" ref="player" :muted="muted" :src="fileUrl" class="video" />
</template>

<script>
import BaseOutput from '../output/BaseOutput.vue'

export default {
  extends: BaseOutput,
  props: {
    muted: Boolean
  },
  computed: {
    fileUrl () {
      return this.$store.media[this.settings.fileId]
    },
    player () {
      return this.$refs.player
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
