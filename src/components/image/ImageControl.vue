<template>
  <div class="q-pa-md row q-gutter-md">
    <div class="col">
      Beamer:<br>
      <ImageOutput :id="'beamer'" :scale="scale" :presentation="presentation" />
    </div>
    <div class="col">
      Livestream:<br>
      <ImageOutput :id="'livestream'" :scale="scale" :presentation="presentation" />
    </div>
  </div>
</template>

<script>
import BaseControl from '../presentation/BaseControl.vue'
import ImageOutput from './ImageOutput.vue'

export default {
  components: { ImageOutput },
  extends: BaseControl,
  data () {
    return {
      scale: 0
    }
  },
  computed: {
    fileUrl () {
      return this.$store.media[this.settings.fileId]
    },
    fileLivestreamUrl () {
      return this.$store.media[this.settings.fileLivestreamId] || this.fileUrl
    }
  },
  mounted () { // toekomst nog aanpassen aan output formaten
    this.scale = ((this.$el.offsetWidth * 0.5) - 40) / 1920
  }
}
</script>
