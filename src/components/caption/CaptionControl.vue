<template>
  <TextSlidesControl v-if="presentation.settings.text" :presentation="presentation" :preview="preview" />
  <div
    v-else
    v-shortkey="shortkeysNextBack"
    @shortkey="baseHandleArrow"
  />
</template>

<script>
import BaseControl from '../presentation/BaseControl.vue'
import TextSlidesControl from '../common/TextSlidesControl.vue'
import { splitTextCaption, titleLines } from '../caption/CaptionSplit.js'

export default {
  components: { TextSlidesControl },
  extends: BaseControl,

  created () {
    if (!this.presentation.control) this.presentation.control = {}
    this.presentation.control.beamerTitleLines = this.presentation.settings.formatBeamer === 'Geen' ? [] : titleLines(this.presentation.settings.title, this.presentation.settings.formatBeamer)
    if (this.$store.noLivestream || this.presentation.settings.formatLivestream === 'Geen') {
      this.presentation.control.sections = splitTextCaption(this.presentation.settings.text, this.presentation.settings.formatBeamer, 10000)
    } else {
      this.presentation.control.sections = splitTextCaption(this.presentation.settings.text, this.presentation.settings.formatBeamer, this.presentation.settings.maxLivestreamChar || 500)
    }
  }
}
</script>
