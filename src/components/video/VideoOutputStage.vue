<template>
  <div class="text">
    Film: {{ settings.remainingF }}
  </div>
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
