<template>
  <div v-if="!isFinished" class="text" v-text="remaining" />
  <div v-else class="text text-grey-9" v-text="'0:00'" />
</template>

<script>
import CountdownOutputLivestream from './CountdownOutputLivestream.vue'

export default {
  extends: CountdownOutputLivestream
}
</script>

<style scoped lang="scss">
.text {
  font-size: 15vh;
  line-height: 20vh;
}
</style>
