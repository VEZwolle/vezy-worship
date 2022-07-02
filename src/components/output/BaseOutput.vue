<script>
export default {
  props: {
    presentation: Object,
    alpha: Boolean,
    clear: Boolean,
    outputvw: {
      type: Number,
      default: 19.2
    },
    outputvh: {
      type: Number,
      default: 10.8
    }
  },
  computed: {
    settings () {
      return this.presentation.settings
    }
  }
}
</script>
