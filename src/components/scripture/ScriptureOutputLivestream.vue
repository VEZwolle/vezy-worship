<template>
  <div v-if="!clear" class="scripture-output">
    <CaptionLivestream :title="title" :text="text" format="-full" :alpha="alpha" />
  </div>
</template>

<script>
import BaseOutput from '../output/BaseOutput.vue'
import CaptionLivestream from '../caption/CaptionLivestream.vue'

export default {
  components: { CaptionLivestream },
  extends: BaseOutput,
  computed: {
    title () {
      return this.presentationType.title(this.settings)
    },
    text () {
      const section = this.presentation.sections?.[this.presentation.selectedSectionIndex]
      const lines = section?.slides?.[this.presentation.selectedSlideIndex] || []

      return lines[0] || ''
    }
  }
}
</script>

<style scoped>
.scripture-output {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 6vw;
}
</style>
