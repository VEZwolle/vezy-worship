<template>
  <div>
    <video-output v-bind="$attrs" />
  </div>
</template>

<script>
import VideoOutput from './VideoOutput.vue'

export default {
  components: { VideoOutput }
}
</script>
