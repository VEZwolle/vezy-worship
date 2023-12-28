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
      if (this.settings.title) return this.settings.title
      return this.presentationType?.title(this.settings) || ''
    }
  },
  created () {
    this.presentation.beamerTitleLines = titleLines(this.title, this.presentation.settings.formatBeamer)
    if (this.$store.noLivestream || this.presentation.settings.formatLivestream === 'Geen') {
      this.presentation.sections = splitTextCaption(this.presentation.settings.text, this.presentation.settings.formatBeamer, 10000)
    } else {
      this.presentation.sections = splitTextCaption(this.presentation.settings.text, this.presentation.settings.formatBeamer, this.presentation.settings.maxLivestreamChar || 350)
    }
  }
}
</script>
