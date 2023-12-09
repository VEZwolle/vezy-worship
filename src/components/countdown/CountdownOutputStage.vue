<template>
  <template v-if="!preview">
    <div v-if="!isFinished" ref="outputStage" class="text" :class="classLive" v-text="remaining" />
    <div v-else ref="outputStage" class="text text-grey-9" :class="classLive" v-text="'0:00'" />
  </template>
</template>

<script>
import BaseOutputStage from '../output/BaseOutputStage.vue'

export default {
  extends: BaseOutputStage,
  computed: {
    remaining () {
      if (this.settings.type === 1) {
        return this.settings.now
      }

      const hours = this.settings.hours?.toString()
      const minutes = this.settings.minutes?.toString().padStart(2, '0')
      const seconds = this.settings.seconds?.toString().padStart(2, '0')

      if (this.settings.hours > 0) {
        return `${hours}:${minutes}:${seconds}`
      }

      return `${minutes}:${seconds}`
    },
    isFinished () {
      return this.settings.hours < 0
    }
  },
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
