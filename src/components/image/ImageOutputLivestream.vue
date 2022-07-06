<template>
  <div v-if="!clear" class="image" :style="style" />
</template>

<script>
import BaseOutput from '../output/BaseOutput.vue'

export default {
  extends: BaseOutput,
  computed: {
    style () {
      if (this.alpha) {
        return {
          backgroundColor: '#fff'
        }
      }

      return {
        backgroundImage: `url(${this.settings.fileLivestreamUrl})`
      }
    }
  }
}
</script>

<style scoped>
.image {
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: cover;
}
</style>
