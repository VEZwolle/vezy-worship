<script>
import presentationTypes from '../presentation-types'

export default {
  props: {
    presentation: Object,
    alpha: Boolean,
    clear: Boolean
  },
  computed: {
    settings () {
      return this.presentation.settings
    },
    presentationType () {
      return presentationTypes.find(t => t.id === this.presentation?.type)
    },
    backgroundImageUrl () {
      return this.$store.getMediaUrl(this.settings.bgFileId)
    },
    style () {
      const style = {}

      if (this.backgroundImageUrl) {
        style.backgroundImage = `url(${this.backgroundImageUrl})`
      }

      return style
    },
    styleOpacity () {
      const style = {}

      if (this.settings.bgOpacity) {
        style.background = `rgba(0, 0, 0, ${this.settings.bgOpacity})`
      }

      return style
    }
  }
}
</script>

<style>
.bg-output-beamer {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}
</style>
