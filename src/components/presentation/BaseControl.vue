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
    },
    baseHandleArrow (event) {
      if (!this.$store.arrowKeyContinueSetlist || this.preview) return
      switch (event.srcKey) {
        case 'up':
        case 'left':
          return this.$store.goLiveBack()
        case 'down':
        case 'right':
          return this.$store.goLiveNext()
      }
    }
  }
}
</script>
