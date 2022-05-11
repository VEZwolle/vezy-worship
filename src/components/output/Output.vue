<template>
  <div class="output">
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
    alpha: Boolean
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
    }
  }
}
</script>

<style scoped>
.output {
  position: relative;
  width: 100vw;
  height: 100vh;
  font-size: 1vw;
  cursor: none;
  background: #000;
}
</style>
