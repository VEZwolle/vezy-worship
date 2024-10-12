<template>
  <template v-if="!preview">
    <div v-if="control && !control.isFinished" ref="outputStage" class="text" :class="classLive" v-text="control.remaining" />
    <div v-else ref="outputStage" class="text text-grey-9" :class="classLive" v-text="'0:00'" />
  </template>
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

<style scoped lang="scss">
.text {
  font-size: 15vh;
  line-height: 20vh;
}
</style>
