import cloneDeep from 'lodash/cloneDeep'
import { splitSong } from './song/SongSplit.js'
import { splitTextCaption, titleLines } from './caption/CaptionSplit.js'

export function addControlCloneDeep (presentation, noLivestream, splitSongLines, preview, startEnd) {
  if (!presentation) return cloneDeep(presentation)
  const resultPresentation = cloneDeep(presentation)
  const split = noLivestream ? 100 : 1
  const splitLines = resultPresentation.settings.noSplitLines ? 0 : splitSongLines
  
  switch (resultPresentation.type) {
    case 'song':
      if (!resultPresentation.control) resultPresentation.control = {}
      if (!resultPresentation.control.selectedSectionIndex) {
          resultPresentation.control.selectedSectionIndex = 0
        }
        if (!resultPresentation.control.selectedSlideIndex) {
          resultPresentation.control.selectedSlideIndex = 0
        }
        if (resultPresentation.settings.translation) {
          // Use 1 line per slide
          resultPresentation.control.sections = splitSong(resultPresentation.settings.text, 1 * split, Math.floor(splitLines / 2))
          resultPresentation.control.translationSections = splitSong(resultPresentation.settings.translation, 1 * split, Math.floor(splitLines / 2))
        } else {
          // Use 2 lines per slide
          resultPresentation.control.sections = splitSong(resultPresentation.settings.text, 2 * split, splitLines)
        }
        if (!preview && startEnd) {
          // this.$store.startEnd = false // reset --> bijgolive
          if (resultPresentation.control.sections) {
            resultPresentation.control.selectedSectionIndex = resultPresentation.control.sections.length - 1
            resultPresentation.control.selectedSlideIndex = resultPresentation.control.sections[resultPresentation.control.selectedSectionIndex].slides?.length - 1 || 0
          }
        }
      break
    case 'caption':
    case 'scripture':
      if (!resultPresentation.control) resultPresentation.control = {}
      if (!resultPresentation.control.selectedSectionIndex) {
          resultPresentation.control.selectedSectionIndex = 0
        }
        if (!resultPresentation.control.selectedSlideIndex) {
          resultPresentation.control.selectedSlideIndex = 0
        }
        resultPresentation.control.beamerTitleLines = resultPresentation.settings.formatBeamer === 'Geen' ? [] : titleLines(resultPresentation.settings.title, resultPresentation.settings.formatBeamer)
        if (noLivestream || resultPresentation.settings.formatLivestream === 'Geen') {
          resultPresentation.control.sections = splitTextCaption(resultPresentation.settings.text, resultPresentation.settings.formatBeamer, 10000)
        } else {
          resultPresentation.control.sections = splitTextCaption(resultPresentation.settings.text, resultPresentation.settings.formatBeamer, resultPresentation.settings.maxLivestreamChar || 500)
        }
        if (!preview && startEnd) {
          // this.$store.startEnd = false // reset --> bijgolive
          if (resultPresentation.control.sections) {
            resultPresentation.control.selectedSectionIndex = resultPresentation.control.sections.length - 1
            resultPresentation.control.selectedSlideIndex = resultPresentation.control.sections[resultPresentation.control.selectedSectionIndex].slides?.length - 1 || 0
          }
        }
      break
    case 'countdown':
      if (!resultPresentation.control) resultPresentation.control = { isFinished: true, remaining: '' }
      break
    case 'image':
      if (!resultPresentation.control?.tab) {
        resultPresentation.control = { tab: 'both' }
        if (noLivestream) {
          resultPresentation.control.tab = 'beamer'
        }
      }
      break
    case 'video':
      if (!resultPresentation.control) resultPresentation.control = {}
      resultPresentation.control.readyStateFirst = false
      break
    default:
  }
  return resultPresentation
}
