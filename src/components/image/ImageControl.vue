<template>
  <div class="q-pa-md">
    <img :src="fileUrl" class="full-width">
  </div>
</template>

<script>
import BaseControl from '../presentation/BaseControl.vue'

export default {
  extends: BaseControl,
  computed: {
    fileUrl () {
      return this.$store.media[this.settings.fileId]
    }
  }
}
</script>
