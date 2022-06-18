<template>
  <div v-if="!clear && alpha" class="alpha" />
  <video v-else-if="!clear" :src="settings.fileUrl" class="video" autoplay />
</template>

<script>
import BaseOutput from '../output/BaseOutput.vue'

export default {
  extends: BaseOutput
}
</script>

<style scoped>
.video,
.alpha {
  position: absolute;
  width: 100%;
  height: 100%;
}

.alpha {
  background: #fff;
}
</style>
