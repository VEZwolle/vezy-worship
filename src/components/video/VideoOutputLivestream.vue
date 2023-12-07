<template>
  <div>
    <video-output-beamer v-bind="$attrs" outputlivestream muted />
  </div>
</template>

<script>
import VideoOutputBeamer from './VideoOutputBeamer.vue'

export default {
  components: { VideoOutputBeamer }
}
</script>
