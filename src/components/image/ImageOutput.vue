<template>
  <div v-if="!clear" class="image-output">
    <div :style="containerStyle">
      <img :src="fileUrl" :style="imageStyle">
    </div>
  </div>
</template>

<script>
import ImageDefault from './ImageDefault.vue'

export default {
  extends: ImageDefault,
  computed: {
    fileUrl () { // nazien
      if (this.imageDefaults.find(t => t.idName === this.settings.fileId) !== undefined) {
        return require('../../assets/' + this.settings.fileId + 'beamer.png') // + 'livestream.png')
      }
      return this.$store.media[this.settings.fileId]
    },
    factor () {
      return this.$store.outputRatio / this.settings.ratio
    },
    containerStyle () {
      const { zoom, x, y } = this.settings

      return {
        position: 'absolute',
        width: `${zoom}vw`,
        left: `${x}vw`,
        top: `${y * ((this.factor + 1) / 2)}vh`,
        transform: 'translate(calc(50vw - 50%), calc(50vh - 50%))' // Base position calculations from the center
      }
    },
    imageStyle () {
      const { rotate } = this.settings

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
