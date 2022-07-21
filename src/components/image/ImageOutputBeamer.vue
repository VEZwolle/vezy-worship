<template>
  <div v-if="!clear" class="image">
    <ImageOutput :id="'beamer'" :presentation="presentation" :bgcolor="'#000'" :alpha="alpha" />
  </div>
</template>

<script>
import BaseOutput from '../output/BaseOutput.vue'
import ImageOutput from './ImageOutput.vue'

export default {
  components: { ImageOutput },
  extends: BaseOutput
}
</script>

<style scoped>
.image {
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: cover;
  overflow: hidden;
}
</style>
