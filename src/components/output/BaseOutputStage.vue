<script>
export default {
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
}
</script>
