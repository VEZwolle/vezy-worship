<template>
  <q-responsive :ratio="$store.outputRatio" class="output-preview" :style="style">
    <iframe v-show="show" ref="iframe" />
    <img v-if="visualView" :src="require(`../../assets/view${visualView}.png`)" class="overlay">
  </q-responsive>
</template>

<script>
import { createApp } from 'vue'
import { debounce } from 'quasar'
import { replaceBackgroundUrl } from '../presets-settings.js'

export default {
  props: {
    component: Object,
    visualView: {
      type: String,
      default: ''
    },
    bgStyle: Object,
    bgShow: null // beamer / livestream
  },
  data () {
    return {
      show: false,
      backgroundColor: null
    }
  },
  computed: {
    style () {
      if (this.bgStyle) return this.bgStyle
      const style = {}
      if (this.$q.dark.isActive) {
        style.backgroundImage = 'repeating-conic-gradient(#656565 0% 25%, #595959 0% 50%)'
      } else {
        style.backgroundImage = 'repeating-conic-gradient(#fefefe 0% 25%, #eee 0% 50%)'
      }
      style.backgroundSize = '16px 16px'
      style.backgroundBlendMode = 'screen'
      return style
    },
    backgroundImageUrl () {
      return this.$store.getMediaUrl(this.$store.service?.backgroundImageId)
    },
    bodyBgStyle () {
      if (this.bgStyle || !this.bgShow) return ''
      if (this.bgShow === 'livestream' && this.backgroundColor) {
        return ` background-color: ${this.backgroundColor};`
      }
      if (this.bgShow === 'beamer') {
        if (this.backgroundColor && !this.backgroundImageUrl) {
          return ` background-color: ${this.backgroundColor};`
        } else {
          const image = this.backgroundImageUrl || replaceBackgroundUrl || require('../../assets/bg.png')
          return ` background-image: url(${image}); background-size: cover; background-position: center;`
        }
      }
      return ''
    }
  },
  created () {
    this.showDebounce = debounce(this.showDebounce, 1)
    if (this.bgShow) this.backgroundColor = localStorage.getItem(`backgroundColor.${this.bgShow}`) || ''
  },
  mounted () {
    const iframe = this.$refs.iframe.contentDocument

    // remove scrollbars on iframe body & change default electron margin.
    iframe.body.style.cssText += `overflow: hidden; margin: 0;${this.bodyBgStyle}`
    // Sync styles
    const styles = document.querySelectorAll('link,style')
    for (const style of styles) {
      iframe.head.append(style.cloneNode(true))
    }

    const app = createApp(this.component, this.$attrs)

    // Sync store
    app.config.globalProperties.$store = this.$store

    app.mount(iframe.body)

    // delay 1ms show iframe: ivm first css must be fully loaded before display, otherwise you see text in wrong place without formatting
    this.showDebounce()
  },
  methods: {
    showDebounce () {
      this.show = true
    }
  }
}
</script>

<style scoped>
.output-preview {
  overflow: hidden;
  width: 100%;
  pointer-events: none;
}

iframe {
  border: none;
}

.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 999;
  opacity: 0.4;
}
</style>
