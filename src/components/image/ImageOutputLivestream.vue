<script>
import ImageOutput from './ImageOutput.vue'

export default {
  extends: ImageOutput,
  computed: {
    settings () {
      if (!this.presentation.settings.livestream.fileId) {
        return this.presentation.settings.beamer
      }

      return this.presentation.settings.livestream
    }
  }
}
</script>
