<script>
import ImageOutput from './ImageOutput.vue'

export default {
  extends: ImageOutput,
  data () {
    return {
      beamer: false
    }
  },
  computed: {
    settingsimage () {
      if (!this.presentation.settings.livestream.fileId) {
        return this.presentation.settings.beamer
      }

      return this.presentation.settings.livestream
    }
  }
}
</script>
