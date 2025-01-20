<template>
  <div class="bg-output" :style="styleBgBeamer">
    <Transition name="q-transition--fade">
      <div v-if="alpha" v-show="!clear && show" class="alpha" :style="styleOpacityBeamer" />
      <video v-else v-show="!clear && show" ref="player" :muted="muted" :src="fileUrl" class="video" @canplaythrough="canplaythrough" />
    </Transition>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import BaseOutput from '../output/BaseOutput.vue'

export default defineComponent({
  name: 'VideoOutput',
  extends: BaseOutput,
  props: {
    muted: Boolean,
    outputlivestream: Boolean
  },
  data () {
    return {
      readyStateFirst: -1
    }
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
    },
    'control.readyStateFirst' (val) {
      if (this.readyStateFirst === 4) return
      if (val) this.control.readyStateFirst = false
    }
  },
  methods: {
    canplaythrough (e) {
      if (this.readyStateFirst < 4 && e.target.readyState === 4) {
        this.readyStateFirst = 4
        this.control.readyStateFirst = true
      }
    }
  }
})
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
