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
      if (event.srcKey === this.$store.lastShortKey) return
      switch (event.srcKey) {
        case 'pageup':
          this.$store.setLastShortKey(event.srcKey)
        // eslint-disable-next-line no-fallthrough
        case 'up':
        case 'left':
          return this.$store.goLiveBack()
        case 'pagedown':
          this.$store.setLastShortKey(event.srcKey)
        // eslint-disable-next-line no-fallthrough
        case 'down':
        case 'right':
          return this.$store.goLiveNext()
      }
    }
  }
}
</script>
