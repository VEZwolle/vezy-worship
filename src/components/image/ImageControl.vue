<template>
  <div class="q-pa-md row q-gutter-md">
    <div class="col">
      Beamer:<br>
      <!-- <img :src="fileUrl" class="full-width"> -->
      <ImagePreview :id="'beamer'" :scale="scale" :presentation="presentation" />
    </div>
    <div class="col">
      Livestream:<br>
      <!-- <img :src="fileLivestreamUrl" class="full-width"> -->
      <ImagePreview :id="'livestream'" :scale="scale" :presentation="presentation" />
    </div>
  </div>
</template>

<script>
import BaseControl from '../presentation/BaseControl.vue'
import ImagePreview from './ImagePreview.vue'

export default {
  components: { ImagePreview },
  extends: BaseControl,
  data () {
    return {
      scale: 0
    }
  },
  computed: {
    fileUrl () {
      return this.$store.media[this.settings.beamer.fileId]
    },
    fileLivestreamUrl () {
      return this.$store.media[this.settings.livestream.fileId] || this.fileUrl
    }
  },
  mounted () { // toekomst nog aanpassen aan output formaten
    this.scale = ((this.$el.offsetWidth * 0.5) - 40) / 1920
  }
}
</script>
