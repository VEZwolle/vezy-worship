<script>
export default {
  props: {
    presentation: Object,
    preview: Boolean
  },
  computed: {
    settings () {
      return this.presentation.settings
    }
  }
}
</script>
