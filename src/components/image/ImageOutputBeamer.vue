<script>
import ImageOutput from './ImageOutput.vue'

export default {
  extends: ImageOutput,
  computed: {
    settings () {
      return this.presentation.settings.beamer
    }
  }
}
</script>
