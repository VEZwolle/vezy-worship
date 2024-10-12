<template>
  <div class="bg-output" :style="styleBgBeamer">
    <Transition name="q-transition--fade">
      <div v-if="settings.formatBeamer !== 'Geen' && settings.formatBeamer !== undefined" v-show="!clear" class="full" :style="styleOpacityBeamer">
        <div class="caption-output">
          <CaptionBeamer :title-lines="titleLines" :text-lines="textLines" :format="settings.formatBeamer" :alpha="alpha" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import BaseOutput from '../output/BaseOutput.vue'
import CaptionBeamer from './CaptionBeamer.vue'

export default {
  components: { CaptionBeamer },
  extends: BaseOutput,
  computed: {
    textLines () {
      const section = this.control.sections?.[this.control.selectedSectionIndex]
      return section?.beamerLines || []
    },
    titleLines () {
      return this.control.beamerTitleLines || []
    }
  }
}
</script>

<style scoped lang="scss">
.caption-output {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  padding: 4.4vw 0 0 0;
}

.full {
  position: absolute;
  width: 100vw;
  height: 100vh;
}
</style>
