<template>
  <TextSlidesControl v-if="presentation.settings.text" :presentation="presentation" :preview="preview" />
</template>

<script>
import BaseControl from '../presentation/BaseControl.vue'
import TextSlidesControl from '../common/TextSlidesControl.vue'
import labels from './labels'
import chunk from 'lodash/chunk'

export default {
  components: { TextSlidesControl },
  extends: BaseControl,
  created () {
    const split = this.$store.noLivestream ? 100 : 1
    if (this.presentation.settings.translation) {
      // Use 1 line per slide
      this.presentation.sections = splitSong(this.presentation.settings.text, 1 * split)
      this.presentation.translationSections = splitSong(this.presentation.settings.translation, 1 * split)
    } else {
      // Use 2 lines per slide
      this.presentation.sections = splitSong(this.presentation.settings.text, 2 * split)
    }
  }
}

function splitSong (text, linesPerSlide) {
  if (!text) return []

  return text
    .replace(/\r?\n/g, '<br>')
    .split('<br><br>')
    .map((section) => {
      const result = {
        label: null,
        slides: []
      }

      const lines = section.split('<br>')

      for (const label of labels) {
        if (((lines[0]?.toLowerCase().startsWith(label.key) && /[\d({[]/.test(lines[0]?.toLowerCase())) || lines[0]?.toLowerCase() === label.key) === false) {
          continue
        }

        result.label = { ...label, value: lines[0] }
        lines.shift()
        break
      }

      result.slides = chunk(lines, linesPerSlide)
      if (!result.slides.length) { result.slides = [['']] }

      return result
    })
}
</script>
