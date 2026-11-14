<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BaseSettings',
  props: {
    presentation: Object
  },
  computed: {
    settings () {
      return this.presentation.settings
    }
  },
  methods: {
    isRequired (val) {
      return !!val || 'Verplicht'
    }
  }
})
</script>
