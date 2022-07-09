<template>
  <div class="q-pa-md row">
    <div class="width50">
      Beamer<br>
      <img :src="fileUrl" class="full-width">
    </div>
    <div class="width50">
      Livestream<br>
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
      return this.$store.media[this.settings.fileLivestreamId]
    }
  }
}
</script>

<style scope>
.width50 {
  width: 50%;
}
</style>
