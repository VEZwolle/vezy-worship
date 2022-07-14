<template>
  <div class="q-pa-md row q-gutter-md">
    <div class="col">
      Beamer:<br>
      <img :src="fileUrl" class="full-width">
    </div>
    <div class="col">
      Livestream:<br>
      <img :src="fileLivestreamUrl" class="full-width">
    </div>
  </div>
</template>

<script>
import BaseControl from '../presentation/BaseControl.vue'

export default {
  extends: BaseControl,
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
