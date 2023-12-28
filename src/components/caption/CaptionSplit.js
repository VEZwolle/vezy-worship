import { wrapTextLinesFormat } from '../common/WrapText'

const beamerFont = 'Ubuntu, "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif'

export function splitTextCaption (text, beamerFormat, maxCharsPerSlide = 350) {
  if (!text) {
    const slides = [['']]
    const beamerLines = [['']]
    return [{ slides, beamerLines }]
  }

  const lineBreaks = [
    '<div><br></div>'
  ]

  return text
    // replace newline with format to without: <b><i><u><sup><small>
    .replace(/<div>((<([biuspmal]*?)>)*?)<br>((<\/([biuspmal]*?)>)*?)<\/div>/g, '<div><br></div>')
    .split(new RegExp(lineBreaks.join('|')))
    // beamer = sections[] | livestream = sections[].slides[]
    .map((section) => {
      if (!section) {
        const slides = [['']]
        const beamerLines = [['']]
        return { slides, beamerLines }
      }
      const beamerLines = textLines(section, beamerFormat, beamerFont)
      const sentenceEndChars1 = '.?!’”\'";'
      const sentenceEndChars2 = ',:'
      const minMaxChars = `.{1,${maxCharsPerSlide}}`
      const regex = new RegExp(`${minMaxChars}$|${minMaxChars}<div>|${minMaxChars}[${sentenceEndChars1}]|${minMaxChars}[${sentenceEndChars2}]|${minMaxChars} |${minMaxChars}.`, 'g')

      let slides = section
        .match(regex)
        .map(line => [line])

      if (!slides.length) { slides = [['']] }

      return { slides, beamerLines }
    })
}

function textToLines (text) {
  if (!text) return []
  // split text to main lines
  return text
    .replace(/<div>((<([biuspmal]*?)>)*?)<br>((<\/([biuspmal]*?)>)*?)<\/div>/g, '<br>') // lege regel tussenregel met alinea einden en eventuele opmaak <b><i><u><sup><small>
    .replace(/^<div>/, '') // remove 1e div wanneer opmaak niet standaard
    .replace(/^((<br>)+)<div>/, '$1') // remove 1e div of br-(br)-div (div-(i)-br-(/i)-/div-div)
    .replace(/<div>/g, '<br>') // overige alinea regeleinden
    .replace(/<\/div>/g, '') // icm bovenstaand
    .split('<br>')
}

function textLines (text, format, font) {
  // for measurement text wrap (same as css)
  let maxWidth = 1000 // fictive width
  const letterSpacing = '0'
  let fontSize = 34 // px = 3.4vw /100*1000
  const fontBold = ''

  switch (format) {
    case 'Thema':
      fontSize = 25 // px = 2.5vw /100*1000
      maxWidth *= 0.90
      break
    case 'Titel':
      fontSize = 50 // px = 5vw /100*1000
      maxWidth *= 0.92
      break
    default:
      maxWidth *= 0.92
  }

  return wrapTextLinesFormat(textToLines(text), maxWidth, font, `${fontSize}px`, `${0.7 * fontSize}px`, `${0.7 * fontSize}px`, fontBold, letterSpacing)
}

export function titleLines (title, format) {
  // for measurement text wrap (same as css)
  let maxWidth = 1000 // fictive width
  const letterSpacing = '0.1px' // = 0.01vw /100*1000
  let fontSize = 46 // px = 4.6vw /100*1000
  let fontBold = '700'

  switch (format) {
    case 'Thema':
      fontSize = 58 // px = 5.8vw /100*1000
      maxWidth *= 0.90
      break
    case 'Titel':
      fontSize = 60 // px = 6vw /100*1000
      maxWidth *= 0.92
      break
    case 'Bijbeltekst':
      fontBold = '300'
      maxWidth *= 0.92
      break
    case 'Alleen tekst':
      return []
    default:
      maxWidth *= 0.92
  }

  return wrapTextLinesFormat(textToLines(title), maxWidth, beamerFont, `${fontSize}px`, `${0.7 * fontSize}px`, `${0.7 * fontSize}px`, fontBold, letterSpacing)
}
