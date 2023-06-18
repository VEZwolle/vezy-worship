<template>
  <div class="bg-output-beamer" :style="style">
    <div v-if="!clear" class="full" :style="styleOpacity" />
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
