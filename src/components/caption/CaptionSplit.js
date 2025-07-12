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
  // opsplisten naar livestream (sommatie hiervan = beamer section in control)
  // opsplitsen: bij tellijng wordt <...> html ook meegeteld
  // - minder maximaal aantal tekens
  // - voor regelstart voor max tekens '<div>'
  // - voor sentenceEndChars1 voor max tekens '.?!’”\'";'
  // - voor sentenceEndChars2 voor max tekens ',:'
  // - voor spatie voor max tekens ' '
  // - voor willekeurig teken voor max tekens .
  // const regex = new RegExp(`.{1,500}$|.{1,500}<div>|.{1,500}[.?!’”\'";]|.{1,500}[,:]|.{1,500} |.{1,500}.`, 'g')
  const sentenceEndChars1 = '.?!’”\'";'
  const sentenceEndChars2 = ',:'
  const minMaxChars = `.{1,${maxCharsPerSlide}}`
  const regex = new RegExp(`${minMaxChars}$|${minMaxChars}<div>|${minMaxChars}[${sentenceEndChars1}]|${minMaxChars}[${sentenceEndChars2}]|${minMaxChars} |${minMaxChars}.`, 'g')

  inputSections.forEach(inputSection => {
      if (!inputSection) {
        const slides = [['']]
        const beamerLines = [['']]
        outputSections.push( { slides, beamerLines } )
      }
      // beamer regels & opsplitsen naar ..regels vanuit inputsecton 
      const htmlTextBeamerLinesS = splitToSectionsN(textLines(inputSection, beamerFormat, beamerFont), 7)
      htmlTextBeamerLinesS.forEach(htmlTextBeamerLines => {
        const beamerLines = htmlTextBeamerLines.beamerLines 
        // opsplisten naar livestream (sommatie hiervan = beamer section in control)
        let slides = htmlTextBeamerLines.htmlText
          .match(regex)
          .map(line => [line])

        if (!slides.length) { slides = [['']] }

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

// split wrap text to N beamer lines en livestream chars
function splitToSectionsN (allLines, maxLineCount = 10000) {
  // wat moet bij regeleinden en aan beging/einde section staan. --> start met <div> einig met </div>
  // start format
  const activeClass = [
    { format: 'bold', html: 'b', active: 0 },
    { format: 'italic', html: 'i', active: 0 },
    { format: 'underline', html: 'u', active: 0 },
    { format: 'sup', html: 'sup', active: 0 },
    { format: 'small', html: 'small', active: 0 }
  ]
  let activeClassCount = 0

  // var
  let activeUserLine = 0
  let lineCount = 0
  let sections = []
  let beamerLines = []
  let htmlText = ''
  
  allLines.forEach(allLine => {
    let htmlFormat = ''
    if (allLine.newLine ) { // volgende regel starten
      lineCount++
      if (lineCount > maxLineCount) {
        // sluit alle format en voeg toe aan sections
        if (activeClassCount) {
          // start bij hoogste nummer.
          for (let j = activeClassCount; j > 0; j--) {
            const formatNr = activeClass.findIndex(t => t.active === j)
            if (formatNr >= 0) {
              htmlText += `</${activeClass[formatNr]?.html}>`
              activeClass[formatNr].active = 0
            }
          }
          activeClassCount = 0
        }
        htmlText += '</div>'
        sections.push({ htmlText, beamerLines })
        lineCount = 1
        activeUserLine = allLine.line
        htmlText = ''
        beamerLines = []
      }
      if (lineCount === 1) htmlText += '<div>'
      if (allLine.line > activeUserLine ) { // = niewe regel door gebruiker, laten bestaan.
        // sluit alle formats, en voeg dan regeleinde toe.
        if (activeClassCount) {
          // start bij hoogste nummer.
          for (let j = activeClassCount; j > 0; j--) {
            const formatNr = activeClass.findIndex(t => t.active === j)
            if (formatNr >= 0) {
              htmlFormat += `</${activeClass[formatNr].html}>`
              activeClass[formatNr].active = 0
            }
          }
          activeClassCount = 0
        }
        htmlText += `${htmlFormat}</div><div>`
        htmlFormat = ''
      } else {
        htmlText += ' ' // spatie toevoegen voor gewrapte nieuwe regel. //nog check dat niet aan begin regel komt.
      }
    }
    beamerLines.push(allLine)
    const formats = allLine.class?.split(' ') || []
    // close format's if not used
    if (activeClassCount) {
      // zoek eerst hoogste nummer, die kan gelijk sluiten, anders eerst andere sluiten en daarna (icm nieuwe weer openen).
      for (let activeClassNr = activeClassCount; activeClassNr > 0; activeClassNr--) {
        const lastFormat = activeClass.findIndex(t => t.active === activeClassNr)
        if (lastFormat >= 0) {
          if (!formats.includes(activeClass[lastFormat].format)) {
            if (activeClassNr !== activeClassCount) { // latere moeten eerst gesloten worden
              for (let j = activeClassCount; j > activeClassNr; j--) {
                const formatNr = activeClass.findIndex(t => t.active === j)
                if (formatNr >= 0) {
                  htmlFormat += `</${activeClass[formatNr].html}>`
                  activeClass[formatNr].active = 0
                }
                activeClassCount--
              }
            }
            htmlFormat += `</${activeClass[lastFormat].html}>`
            activeClass[lastFormat].active = 0
            activeClassCount--
          }
        }
      }
    }
    // add new format's & removed formats
    formats.forEach(format => {
      const formatNr = activeClass.findIndex(t => t.format === format)
      if (formatNr >= 0) {
        if (!activeClass[formatNr].active) {
          activeClassCount++
          activeClass[formatNr].active = activeClassCount
          htmlFormat += `<${activeClass[formatNr].html}>`
        }
      }
    })
    // voeg (lokale) opmaak toe aan section tekst
    htmlText += htmlFormat
    // voeg text toe + speciale HTML tekens terug
    htmlText += allLine.text
      .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g, '&amp;') // html-entities
      .replace(/ {2}/g, '&nbsp;&nbsp;') // dubbele SPATIE vervangen, enkele laten staan
  })
  // laatste section nog toevoegen, wanneer er nog wat in staat.
  if (htmlText) {
    // sluit alle format en voeg toe aan sections
    if (activeClassCount) {
      // start bij hoogste nummer.
      for (let j = activeClassCount; j > 0; j--) {
        const formatNr = activeClass.findIndex(t => t.active === j)
        if (formatNr >= 0) {
          htmlText += `</${activeClass[formatNr].html}>`
          activeClass[formatNr].active = 0
        }
      }
      activeClassCount = 0
    }
    sections.push({ htmlText, beamerLines })
    lineCount = 0
    htmlText = ''
  }
  return sections
}
