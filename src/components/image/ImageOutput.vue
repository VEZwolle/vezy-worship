<template>
  <div class="image" :style="style" />
</template>

<script>
import BaseOutput from '../output/BaseOutput.vue'

export default {
  extends: BaseOutput,
  computed: {
    style () {
      return {
        backgroundImage: `url(${this.settings.url})`
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
