<template>
  <div class="output live">
    <Transition name="q-transition--fade">
      <component :is="outputComponentLive" v-if="outputComponentLive" :key="$store.livePresentation.id" :clear="false" :alpha="false" :presentation="$store.livePresentation" :muted="true" />
    </Transition>
  </div>
  <div class="output preview">
    <Transition name="q-transition--fade">
      <component :is="outputComponentPreview" v-if="outputComponentPreview" :key="$store.previewPresentation.id" :clear="false" :alpha="false" :presentation="$store.previewPresentation" :muted="true" />
    </Transition>
  </div>
</template>

<script>
import presentationTypes from '../presentation-types'

export default {
  props: {
  },
  data () {
    return {
    }
  },
  computed: {
    outputComponentLive () {
      return this.presentationType(this.$store.livePresentation)?.outputs?.stage
    },
    outputComponentPreview () {
      return this.presentationType(this.$store.previewPresentation)?.outputs?.stage
    }
  },
  methods: {
    presentationType (presentation) {
      return presentationTypes.find(t => t.id === presentation?.type)
    }
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
  background-size: cover;
  background-position: center;
}
.live {
  height: 70vh;
  background-color: #000;
}
.preview {
  height: 30vh;
  background-color: #0a0a0a;
}
</style>
