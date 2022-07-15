<template>
  <div v-if="!clear" class="image">
    <!-- <div v-if="!clear" class="image" :style="style" /> -->
    <ImageOutput :id="'livestream'" :scale="scale" :presentation="presentation" :bgcolor="'#000'" :alpha="alpha" />
  </div>
</template>

<script>
import BaseOutput from '../output/BaseOutput.vue'
import ImageOutput from './ImageOutput.vue'

export default {
  components: { ImageOutput },
  extends: BaseOutput,
  data () {
    return {
      scale: 0
    }
  },
  mounted () { // toekomst nog aanpassen aan output formaten
    this.scale = (this.$el.offsetWidth) / 1920
  },
  updated () { // toekomst nog aanpassen aan output formaten
    this.scale = (this.$el.offsetWidth) / 1920
  }
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
