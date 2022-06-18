<template>
  <div v-if="!clear && alpha" class="alpha" />
  <video v-else v-show="!clear" ref="player" :muted="muted" :src="settings.fileUrl" class="video" />
</template>

<script>
import BaseOutput from '../output/BaseOutput.vue'

export default {
  extends: BaseOutput,
  props: {
    muted: Boolean
  },
  computed: {
    player () {
      return this.$refs.player
    }
  },
  watch: {
    'settings.play' (val) {
      val ? this.player.play() : this.player.pause()
    },
    'settings.time' (val) {
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
