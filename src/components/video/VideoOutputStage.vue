<template>
  <div ref="outputStage" class="text" :class="classLive">
    Film: {{ remainingTime }}
  </div>
</template>

<script>
import BaseOutputStage from '../output/BaseOutputStage.vue'

export default {
  extends: BaseOutputStage,

  computed: {
    remainingTime () {
      return !this.preview ? this.settings.remainingF : ''
    }
  },
  mounted () {
    if (!this.preview) this.$refs.outputStage.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<style scoped>
.text {
  font-size: 9vh;
  line-height: 12vh;
}
</style>
