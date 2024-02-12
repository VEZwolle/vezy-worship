<template>
  <div class="bg-output-beamer" :style="style">
    <Transition name="q-transition--fade">
      <div v-show="!clear" class="full" :style="styleOpacity" />
    </Transition>
  </div>
</template>

<script>
import BaseOutput from '../output/BaseOutput.vue'

export default {
  extends: BaseOutput
}
</script>

<style scoped>
.full {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
