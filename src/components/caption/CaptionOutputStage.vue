<template>
  <div ref="outputStage" class="text" :class="classLive" v-html="settings?.text" />
</template>

<script>
import BaseOutputStage from '../output/BaseOutputStage.vue'

export default {
  extends: BaseOutputStage,

  mounted () {
    if (!this.preview) this.$refs.outputStage.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<style scoped>
.text {
  font-size: 7vh;
  line-height: 10vh;
}
</style>
