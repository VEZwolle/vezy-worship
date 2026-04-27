<script>
import { defineComponent } from 'vue'
import ImageOutput from './ImageOutput.vue'

export default defineComponent({
  name: 'ImageOutputLivestream',
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
})
</script>
