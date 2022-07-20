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
        return this.$store.media[this.settings.fileId]
      }
      return this.$store.media[this.settings.fileLivestreamId] || this.$store.media[this.settings.fileId]
    },
    backgroundImageUrl () {
      return this.$store.media[this.$store.service?.backgroundImageId]
    },
    factor () {
      if (this.id !== 'livestream') {
        if (this.settings.beamer.width !== 0 && this.settings.beamer.height !== 0) {
          return (16 / 9) / (this.settings.beamer.width / this.settings.beamer.height)
        }
        return 1
      }
      if (this.settings.livestream.width !== 0 && this.settings.livestream.height !== 0) {
        return (16 / 9) / (this.settings.livestream.width / this.settings.livestream.height)
      }
      return 1
    },
    styleOutput () { // toekomst nog aanpassen aan output formaten, nu uitgegaan van zelfde maat
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
        style.width = this.settings.beamer.zoom + '%'
        style.left = this.settings.beamer.x + 50 - this.settings.beamer.zoom / 2 + '%'
        style.top = ((this.settings.beamer.y - 100) * (this.factor + 1) / 2 + 100 + (this.factor * (100 - this.settings.beamer.zoom)) / 2) + '%'
        style.transform = 'rotate(' + this.settings.beamer.rotate + 'deg)'
        return style
      }
      style.width = this.settings.livestream.zoom + '%'
      style.left = this.settings.livestream.x + 50 - this.settings.livestream.zoom / 2 + '%'
      style.top = ((this.settings.livestream.y - 100) * (this.factor + 1) / 2 + 100 + (this.factor * (100 - this.settings.livestream.zoom)) / 2) + '%'
      style.transform = 'rotate(' + this.settings.livestream.rotate + 'deg)'
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
