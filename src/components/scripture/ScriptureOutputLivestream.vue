<template>
  <Transition name="q-transition--fade">
    <div v-if="settings.formatLivestream !== 'Geen' && settings.formatLivestream !== undefined" v-show="!clear" class="scripture-output">
      <CaptionLivestream :title="title" :text="text" :format="style" :alpha="alpha" />
    </div>
  </Transition>
</template>

<script>
import BaseOutput from '../output/BaseOutput.vue'
import CaptionLivestream from '../caption/CaptionLivestream.vue'

export default {
  components: { CaptionLivestream },
  extends: BaseOutput,
  computed: {
    title () {
      return this.settings.title ? this.settings.title : this.presentationType.title(this.settings)
    },
    text () {
      const section = this.presentation.sections?.[this.presentation.selectedSectionIndex]
      const lines = section?.slides?.[this.presentation.selectedSlideIndex] || []

      return lines[0] || ''
    },
    style () {
      if (this.settings.formatLivestream === 'Breed') {
        return '-full'
      }
      return '-default'
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
  padding: 5vw;
}
</style>
