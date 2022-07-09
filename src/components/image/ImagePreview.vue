<template>
  <div class="image" :style="styleOutputRoot">
    <div class="Output" :style="styleOutput">
      <img v-if="id !== 'livestream'" :src="settings.beamer.fileUrl" class="positionabsolute" :style="styleImgBeamer">
      <img v-else :src="settings.livestream.fileUrl" class="positionabsolute" :style="styleImgLivestream">
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
    scale: {
      type: Number,
      default: 0
    },
    bgcolor: { type: String, default: 'gray' }
  },
  computed: {
    factorBeamer () {
      if (this.settings.beamer.width !== 0 && this.settings.beamer.height !== 0) {
        return (1920 / 1080) / (this.settings.beamer.width / this.settings.beamer.height)
      }
      return 1
    },
    factorLivestream () {
      if (this.settings.livestream.width !== 0 && this.settings.livestream.height !== 0) {
        return (1920 / 1080) / (this.settings.livestream.width / this.settings.livestream.height)
      }
      return 1
    },
    styleOutputRoot () { // toekomst nog aanpassen aan output formaten, nu uitgegaan van zelfde maat
      return {
        width: 1920 * this.scale + 'px',
        height: 1080 * this.scale + 'px'
      }
    },
    styleOutput () { // toekomst nog aanpassen aan output formaten, nu uitgegaan van zelfde maat
      const style = {}
      if (this.id === 'beamer') {
        const image = this.$store.service?.backgroundImageUrl || require('../../assets/bg.png')
        style.backgroundImage = `url(${image})`
      } else {
        style.backgroundColor = this.bgcolor
      }
      style.width = '1920px'
      style.height = '1080px'
      style.transform = `scale(${this.scale})`
      style.transformOrigin = 'top left'
      return style
    },
    styleImgBeamer () {
      return {
        width: this.settings.beamer.zoom + '%',
        left: this.settings.beamer.x + 50 - this.settings.beamer.zoom / 2 + '%',
        top: ((this.settings.beamer.y - 100) * (this.factorBeamer + 1) / 2 + 100 + (this.factorBeamer * (100 - this.settings.beamer.zoom)) / 2) + '%',
        transform: 'rotate(' + this.settings.beamer.rotate + 'deg)'
      }
    },
    styleImgLivestream () {
      return {
        width: this.settings.livestream.zoom + '%',
        left: this.settings.livestream.x + 50 - this.settings.livestream.zoom / 2 + '%',
        top: ((this.settings.livestream.y - 100) * (this.factorLivestream + 1) / 2 + 100 + (this.factorLivestream * (100 - this.settings.livestream.zoom)) / 2) + '%',
        transform: 'rotate(' + this.settings.livestream.rotate + 'deg)'
      }
    }
  }
}
</script>

<style scope>
.Output {
  position: relative;
}
.positionabsolute {
  position: absolute;
}
.image {
  background-size: cover;
  overflow: hidden;
}
</style>
