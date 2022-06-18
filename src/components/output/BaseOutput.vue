<script>
export default {
  props: {
    presentation: Object,
    alpha: Boolean,
    clear: Boolean
  },
  computed: {
    settings () {
      return this.presentation.settings
    }
  }
}
</script>
