<template>
  <div class="output" :style="style">
    <Transition name="q-transition--fade" mode="in-out">
      <component :is="outputComponent" v-if="outputComponent" :key="presentation.id" :clear="isClear" :alpha="alpha" :presentation="presentation" :muted="muted" />
    </Transition>
  </div>

  <MessageOutput v-if="showMessages" />
</template>

<script>
import presentationTypes from '../presentation-types.js'
import MessageOutput from '../message/MessageOutput.vue'
import { replaceBackgroundUrl } from '../presets-settings.js'
import BgPng from '../../assets/bg.png'

export default {
  components: { MessageOutput },
  props: {
    id: String,
    preview: Boolean,
    alpha: Boolean,
    showBackground: Boolean,
    showMessages: Boolean,
    muted: Boolean
  },
  data () {
    return {
      backgroundColor: {
        beamer: '',
        livestream: ''
      }
    }
  },
  computed: {
    presentation () {
      return this.preview
        ? this.$store.previewPresentation
        : this.$store.livePresentation
    },
    presentationType () {
      return presentationTypes.find(t => t.id === this.presentation?.type)
    },
    outputComponent () {
      return this.presentationType?.outputs?.[this.id]
    },
    backgroundImageUrl () {
      return this.$store.getMediaUrl(this.$store.service?.backgroundImageId)
    },
    isClear () {
      return this.preview
        ? false
        : this.$store.isClear || (this.id === 'livestream' ? this.$store.isOnlyLivestreamClear : false)
    },
    style () {
      const style = {}

      if (this.showBackground) {
        if (this.backgroundColor.beamer && !this.backgroundImageUrl) {
          if (this.alpha) {
            style.backgroundColor = '#000'
          } else {
            style.backgroundColor = this.backgroundColor.beamer || '#000'
          }
        } else {
          const image = this.backgroundImageUrl || replaceBackgroundUrl || BgPng
          style.backgroundImage = `url(${image})`
          if (this.alpha) {
            style.filter = 'brightness(0) invert(1)'
          }
        }
      } else if (this.id === 'livestream' && !this.alpha && this.backgroundColor.livestream) {
        style.backgroundColor = this.backgroundColor.livestream
      }

      return style
    }
  },
  mounted () {
    this.backgroundColor.beamer = localStorage.getItem('backgroundColor.beamer') || ''
    this.backgroundColor.livestream = localStorage.getItem('backgroundColor.livestream') || ''
  }
}
</script>

<style>
.output {
  user-select: none;
  position: relative;
  width: 100vw;
  height: 100vh;
  cursor: none;
  background-color: #000;
  background-size: cover;
  background-position: center;
}
</style>
