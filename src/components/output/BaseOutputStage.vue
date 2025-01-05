<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BaseOutputStage',
  props: {
    presentation: Object,
    preview: Boolean
  },
  computed: {
    settings () {
      return this.presentation.settings
    },
    control () {
      return this.presentation.control || {}
    },
    classLive () {
      return !this.preview ? 'text-white' : ''
    }
  }
})
</script>
