<script>
export default {
  props: {
    presentation: Object,
    alpha: Boolean,
    clear: Boolean,
    outputvw: {
      type: Number,
      default: 1
    },
    outputvh: {
      type: Number,
      default: 1
    }
  },
  computed: {
    settings () {
      return this.presentation.settings
    }
  }
}
</script>
