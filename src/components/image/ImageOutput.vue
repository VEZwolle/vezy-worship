<template>
  <div v-if="!clear" class="image-output">
    <div :style="containerStyle">
      <img :src="fileUrl" :style="imageStyle">
    </div>
  </div>
</template>

<script>
import BaseOutput from '../output/BaseOutput.vue'

export default {
  extends: BaseOutput,
  computed: {
    fileUrl () {
      return this.$store.media[this.settings.fileId]
    },
    factor () { // toekomst ratio output uit variabele halen
      const { ratio } = this.settings
      if (ratio !== null && ratio !== 0) {
        return (16 / 9) / ratio
      }
      return 1
    },
    containerStyle () {
      const { zoom, x, y } = this.settings
      return {
        position: 'absolute',
        width: `${zoom}vw`,
        left: `${x + 50 - zoom / 2}vw`,
        top: `${((y - 100) * (this.factor + 1) / 2 + 100 + (this.factor * (100 - zoom)) / 2)}vh`
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
