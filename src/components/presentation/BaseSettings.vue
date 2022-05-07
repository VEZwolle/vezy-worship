<script>
export default {
  props: {
    presentation: Object
  },
  computed: {
    settings () {
      return this.presentation.settings
    }
  }
}
</script>
