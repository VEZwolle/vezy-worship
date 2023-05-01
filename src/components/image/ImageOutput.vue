<template>
  <div class="bg-output-beamer" :style="beamer ? style : ''">
    <div v-if="!clear" class="image-output">
      <div :style="containerStyle">
        <img :src="fileUrl" :style="imageStyle">
      </div>
    </div>
  </div>
</template>

<script>
import BaseOutput from '../output/BaseOutput.vue'

export default {
  extends: BaseOutput,
  computed: {
    fileUrl () {
      return this.$store.getMediaUrl(this.settingsimage.fileId)
    },
    factor () {
      return this.$store.outputRatio / this.settingsimage.ratio
    },
    containerStyle () {
      const { zoom, x, y } = this.settingsimage

      return {
        position: 'absolute',
        width: `${zoom}vw`,
        left: `${x}vw`,
        top: `${y * ((this.factor + 1) / 2)}vh`,
        transform: 'translate(calc(50vw - 50%), calc(50vh - 50%))' // Base position calculations from the center
      }
    },
    imageStyle () {
      const { rotate } = this.settingsimage

      const style = {
        width: '100%',
        transform: `rotate(${rotate}deg)`
      }

      if (this.alpha) {
        style.filter = 'brightness(0) invert(1)'
      }

      return style
    }
  }
}
</script>

<style>
.image-output {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
