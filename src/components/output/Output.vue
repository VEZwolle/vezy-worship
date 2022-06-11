<template>
  <div class="output" :style="style">
    <Transition name="q-transition--fade">
      <component :is="outputComponent" v-if="outputComponent && !store.isClear" :key="presentation.id" :alpha="alpha" :presentation="presentation" />
    </Transition>
  </div>
</template>

<script>
import useServiceStore from 'stores/service'
import presentationTypes from '../presentation-types'

export default {
  props: {
    id: String,
    alpha: Boolean,
    showBackground: Boolean
  },
  setup () {
    const store = useServiceStore()
    return { store }
  },
  computed: {
    presentation () {
      return this.store.livePresentation
    },
    presentationType () {
      return presentationTypes.find(t => t.id === this.presentation?.type)
    },
    outputComponent () {
      return this.presentationType?.outputs?.[this.id]
    },
    style () {
      const style = {}

      if (this.showBackground) {
        const image = this.store.service?.backgroundImageUrl || require('../../assets/bg.png')
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