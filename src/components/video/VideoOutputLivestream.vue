<template>
  <div>
    <video-output v-bind="$attrs" outputlivestream muted />
  </div>
</template>

<script>
import VideoOutput from './VideoOutput.vue'

export default {
  components: { VideoOutput }
}
</script>
