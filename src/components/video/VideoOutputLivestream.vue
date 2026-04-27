<template>
  <div>
    <video-output v-bind="$attrs" outputlivestream muted />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import VideoOutput from './VideoOutput.vue'

export default defineComponent({
  name: 'VideoOutputLivestream',
  components: { VideoOutput }
})
</script>
