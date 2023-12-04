<template>
  <div ref="outputStage" class="text">
    Film: {{ settings.remainingF }}
  </div>
</template>

<script>
import BaseOutputStage from '../output/BaseOutputStage.vue'

export default {
  extends: BaseOutputStage,

  mounted () {
    if (!this.preview) this.$refs.outputStage.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}
</script>

<style scoped>
.text {
  font-size: 7vh;
  line-height: 9vh;
}
</style>
