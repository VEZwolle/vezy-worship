<script>
export default {
  props: {
    presentation: Object,
    alpha: Boolean
  },
  computed: {
    settings () {
      return this.presentation.settings
    }
  }
}
</script>
