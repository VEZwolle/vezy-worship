<template>
  <div class="output" :style="style">
    <Transition name="q-transition--fade">
      <component :is="outputComponent" v-if="outputComponent" :key="presentation.id" :clear="$store.isClear" :alpha="alpha" :presentation="presentation" />
    </Transition>
  </div>
  <MessageOutput v-if="id === 'beamer'" />
</template>

<script>
import presentationTypes from '../presentation-types'
import MessageOutput from '../message/MessageOutput'

export default {
  components: { MessageOutput },
  props: {
    id: String,
    alpha: Boolean,
    showBackground: Boolean
  },
  computed: {
    presentation () {
      return this.$store.livePresentation
    },
    presentationType () {
      return presentationTypes.find(t => t.id === this.presentation?.type)
    },
    outputComponent () {
      return this.presentationType?.outputs?.[this.id]
    },
    backgroundImageUrl () {
      return this.$store.media[this.$store.service?.backgroundImageId]
    },
    style () {
      const style = {}

      if (this.showBackground) {
        const image = this.backgroundImageUrl || require('../../assets/bg.png')
        style.backgroundImage = `url(${image})`
      }

      return style
    }
  }
}
</script>

<style>
.output {
  position: relative;
  width: 100vw;
  height: 100vh;
  cursor: none;
  background-color: #000;
  background-size: cover;
  background-position: center;
}
</style>
