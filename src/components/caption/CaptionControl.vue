<template>
  <TextSlidesControl v-if="presentation.settings.text && controlLoad" :presentation="presentation" :preview="preview" />
  <div
    v-else
    v-shortkey="shortkeysNextBack"
    @shortkey="baseHandleArrow"
    @click="setHandleArrowLocation"
  >
    <q-list class="q-py-sm">
      <q-item>
        <q-item-section>
          <div class="section-line" v-html="presentation.settings.title" />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import BaseControl from '../presentation/BaseControl.vue'
import TextSlidesControl from '../common/TextSlidesControl.vue'
import { splitTextCaption, titleLines } from '../caption/CaptionSplit.js'

export default defineComponent({
  name: 'CaptionControl',
  components: { TextSlidesControl },
  extends: BaseControl,

  data () {
    return {
      controlLoad: false
    }
  },

  created () {
    setTimeout(() => { 
      if (!this.presentation.control) this.presentation.control = {}
      if (!this.presentation.control.selectedSectionIndex) {
        this.presentation.control.selectedSectionIndex = 0
      }
      if (!this.presentation.control.selectedSlideIndex) {
        this.presentation.control.selectedSlideIndex = 0
      }
      // check if back from last item --> start at end
      if (!this.preview && this.$store.startEnd) {
        this.$store.startEnd = false // reset
        if (this.presentation.control.sections) {
          this.presentation.control.selectedSectionIndex = this.presentation.control.sections.length - 1
          this.presentation.control.selectedSlideIndex = this.presentation.control.sections[this.presentation.control.selectedSectionIndex].slides?.length - 1 || 0
        }
      }
      this.presentation.control.beamerTitleLines = this.presentation.settings.formatBeamer === 'Geen' ? [] : titleLines(this.presentation.settings.title, this.presentation.settings.formatBeamer)
      if (this.$store.noLivestream || this.presentation.settings.formatLivestream === 'Geen') {
        this.presentation.control.sections = splitTextCaption(this.presentation.settings.text, this.presentation.settings.formatBeamer, 10000)
      } else {
        this.presentation.control.sections = splitTextCaption(this.presentation.settings.text, this.presentation.settings.formatBeamer, this.presentation.settings.maxLivestreamChar || 500)
      }
      this.controlLoad = true
    }, this.preview ? 0 : 20)
  }
})
</script>

<style scoped lang="scss">
.q-list {
  border-bottom: $layout-border;
}

.q-item {
  transition: none;
  user-select: none;
  cursor: default !important;
  min-height: unset;
  padding: 1px 13px;

  .section-line {
    min-height: 0.7em;
  }
}
</style>
