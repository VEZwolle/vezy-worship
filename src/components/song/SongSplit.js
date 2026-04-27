import { isLabel } from './labels.js'
import chunk from 'lodash/chunk'

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
