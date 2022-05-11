<template>
  <video :src="settings.file_url" class="video" autoplay />
</template>

<script>
import BaseOutput from '../output/BaseOutput.vue'

export default {
  extends: BaseOutput
}
</script>

<style scoped>
.video {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
