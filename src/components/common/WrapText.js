export function getTextWidth (text, font, letterSpacing) {
  const context = document.createElement('canvas').getContext('2d')
  context.font = font
  context.letterSpacing = letterSpacing
  return context.measureText(text).width
}

export function wrapText (text, maxWidthFirst, maxWidthLine, addLastWordWidth, font, letterSpacing) {
  if (getTextWidth(text, font, letterSpacing) + addLastWordWidth <= maxWidthFirst) return [text]

  const words = text.split(' ')
  const completedLines = []
  let nextLine = ''

  words.forEach((word, index) => {
    let wordLength = getTextWidth(`${word} `, font, letterSpacing)
    if (index + 1 === words.length) wordLength += addLastWordWidth
    const nextLineLength = getTextWidth(nextLine, font, letterSpacing)

    switch (true) {
      case (wordLength > maxWidthLine):
        completedLines.push(nextLine)
        completedLines.push(word) // don't break the word when don't fit
        nextLine = ''
        break
      case (nextLineLength + wordLength >= maxWidthFirst && completedLines.length === 0) ||
      (nextLineLength + wordLength >= maxWidthLine && completedLines.length > 0):
        completedLines.push(nextLine)
        nextLine = word
        break
      default:
        nextLine = index === 0 ? [nextLine, word].filter(Boolean).join(' ') : [nextLine, word].join(' ')
    }

    if (index + 1 === words.length) completedLines.push(nextLine)
  })

  return completedLines.filter(line => line !== '')
}

export function wrapTextLines (lines, maxWidth, font, letterSpacing) {
  const allLines = []
  lines.forEach(line => {
    const wrapLines = wrapText(line, maxWidth, maxWidth, 0, font, letterSpacing)
    wrapLines.forEach(wrapLine => {
      allLines.push(wrapLine)
    })
  })
  return allLines
}

export function wrapTextLinesFormat (lines, maxWidth, fonttype, fontSize, fontSizeSup, fontSizeSmall, fontBold, letterSpacing) {
  /*
  * lines[] = array van verschillende alinea's/regels
  *      Hierin zit geen <div><br> meer in (regeleinden), alleen nog opmaak: <b><i><u><sup><small>
  * maxWith = regellengte maximaal
  * overige verschillende font opmaken.
  *
  * Stappen: lines[i] -sub-> linePieces[] >= lineRFS[n] -sub-> wrapLineRFS[j] =totaal=> allLines[]
  * --------
  * Per line in lines[], eindstaties verwijderen & opdelen op wisseling opmaak (<..>) --> linePieces[]
  *
  ** Lees per onderdeel in linePieces opmaak(wijziging uit)
  ** --> Wanneer de tekst aanwezig (lengte > 0): voeg deze toe aan "line pieces Result Format Segments" --> lineRFS[]
  **    lineRFS.push({text, class, font, letterSpacing, firstCharSpace: boolean, lastCharSpace: boolean})
  **
  ** controleer of er een lege regel voor komt met alleen een spatie (kan wanneer er "spatie<i></i>"" bijvoorbeeld als basis stond.)
  **
  ** wrap tekst (totale regel is lineRFS[], met per onderdeel een opmaakwijziging.)
  ** - controleer eerst of het woord uit het opmaakdeel in lineRFS[] compleet is (opmaakdeel eindigd met spatie.)
  **   --> zo niet berekend hoeveel lengte je nog extra nodig hebt voor het laatste woord compleet te maken.
  ** - splits het opmaakdeel in losse regels, rekening houden met --> wrapLineRFS[]
  **     - hoeveel ruimte er nog is op de huidige regel (remainingWidth)
  **     - de lengte van een hele regel (maxWidth)
  **     - hoeveel ruimte het laatste woord nog extra nodig heeft. (lastWordAddLength)
  ** - eerste lineRFS[0] wordt altjd op nieuwe regel begonnen, andere niet
  **
  ** - voeg gevonden regels toe aan output svg segmenten --> allLines[]
  ***      - bij 1e (wrapLineRFS[0]) (& bij array.lengte=1):
  ***          controleer of deze op huidige regel pas of op nieuwe begint en bereken overblijvende ruimte op de regel.
  ***           --> voeg toe aan allLines[].push({ text, class, newLine: boolean })
  ***      - bij laatste (wrapLineRFS[Laatste] & [1 tot laatste-1])
  ***          --> bij laatste bereken overblijvende lengte en voeg toe aan allLines[].push({ text, class, newLine: true })
  ***      - tussenliggende (wrapLineRFS[1 tot laatste-1])
  ***          --> voeg toe aan allLines[].push({ text, class, newLine: true })
  *
  * Bij een lege regel, voeg deze toe met 2 spaties als tekst (anders niet weergegeven)
  *   (wel controle op aanwezigheidn van opmaak onderdelen, deze eerst verwijderd <..> --> '')
  *   --> allLines[].push({ text = '', class = null, newLine: true })
  *
  * Na alle lines[] gehad te hebben geef allLines[] retour
  */
  const allLines = []

  // start format
  let bold = false
  let italic = false
  let underline = false
  let sup = false
  let small = false

  for (let i = 0; i < lines.length; i++) {
    // split main line into different formatting pieces
    const linePieces = lines[i].trimEnd().split(/<(?=b>|\/b>|i>|\/i>|u>|\/u>|sup>|\/sup>|small>|\/small>)/) // /<(?=([biuspmal/]*?)>)/) // '<')
    const lineRFS = [] // line pieces Result Format Segments
    // get format change
    linePieces.forEach(linePiece => {
      let linePieceText = ''
      switch (true) {
        case linePiece.startsWith('b>'):
          bold = true
          linePieceText = linePiece.slice(2)
          break
        case linePiece.startsWith('/b>'):
          bold = false
          linePieceText = linePiece.slice(3)
          break
        case linePiece.startsWith('i>'):
          italic = true
          linePieceText = linePiece.slice(2)
          break
        case linePiece.startsWith('/i>'):
          italic = false
          linePieceText = linePiece.slice(3)
          break
        case linePiece.startsWith('u>'):
          underline = true
          linePieceText = linePiece.slice(2)
          break
        case linePiece.startsWith('/u>'):
          underline = false
          linePieceText = linePiece.slice(3)
          break
        case linePiece.startsWith('sup>'):
          sup = true
          linePieceText = linePiece.slice(4)
          break
        case linePiece.startsWith('/sup>'):
          sup = false
          linePieceText = linePiece.slice(5)
          break
        case linePiece.startsWith('small>'):
          small = true
          linePieceText = linePiece.slice(6)
          break
        case linePiece.startsWith('/small>'):
          small = false
          linePieceText = linePiece.slice(7)
          break
        default:
          linePieceText = linePiece
      }
      // check if text or loop bij second format change
      if (linePieceText.length > 0) {
        linePieceText = linePieceText.replace(/&nbsp;/g, ' ')
        // tspan class
        let resultClass = bold ? ' bold' : ''
        resultClass += italic ? ' italic' : ''
        resultClass += underline ? ' underline' : ''
        resultClass += sup ? ' sup' : ''
        resultClass += small ? ' small' : ''
        // getTextWidth font & space
        let font = italic ? 'italic ' : ''
        font += bold ? 'bold ' : fontBold ? `${fontBold} ` : ''
        font += sup ? `${fontSizeSup} ` : small ? `${fontSizeSmall} ` : `${fontSize} `
        font += fonttype
        // line pieces Result Format Segments
        lineRFS.push({
          text: linePieceText,
          class: resultClass.length ? resultClass.slice(1) : null,
          font,
          letterSpacing,
          firstCharSpace: linePieceText.startsWith(' '),
          lastCharSpace: linePieceText.endsWith(' ')
        })
      }
    })

    // empty lines add
    if (lineRFS.length === 0) { // || (lineRFS.length === 1 && lineRFS[0]?.text === ' ')) {
      allLines.push({ text: '  ', class: null, newLine: true })
      continue // for lines[n]
    }

    // wrapText
    let remainingWidth = maxWidth
    let firstlinePiece = true

    for (let n = 0; n < lineRFS.length; n++) {
      // check last word complete or with section in other style
      let lastWordAddLength = 0
      if (!lineRFS[n].lastCharSpace) {
        for (let m = n + 1; m < lineRFS.length; m++) {
          if (lineRFS[m].firstCharSpace) break
          const remainingWords = lineRFS[m].text.split(' ')
          lastWordAddLength += getTextWidth(remainingWords[0], lineRFS[m].font, lineRFS[m].letterSpacing)
          if (remainingWords[0].length !== lineRFS[m].text.length) break
        }
      }

      const wrapLineRFS = wrapText(lineRFS[n].text, remainingWidth, maxWidth, lastWordAddLength, lineRFS[n].font, lineRFS[n].letterSpacing)

      for (let j = 0; j < wrapLineRFS.length; j++) {
        switch (true) {
          case (j === 0):
            // eslint-disable-next-line
            const pieceWidth = getTextWidth(wrapLineRFS[j], lineRFS[n].font, lineRFS[n].letterSpacing)
            switch (true) {
              case (wrapLineRFS.length === 1 && pieceWidth + lastWordAddLength > remainingWidth):
              case (pieceWidth > remainingWidth):
                firstlinePiece = true
                remainingWidth = maxWidth - pieceWidth
                break
              default:
                remainingWidth = remainingWidth - pieceWidth
            }
            allLines.push({ text: wrapLineRFS[j], class: lineRFS[n].class, newLine: firstlinePiece })
            break
          case (j + 1 === wrapLineRFS.length):
            remainingWidth = maxWidth - getTextWidth(wrapLineRFS[j], lineRFS[n].font, lineRFS[n].letterSpacing)
            // eslint-disable-next-line
          default:
            allLines.push({ text: wrapLineRFS[j], class: lineRFS[n].class, newLine: true })
        }
      }

      firstlinePiece = false
    }
  }
  return allLines
}
