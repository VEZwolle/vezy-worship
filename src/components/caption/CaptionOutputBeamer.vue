<template>
  <div class="bg-output-beamer" :style="style">
    <Transition name="q-transition--fade">
      <div v-if="!clear && settings.formatBeamer !== 'Geen' && settings.formatBeamer !== undefined" class="full" :style="styleOpacity">
        <div class="caption-output">
          <CaptionBeamer :title="settings.title" :text="settings.text" :format="settings.formatBeamer" />
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
  extends: BaseOutput
}
</script>

<style scoped lang="scss">
.caption-output {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  padding: 5.4vw 4vw 4vw 4vw;
}

.full {
  position: absolute;
  width: 100vw;
  height: 100vh;
}
</style>
