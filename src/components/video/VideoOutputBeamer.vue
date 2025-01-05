<template>
  <div>
    <video-output v-bind="$attrs" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import VideoOutput from './VideoOutput.vue'

export default defineComponent({
  name: 'VideoOutputBeamer',
  components: { VideoOutput }
})
</script>
