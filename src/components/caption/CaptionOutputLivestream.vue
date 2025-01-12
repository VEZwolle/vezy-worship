<template>
  <div class="bg-output">
    <Transition name="q-transition--fade">
      <div v-if="settings.formatLivestream !== 'Geen' && settings.formatLivestream !== undefined" v-show="!clear" class="caption-output">
        <CaptionLivestream v-if="control" :title="settings.title" :showtext="showtext" :text="text" :format="style" :alpha="alpha" />
      </div>
    </Transition>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import BaseOutput from '../output/BaseOutput.vue'
import CaptionLivestream from './CaptionLivestream.vue'

export default defineComponent({
  name: 'CaptionOutputLivestream',
  components: { CaptionLivestream },
  extends: BaseOutput,
  computed: {
    showtext () {
      return !!this.settings.text
    },
    text () {
      if (!this.control) return ''
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
})
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
