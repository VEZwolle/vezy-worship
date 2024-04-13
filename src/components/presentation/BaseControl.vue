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
    },
    shortkeysNextBack () {
      return this.$store.shortkeysNextBack()
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
      if (!this.$store.arrowKeyContinueRemoteSetlist || this.preview) return
      switch (event.srcKey) {
        case 'up':
        case 'left':
        case 'pageup':
          return this.$store.goLiveBack()
        case 'down':
        case 'right':
        case 'pagedown':
          return this.$store.goLiveNext()
      }
    }
  }
}
</script>
