<script>
import useServiceStore from 'stores/service'
import { mapStores } from 'pinia'

export default {
  props: {
    presentation: Object,
    preview: Boolean
  },
  computed: {
    ...mapStores(useServiceStore),
    settings () {
      return this.presentation.settings
    },
    clear () {
      return this.serviceStore.isClear
    }
  }
}
</script>
