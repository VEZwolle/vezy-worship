<template>
  <div v-if="!clear" class="caption-output">
    <Caption :title="settings.title" :text="settings.text" :alpha="alpha" :outputvw="outputvw" />
  </div>
</template>

<script>
import BaseOutput from '../output/BaseOutput.vue'
import Caption from './Caption.vue'

export default {
  components: { Caption },
  extends: BaseOutput,
  computed: {
    csscaptionoutputpadding () {
      return (6 * this.outputvw) + 'px'
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
  padding: v-bind('csscaptionoutputpadding');
}
</style>
