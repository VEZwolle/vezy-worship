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
    classLive () {
      return !this.preview ? 'text-white' : ''
    }
  }
}
</script>
