<script>
import { defineComponent } from 'vue'
import ImageOutput from './ImageOutput.vue'

export default defineComponent({
  name: 'ImageOutputBeamer',
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
})
</script>
