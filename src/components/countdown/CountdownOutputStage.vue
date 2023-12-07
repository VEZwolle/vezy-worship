<template>
  <div v-if="!isFinished" ref="outputStage" class="text" :class="classLive" v-text="remaining" />
  <div v-else ref="outputStage" class="text text-grey-9" :class="classLive" v-text="'0:00'" />
</template>

<script>
import CountdownOutputLivestream from './CountdownOutputLivestream.vue'

export default {
  extends: CountdownOutputLivestream,

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
