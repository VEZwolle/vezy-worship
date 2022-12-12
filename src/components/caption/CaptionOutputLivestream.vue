<template>
  <div v-if="!clear && settings.formatLivestream !== 'Geen' && settings.formatLivestream !== undefined" class="caption-output" :class="'caption-output' + style">
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
      if (this.settings.formatLivestream === 'Groot onder') {
        return '-big-bottom'
      }
      if (this.settings.formatLivestream === 'Groot rechts') {
        return '-big-right'
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
}
.caption-output-default {
  padding: 6vw;
}
.caption-output-big-right {
  padding: 0 0 0 55vw;
}
.caption-output-big-bottom {
  padding: 5vw;
}
</style>
