<template>
  <Transition name="q-transition--fade">
    <div v-if="settings.formatLivestream !== 'Geen' && settings.formatLivestream !== undefined" v-show="!clear" class="caption-output">
      <CaptionLivestream :title="settings.title" :text="text" :format="style" :alpha="alpha" />
    </div>
  </Transition>
</template>

<script>
import BaseOutput from '../output/BaseOutput.vue'
import CaptionLivestream from './CaptionLivestream.vue'

export default {
  components: { CaptionLivestream },
  extends: BaseOutput,
  computed: {
    control () {
      return this.presentation.control
    },
    text () {
      const section = this.control.sections?.[this.control.selectedSectionIndex]
      const lines = section?.slides?.[this.control.selectedSlideIndex] || []

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
.caption-output {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 5vw;
}
</style>
