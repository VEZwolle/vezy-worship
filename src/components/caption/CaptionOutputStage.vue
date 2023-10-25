<template>
  <div class="text" v-html="settings?.text" />
</template>

<script>
import BaseOutputStage from '../output/BaseOutputStage.vue'

export default {
  extends: BaseOutputStage
}
</script>

<style scoped>
.text {
  font-size: 7vh;
  line-height: 9vh;
}
</style>
