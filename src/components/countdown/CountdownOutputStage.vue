<template>
  <div class="text" v-text="remaining" />
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
