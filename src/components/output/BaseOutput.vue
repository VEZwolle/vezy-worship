<script>
import presentationTypes from '../presentation-types'

export default {
  props: {
    presentation: Object,
    alpha: Boolean,
    clear: Boolean
  },
  computed: {
    settings () {
      return this.presentation.settings
    },
    presentationType () {
      return presentationTypes.find(t => t.id === this.presentation?.type)
    }
  }
}
</script>
