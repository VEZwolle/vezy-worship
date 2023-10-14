<template>
  <div class="outputbox">
    <div class="output title row" v-html="titleLive" />
    <div class="output row">
      <component :is="outputComponentLive" v-if="outputComponentLive" :key="$store.livePresentation.id" :presentation="$store.livePresentation" :preview="false" />
    </div>
    <q-separator inset />
    <div class="output title row" v-html="titlePreview" />
    <div class="output row">
      <component :is="outputComponentPreview" v-if="outputComponentPreview" :key="$store.previewPresentation.id" :presentation="$store.previewPresentation" :preview="true" />
    </div>
  </div>
</template>

<script>
import presentationTypes from '../presentation-types'

export default {
  computed: {
    outputComponentLive () {
      return this.presentationType(this.$store.livePresentation)?.outputs?.stage
    },
    outputComponentPreview () {
      return this.presentationType(this.$store.previewPresentation)?.outputs?.stage
    },
    titleLive () {
      return this.$store.livePresentation?.settings ? this.$store.livePresentation.settings.title : ''
    },
    titlePreview () {
      return this.$store.previewPresentation?.settings ? `... ${this.$store.previewPresentation.settings.title}` : ''
    }
  },
  methods: {
    presentationType (presentation) {
      return presentationTypes.find(t => t.id === presentation?.type)
    }
  }
}
</script>

<style scoped lang="scss">
.outputbox {
  position: fixed;
  user-select: none;
  cursor: none;
  color: white;
  background-color: #000;
  background-size: cover;
  background-position: center;
  height: 100vh;
  width: 100vw;
  overflow-y: hidden;
  .output {
    height: fit-content;
    width: 100vw;
  }
  .title {
    font-size: 7vh;
    line-height: 10vh;
    color: gray;
    background-color: #292929;
  }
}
</style>
