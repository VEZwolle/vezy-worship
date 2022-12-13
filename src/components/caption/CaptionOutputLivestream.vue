<template>
  <div v-if="!clear && settings.formatLivestream !== 'Geen' && settings.formatLivestream !== undefined" class="caption-output">
    <CaptionLivestream :title="settings.title" :text="settings.text" :format="style" :alpha="alpha" />
  </div>
</template>

<script>
import BaseOutput from '../output/BaseOutput.vue'
import CaptionLivestream from './CaptionLivestream.vue'

export default {
  components: { CaptionLivestream },
  extends: BaseOutput,
  computed: {
    style () {
      if (this.settings.formatLivestream === 'Breed') {
        return '-full'
      }
      return '-default'
    }
  }
}
</script>

<style scoped>
.caption-output {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 5vw;
}
</style>
