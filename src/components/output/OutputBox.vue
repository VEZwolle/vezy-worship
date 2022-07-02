<template>
  <div class="output-box-view" :style="rootStyle">
    <div class="output-container" :style="containerStyle">
      <div class="output-box" :style="style">
        <Transition name="q-transition--fade">
          <component :is="outputComponent" v-if="outputComponent" :key="presentation.id" :clear="isClear" :alpha="alpha" :presentation="presentation" :outputvw="outputv.w" :outputvh="outputv.h" />
        </Transition>
      </div>
    </div>
  </div>
</template>

<script>
import presentationTypes from '../presentation-types'

export default {
  props: {
    outputid: String,
    showBackground: Boolean,
    alpha: Boolean,
    previewPresentation: Boolean,
    boxwidth: { type: Number, Default: 0 }
  },
  computed: {
    outputv () {
      if (this.outputid === 'beamer') {
        return {
          w: this.$store.output.Beamer.vw,
          h: this.$store.output.Beamer.vh
        }
      }
      return {
        w: this.$store.output.Livestream.vw,
        h: this.$store.output.Livestream.vh
      }
    },
    rootStyle () {
      const width = this.boxwidth
      const height = this.outputv.h / this.outputv.w * width
      return {
        width: `${width}px`,
        height: `${height}px`
      }
    },
    containerStyle () {
      return {
        width: (100 * this.outputv.w) + 'px',
        height: (100 * this.outputv.h) + 'px',
        transform: `scale(${this.boxwidth / (100 * this.outputv.w)})`,
        transformOrigin: 'top left'
      }
    },
    cssoutput () {
      return {
        w: (100 * this.outputv.w) + 'px',
        h: (100 * this.outputv.h) + 'px'
      }
    },
    isClear () {
      if (!this.previewPresentation) {
        return this.$store.isClear
      }
      return false
    },
    presentation () {
      if (!this.previewPresentation) {
        return this.$store.livePresentation
      }
      return this.$store.previewPresentation
    },
    presentationType () {
      return presentationTypes.find(t => t.id === this.presentation?.type)
    },
    outputComponent () {
      return this.presentationType?.outputs?.[this.outputid]
    },
    style () {
      const style = {}

      if (this.showBackground) {
        const image = this.$store.service?.backgroundImageUrl || require('../../assets/bg.png')
        style.backgroundImage = `url(${image})`
      }

      return style
    }
  }
}
</script>

<style scoped>
.output-box-view {
  margin: 5px 5px 5px 5px;
  pointer-events: none;
}
.output-box {
  position: relative;
  width: v-bind('cssoutput.w');
  height: v-bind('cssoutput.h');
  cursor: none;
  background-color: #000;
  background-size: cover;
  background-position: center;
}
</style>
