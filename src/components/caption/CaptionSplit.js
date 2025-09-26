import { wrapTextLinesFormat } from '../common/WrapText.js'

const beamerFont = 'Ubuntu, "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif'

export function splitTextCaption (text, beamerFormat, maxCharsPerSlide = 500) {
  if (!text) {
    const slides = [['']]
    const beamerLines = [['']]
    return [{ slides, beamerLines }]
  }

  const lineBreaks = [
    '<div><br></div>'
  ]

  const inputSections = text
    // replace newline with format to without: <b><i><u><sup><small>
    .replace(/<div>((<([biuspmal]*?)>)*?)<br>((<\/([biuspmal]*?)>)*?)<\/div>/g, '<div><br></div>')
    .split(new RegExp(lineBreaks.join('|')))
    // beamer = sections[].beamerLines | livestream = sections[].slides[]
  
  const outputSections = []
  
  inputSections.forEach(inputSection => {
      if (!inputSection) {
        const slides = [['']]
        const beamerLines = [['']]
        outputSections.push( { slides, beamerLines } )
      }
      // beamer regels & opsplitsen naar ..regels & slides met maximaal ...char vanuit inputsecton 
      const textLinesTemp = textLines(inputSection, beamerFormat, beamerFont, 7)
      textLinesTemp.forEach(textLineTemp => {
        const beamerLines = textLineTemp.formats
        const slides = splitSectionToSlides(textLineTemp, maxCharsPerSlide) // opsplisten naar livestream (sommatie hiervan = beamer section in control)
          .map(line => [line])
        outputSections.push( { slides, beamerLines } )
      })
  })

  return outputSections  
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

function textLines (text, format, font, maxLineCount = 10000) {
  // for measurement text wrap (same as css)
  // and split to beamer sections
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

  return wrapTextLinesFormat(textToLines(text), maxWidth, font, `${fontSize}px`, `${0.7 * fontSize}px`, `${0.7 * fontSize}px`, fontBold, letterSpacing, maxLineCount)
  // output beamer sections [{formats:[{beamerlines}], plainText:string]]
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

  const titleLinesTemp = wrapTextLinesFormat(textToLines(title), maxWidth, beamerFont, `${fontSize}px`, `${0.7 * fontSize}px`, `${0.7 * fontSize}px`, fontBold, letterSpacing)
  // titel zit altijd op 1 pagina, geen splitsing (fictief op 10000 regels bepaald)
  return titleLinesTemp[0] ? titleLinesTemp[0].formats : []
  // output beamer section: [{beamerlines}]
}

// split wrap text to N beamer lines en livestream chars
function splitSectionToSlides (section, livestreamMaxCharCount = 500) {
  const formatBeamerLines = section.formats
  const plainText = section.plainText
  const slides = []

  // opsplisten naar livestream
  // opsplitsen: uitgaande van plain text & \n
  // - minder maximaal aantal tekens
  // - voor regelstart voor max tekens '\n' (gelijk met sentenceEndChars1)
  // - voor sentenceEndChars1 voor max tekens '.?!’”\'";'
  // - voor sentenceEndChars2 voor max tekens ',:'
  // - voor spatie voor max tekens ' '
  // - voor willekeurig teken voor max tekens .
  // const regex = new RegExp(`.{1,500}$|.{1,500}[\n.?!’”\'";]|.{1,500}[,:]|.{1,500} |.{1,500}.`, 'gs')
  const sentenceEndChars1 = '\n.?!’”\'";'
  const sentenceEndChars2 = ',:'
  const minMaxChars = `.{1,${livestreamMaxCharCount}}`
  const regex = new RegExp(`${minMaxChars}$|${minMaxChars}[${sentenceEndChars1}]|${minMaxChars}[${sentenceEndChars2}]|${minMaxChars} |${minMaxChars}.`, 'gs')

  const plainTextSlides = plainText.match(regex)
  console.log('plainTextSlides', plainTextSlides)
  // splits beamer format naar zelfde delen toe.
  const slidesFormatBeamerLines = []
  if (plainTextSlides.length <= 1) { // alles op 1e slide livestream
    slidesFormatBeamerLines.push(formatBeamerLines)
  } else { // naar slides opdelen
    let tempFormatBeamerLines = []
    let n = 0
    let lengthCount = plainTextSlides[n].replaceAll('\n', '').length
    for (let i=0; i < formatBeamerLines.length; i++) {
      // { text: string, class: string, newLine: boolean, line: int }
      if (formatBeamerLines[i].text.length <= lengthCount) {
        tempFormatBeamerLines.push(formatBeamerLines[i])
        lengthCount -= formatBeamerLines[i].text.length
        continue
      }
      let nextLineText = ''
      if (lengthCount) {
        tempFormatBeamerLines.push({ text: formatBeamerLines[i].text.slice(0, lengthCount), class: formatBeamerLines[i].class, newLine: formatBeamerLines[i].newLine, line: formatBeamerLines[i].line })
        nextLineText = formatBeamerLines[i].text.slice(lengthCount)
      }
      slidesFormatBeamerLines.push(tempFormatBeamerLines)
      tempFormatBeamerLines = []
      n++
      if (n >= plainTextSlides.length) {
        lengthCount = 0
        break
      }
      lengthCount = plainTextSlides[n].replaceAll('\n', '').length
      while (nextLineText.length > 0) { // mocht er een lang stuk tekst staan dat vaker opgedeld moet worden, loop tot text op is.
        if (nextLineText.length <= lengthCount) {
          tempFormatBeamerLines.push({ text: nextLineText, class: formatBeamerLines[i].class, newLine: formatBeamerLines[i].newLine, line: formatBeamerLines[i].line })
          lengthCount -= nextLineText.length
          nextLineText = ''
          continue
        } else {
          tempFormatBeamerLines.push({ text: nextLineText.slice(0, lengthCount), class: formatBeamerLines[i].class, newLine: formatBeamerLines[i].newLine, line: formatBeamerLines[i].line })
          nextLineText = nextLineText.slice(lengthCount)
          slidesFormatBeamerLines.push(tempFormatBeamerLines)
          tempFormatBeamerLines = []
          n++
          if (n >= plainTextSlides.length) {
            lengthCount = 0
            break
          }
          lengthCount = plainTextSlides[n].replaceAll('\n', '').length    
        }
      }
      
    }
    if (tempFormatBeamerLines.length) slidesFormatBeamerLines.push(tempFormatBeamerLines)
  }
  // per slide staan de beamer reagels in slidesFormatBeamerLines
   const classHTML = [
    { format: 'bold', html: 'b' },
    { format: 'italic', html: 'i' },
    { format: 'underline', html: 'u' },
    { format: 'sup', html: 'sup' },
    { format: 'small', html: 'small' }
  ]

  slidesFormatBeamerLines.forEach(slideFBL => {
    let htmlText = '<div>'
    let currentLine = slideFBL[0].line
    slideFBL.forEach(formatText =>{
      if (formatText.newLine && formatText.line > currentLine) {
        htmlText += '</div><div>'
        currentLine = formatText.line
      }
      let htmlformat = ''
      const formats = formatText.class?.split(' ') || []
      if (formats.length) {
        formats.forEach(format => {
          const html = classHTML.find(t => t.format === format)?.html
          if (html) htmlformat += `<${html}>`
        })
      }
      htmlText += htmlformat + formatText.text + htmlformat.replace('<','</')
    })
    htmlText += '</div>'
    slides.push(htmlText)
  })
  console.log('slides', slides)
  return slides
}
