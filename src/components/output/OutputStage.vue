<template>
  <div class="outputbox">
    <template v-if="$store.service">
      <div v-if="outputComponentLive" class="output title row q-px-md q-mt-md" v-html="titleLive" />
      <div class="output row q-px-md">
        <component :is="outputComponentLive" v-if="outputComponentLive" :key="$store.livePresentationId" :presentation="$store.livePresentation" :preview="false" />
      </div>
      <q-separator size="1vh" color="primary" class="q-mt-md" />
      <div v-if="showPreview && outputComponentPreview" class="output title row q-px-md" v-html="titlePreview" />
      <div class="output row q-px-md">
        <component :is="outputComponentPreview" v-if="showPreview && outputComponentPreview" :key="$store.previewPresentationId" :presentation="$store.previewPresentation" :preview="true" />
      </div>
    </template>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import presentationTypes from '../presentation-types'

export default defineComponent({
  name: 'OutputStage',
  computed: {
    outputComponentLive () {
      return this.presentationType(this.$store.livePresentation)?.outputs?.stage
    },
    outputComponentPreview () {
      if (this.$store.livePresentationId === this.$store.previewPresentationId) return false
      return this.presentationType(this.$store.previewPresentation)?.outputs?.stage
    },
    titleLive () {
      return this.$store.livePresentation?.settings ? this.$store.livePresentation.settings.title || this.presentationType(this.$store.livePresentation)?.name || '' : ''
    },
    titlePreview () {
      return this.$store.previewPresentation?.settings ? `... ${this.$store.previewPresentation.settings.title || this.presentationType(this.$store.previewPresentation)?.name || ''}` : ''
    },
    showPreview () {
      return !(this.$store.livePresentation?.type === 'countdown')
    }
  },
  methods: {
    presentationType (presentation) {
      return presentationTypes.find(t => t.id === presentation?.type)
    }
  }
})
</script>

<style scoped lang="scss">
.outputbox {
  position: fixed;
  user-select: none;
  cursor: none;
  color: yellow;
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
