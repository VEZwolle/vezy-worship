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
    clear () {
      return this.$store.isClear
    }
  },
  methods: {
    goLive () {
      this.$store.goLive(this.presentation)

      if (!this.preview) {
        this.$store.unclear()
      }
    }
  }
}
</script>
