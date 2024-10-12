<script>
import ImageOutput from './ImageOutput.vue'

export default {
  extends: ImageOutput,
  data () {
    return {
      beamer: true
    }
  },
  computed: {
    settingsimage () {
      return this.presentation.settings.beamer
    }
  }
}
</script>
