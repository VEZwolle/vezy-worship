<template>
  <TextSlidesControl :presentation="presentation" :preview="preview" />
</template>

<script>
import BaseControl from '../presentation/BaseControl.vue'
import TextSlidesControl from '../common/TextSlidesControl.vue'
import chunk from 'lodash/chunk'

export default {
  components: { TextSlidesControl },
  extends: BaseControl,
  created () {
    if (this.presentation.settings.translation) {
      // Use 1 line per slide
      this.presentation.sections = splitSong(this.presentation.settings.text, 1)
      this.presentation.translationSections = splitSong(this.presentation.settings.translation, 1)
    } else {
      // Use 2 lines per slide
      this.presentation.sections = splitSong(this.presentation.settings.text, 2)
    }
  }
}

const labels = [
  { key: 'intro', color: 'deep-purple' },
  { key: 'introduction', color: 'deep-purple' },
  { key: 'verse', color: 'blue' },
  { key: 'vers', color: 'blue' },
  { key: 'couplet', color: 'blue' },
  { key: 'pre-chorus', color: 'purple' },
  { key: 'chorus', color: 'purple' },
  { key: 'refrein', color: 'purple' },
  { key: 'bridge', color: 'green' },
  { key: 'tag', color: 'deep-purple' },
  { key: 'tussenspel', color: 'deep-purple' },
  { key: 'interlude', color: 'deep-purple' },
  { key: 'misc', color: 'deep-purple' },
  { key: 'ending', color: 'red-10' },
  { key: 'end', color: 'red-10' },
  { key: 'eind', color: 'red-10' },
  { key: 'outro', color: 'red-10' },
  { key: 'slide', color: 'blue' },
  { key: 'vamp', color: 'blue' },
  { key: 'other', color: 'blue' },
  { key: 'scripture', color: 'red-10' }
]

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
        if (!lines[0]?.toLowerCase().startsWith(label.key)) {
          continue
        }

        result.label = { ...label, value: lines[0] }
        lines.shift()
        break
      }

      result.slides = chunk(lines, linesPerSlide)

      return result
    })
}
</script>
