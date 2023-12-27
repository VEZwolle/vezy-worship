<template>
  <TextSlidesControl v-if="presentation.settings.text" :presentation="presentation" :preview="preview" />
</template>

<script>
import BaseControl from '../presentation/BaseControl.vue'
import TextSlidesControl from '../common/TextSlidesControl.vue'
import { splitTextCaption, titleLines } from '../caption/CaptionControl.vue'

export default {
  components: { TextSlidesControl },
  extends: BaseControl,
  data () {
    return {
      font: 'Ubuntu, "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif'
    }
  },
  computed: {
    title () {
      return this.settings.title ? this.settings.title : this.presentationType.title(this.settings)
    }
  },
  created () {
    this.presentation.beamerTitleLines = titleLines(this.title, 'Bijbeltekst', this.font)
    if (this.$store.noLivestream || this.presentation.settings.formatLivestream === 'Geen') {
      this.presentation.sections = splitTextCaption(this.presentation.settings.text, 'Bijbeltekst', this.font, 10000)
    } else {
      this.presentation.sections = splitTextCaption(this.presentation.settings.text, 'Bijbeltekst', this.font)
    }
  }
}
</script>
