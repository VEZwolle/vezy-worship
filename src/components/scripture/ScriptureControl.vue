<template>
  <TextSlidesControl v-if="presentation.settings.text" :presentation="presentation" :preview="preview" />
</template>

<script>
import BaseControl from '../presentation/BaseControl.vue'
import TextSlidesControl from '../common/TextSlidesControl.vue'
import { splitTextCaption, titleLines } from '../caption/CaptionSplit.js'

export default {
  components: { TextSlidesControl },
  extends: BaseControl,
  computed: {
    title () {
      return this.settings.title ? this.settings.title : this.presentationType.title(this.settings)
    }
  },
  created () {
    this.presentation.beamerTitleLines = titleLines(this.title, 'Bijbeltekst')
    if (this.$store.noLivestream || this.presentation.settings.formatLivestream === 'Geen') {
      this.presentation.sections = splitTextCaption(this.presentation.settings.text, 'Bijbeltekst', 10000)
    } else {
      this.presentation.sections = splitTextCaption(this.presentation.settings.text, 'Bijbeltekst')
    }
  }
}
</script>
