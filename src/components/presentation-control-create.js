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
      if (!resultPresentation.control.background) { resultPresentation.control.background = '' }
      if (!resultPresentation.control.lineHeigth) { resultPresentation.control.lineHeigth = 4.4 }
      if (!resultPresentation.control.translationLineHeigth) { resultPresentation.control.translationLineHeigth = 4.4 }
      if (!resultPresentation.control.fontFamily) { resultPresentation.control.fontFamily = '\'Alan Sans\', sans-serif' }
      if (!resultPresentation.control.fontStyle) { resultPresentation.control.fontStyle = 'normal' }
      if (!resultPresentation.control.fontWeight) { resultPresentation.control.fontWeight = 400 }
      if (!resultPresentation.control.fontSize) { resultPresentation.control.fontSize = 3.8 }
      if (!resultPresentation.control.letterSpacing) { resultPresentation.control.letterSpacing = 0.01 }
      if (!resultPresentation.control.fill) { resultPresentation.control.fill = '#fff' }
      if (!resultPresentation.control.stroke) { resultPresentation.control.stroke = '#000' }
      if (!resultPresentation.control.strokeWidth) { resultPresentation.control.strokeWidth = 0.5 }
      if (!resultPresentation.control.strokeLinejoin) { resultPresentation.control.strokeLinejoin = 'round' }
      if (!resultPresentation.control.paintOrder) { resultPresentation.control.paintOrder = 'stroke' }
      if (!resultPresentation.control.textAnchor) { resultPresentation.control.textAnchor = 'middle' }
      if (!resultPresentation.control.dominantBaseline) { resultPresentation.control.dominantBaseline = 'middle' }
      if (!resultPresentation.control.filter) { resultPresentation.control.filter = 0.8 }
      if (!resultPresentation.control.filterlength) { resultPresentation.control.filterlength = 0.3 }
      if (!resultPresentation.control.translationFontSize) { resultPresentation.control.translationFontSize = 3.4 }
      if (!resultPresentation.control.translationFontStyle) { resultPresentation.control.translationFontStyle = 'italic' }
      if (!resultPresentation.control.translationFontWeight) { resultPresentation.control.translationFontWeight = 400 }
      if (!resultPresentation.control.translationFill) { resultPresentation.control.translationFill = '#bbb' }
      if (!resultPresentation.control.translationStrokeWidth) { resultPresentation.control.translationStrokeWidth = 0.4 }
      if (!resultPresentation.control.translationFilter) { resultPresentation.control.translationFilter = 0.6 }
      if (!resultPresentation.control.translationFilterlength) { resultPresentation.control.translationFilterlength = 0.3 }
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
          resultPresentation.control.sections = splitTextCaption(resultPresentation.settings.text, resultPresentation.settings.formatBeamer, resultPresentation.settings.maxBeamerLine || 7, 10000)
        } else {
          resultPresentation.control.sections = splitTextCaption(resultPresentation.settings.text, resultPresentation.settings.formatBeamer, resultPresentation.settings.maxBeamerLine || 7, resultPresentation.settings.maxLivestreamChar || 500)
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
      resultPresentation.control.readyStateAll = false
      resultPresentation.control.oscTimeFactor = 0
      break
    default:
  }
  return resultPresentation
}
