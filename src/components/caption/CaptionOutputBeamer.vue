<template>
  <div class="bg-output-beamer caption-output" :style="style">
    <Transition name="q-transition--fade">
      <div v-if="!clear && settings.formatBeamer !== 'Geen' && settings.formatBeamer !== undefined">
        <CaptionBeamer :title="settings.title" :text="settings.text" :format="settings.formatBeamer" />
      </div>
    </Transition>
  </div>
</template>

<script>
import BaseOutput from '../output/BaseOutput.vue'
import CaptionBeamer from './CaptionBeamer.vue'

export default {
  components: { CaptionBeamer },
  extends: BaseOutput
}
</script>

<style scoped lang="scss">
.caption-output {
  position: fixed;
  left: 0;
  top: 0;
  padding: 5.4vw 4vw 4vw 4vw;
}
</style>
