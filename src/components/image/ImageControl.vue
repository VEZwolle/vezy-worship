<template>
  <div class="q-pa-md row q-gutter-md">
    <div class="col">
      Beamer:<br>
      <OutputPreview :id="'beamer'" :component="ImageOutput" :presentation="{ settings }" />
    </div>
    <div class="col">
      Livestream:<br>
      <OutputPreview :id="'livestream'" :component="ImageOutput" :presentation="{ settings }" />
    </div>
  </div>
</template>

<script>
import BaseControl from '../presentation/BaseControl.vue'
import OutputPreview from '../output/OutputPreview.vue'
import ImageOutput from './ImageOutput.vue'

export default {
  components: { OutputPreview },
  extends: BaseControl,
  setup () {
    return { ImageOutput }
  },
  computed: {
    fileUrl () {
      return this.$store.media[this.settings.fileId]
    },
    fileLivestreamUrl () {
      return this.$store.media[this.settings.fileLivestreamId] || this.fileUrl
    }
  }
}
</script>
