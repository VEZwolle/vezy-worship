<template>
  <div v-if="!clear" class="image">
    <ImagePreview :id="'livestream'" :scale="scale" :presentation="presentation" :bgcolor="'#000'" />
  </div>
</template>

<script>
import BaseOutput from '../output/BaseOutput.vue'
import ImagePreview from './ImagePreview.vue'

export default {
  components: { ImagePreview },
  extends: BaseOutput,
  data () {
    return {
      scale: 0
    }
  },
  computed: {
    fileUrl () {
      return this.$store.media[this.settings.livestream.fileId || this.settings.beamer.fileId]
    },
    style () {
      if (this.alpha) {
        return {
          backgroundColor: '#fff'
        }
      }

      return {
        backgroundImage: `url(${this.fileUrl})`
      }
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
