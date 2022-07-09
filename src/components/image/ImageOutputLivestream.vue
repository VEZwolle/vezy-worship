<script>
import ImageOutputBeamer from './ImageOutputBeamer.vue'

export default {
  extends: ImageOutputBeamer,
  computed: {
    fileUrl () {
      return this.$store.media[this.settings.fileLivestreamId || this.settings.fileId]
    }
  }
}
</script>
