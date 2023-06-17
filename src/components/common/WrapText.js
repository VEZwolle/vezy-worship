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

export function wrapTextLinesFormat (lines, maxWidth, fonttype, fontSize, fontSizeSup, letterSpacing) {
  const allLines = []

  // start format
  let bold = false
  let italic = false
  let underline = false
  let sup = false

  for (let i = 0; i < lines.length; i++) {
    // split main line into different formatting pieces
    const linePieces = lines[i].trimEnd().split('<')
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
        // getTextWidth font & space
        let font = italic ? 'italic ' : ''
        font += bold ? 'bold ' : ''
        font += sup ? `${fontSizeSup} ` : `${fontSize} `
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
              case (j + 1 === wrapLineRFS.length && pieceWidth + lastWordAddLength > remainingWidth):
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
