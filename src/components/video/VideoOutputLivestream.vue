<template>
  <video-output-beamer muted v-bind="$attrs" />
</template>

<script>
import VideoOutputBeamer from './VideoOutputBeamer.vue'

export default {
  components: { VideoOutputBeamer }
}
</script>
