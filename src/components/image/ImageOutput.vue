<template>
  <div class="image">
    <div class="Output" :style="styleOutput">
      <img :src="fileUrl" class="positionabsolute" :style="styleImg">
    </div>
  </div>
</template>

<script>
import BaseSettings from '../presentation/BaseSettings.vue'

export default {
  extends: BaseSettings,
  props: {
    id: {
      type: String,
      default: 'beamer'
    },
    bgcolor: { type: String, default: 'gray' },
    alpha: Boolean
  },
  computed: {
    fileUrl () {
      if (this.id !== 'livestream') {
        return this.$store.media[this.settings.fileId] || require('../../assets/' + this.settings.fileId + 'beamer.png')
      }
      if (this.settings.fileLivestreamId === null) {
        return this.$store.media[this.settings.fileId] || require('../../assets/' + this.settings.fileId + 'beamer.png')
      }
      return this.$store.media[this.settings.fileLivestreamId] || require('../../assets/' + this.settings.fileLivestreamId + 'livestream.png')
    },
    backgroundImageUrl () {
      return this.$store.media[this.$store.service?.backgroundImageId]
    },
    factor () { // toekomst ratio output uit variabele halen
      if (this.id !== 'livestream') {
        if (this.settings.beamerWidth !== 0 && this.settings.beamerHeight !== 0) {
          return (16 / 9) / (this.settings.beamerWidth / this.settings.beamerHeight)
        }
        return 1
      }
      if (this.settings.livestreamWidth !== 0 && this.settings.livestreamHeight !== 0) {
        return (16 / 9) / (this.settings.livestreamWidth / this.settings.livestreamHeight)
      }
      return 1
    },
    styleOutput () {
      const style = {}
      if (this.alpha) {
        style.backgroundColor = '#000'
        return style
      }
      if (this.id === 'beamer') {
        const image = this.backgroundImageUrl || require('../../assets/bg.png')
        style.backgroundImage = `url(${image})`
        return style
      }
      style.backgroundColor = this.bgcolor
      return style
    },
    styleImg () {
      const style = {}
      if (this.alpha) {
        style.filter = 'brightness(0) invert(1)'
      }
      if (this.id !== 'livestream') {
        style.width = this.settings.beamerZoom + '%'
        style.left = this.settings.beamerX + 50 - this.settings.beamerZoom / 2 + '%'
        style.top = ((this.settings.beamerY - 100) * (this.factor + 1) / 2 + 100 + (this.factor * (100 - this.settings.beamerZoom)) / 2) + '%'
        style.transform = 'rotate(' + this.settings.beamerRotate + 'deg)'
        return style
      }
      style.width = this.settings.livestreamZoom + '%'
      style.left = this.settings.livestreamX + 50 - this.settings.livestreamZoom / 2 + '%'
      style.top = ((this.settings.livestreamY - 100) * (this.factor + 1) / 2 + 100 + (this.factor * (100 - this.settings.livestreamZoom)) / 2) + '%'
      style.transform = 'rotate(' + this.settings.livestreamRotate + 'deg)'
      return style
    }
  }
}
</script>

<style scoped>
.Output {
  position: relative;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}
.positionabsolute {
  position: absolute;
}
.image {
  width: 100vw;
  height: 100vh;
  background-size: cover;
  overflow: hidden;
}
</style>
