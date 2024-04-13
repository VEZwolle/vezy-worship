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
import { isLabel } from './labels'
import chunk from 'lodash/chunk'

export default {
  components: { TextSlidesControl },
  extends: BaseControl,
  computed: {
    splitLines () {
      return this.presentation.settings.noSplitLines ? 0 : this.$store.splitSongLines
    }
  },
  created () {
    const split = this.$store.noLivestream ? 100 : 1
    if (!this.presentation.control) this.presentation.control = {}
    if (this.presentation.settings.translation) {
      // Use 1 line per slide
      this.presentation.control.sections = splitSong(this.presentation.settings.text, 1 * split, Math.floor(this.splitLines / 2))
      this.presentation.control.translationSections = splitSong(this.presentation.settings.translation, 1 * split, Math.floor(this.splitLines / 2))
    } else {
      // Use 2 lines per slide
      this.presentation.control.sections = splitSong(this.presentation.settings.text, 2 * split, this.splitLines)
    }
  }
}

export function splitSong (text, linesPerSlideLivestream, linesPerSlideBeamer = 0, minOneSlide = true) {
  if (!text) return []

  return splitSongMaxLines(text.replace(/\r?\n/g, '<br>'), linesPerSlideBeamer)
    .map((section) => {
      const result = {
        label: null,
        slides: []
      }

      const lines = section.split('<br>')

      const label = isLabel(lines[0] || '')
      if (label) {
        result.label = { ...label, value: lines[0] }
        lines.shift()
      }

      result.slides = chunk(lines, linesPerSlideLivestream)
      if (!result.slides.length && minOneSlide) { result.slides = [['']] }

      return result
    })
}

function splitSongMaxLines (text, maxlines = 0) {
  if (maxlines === 0) return text.split('<br><br>')
  const result = []
  const sections = text.split('<br><br>')
  for (let i = 0; i < sections.length; i++) {
    const lines = sections[i].split('<br>')
    const addLabelLine = isLabel(lines[0] || '') ? 1 : 0
    if (lines.length <= maxlines + addLabelLine) {
      result.push(sections[i])
      continue
    }
    let section = ''
    if (addLabelLine) section += `${lines[0]}`
    for (let j = addLabelLine; j < lines.length; j++) {
      section += section ? `<br>${lines[j]}` : lines[j]
      if ((j + 1 - addLabelLine) % maxlines === 0) {
        result.push(section)
        section = ''
      }
    }
    if (section) result.push(section)
  }
  return result
}
</script>
