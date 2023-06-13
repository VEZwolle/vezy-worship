export function getTextWidth (text, font, letterSpacing) {
  const context = document.createElement('canvas').getContext('2d')
  context.font = font
  context.letterSpacing = letterSpacing
  return context.measureText(text).width
}

export function wrapText (text, maxWidth, font, letterSpacing) {
  if (getTextWidth(text, font, letterSpacing) <= maxWidth) return [text]

  const words = text.split(' ')
  const completedLines = []
  let nextLine = ''

  words.forEach((word, index) => {
    const wordLength = getTextWidth(`${word} `, font, letterSpacing)
    const nextLineLength = getTextWidth(nextLine, font, letterSpacing)

    switch (true) {
      case (wordLength > maxWidth):
        completedLines.push(nextLine)
        completedLines.push(word) // don't break the word when don't fit
        nextLine = ''
        break
      case (nextLineLength + wordLength >= maxWidth):
        completedLines.push(nextLine)
        nextLine = word
        break
      default:
        nextLine = [nextLine, word].filter(Boolean).join(' ')
    }

    if (index + 1 === words.length) completedLines.push(nextLine)
  })

  return completedLines.filter(line => line !== '')
}

export function wrapTextLines (lines, maxWith, font, letterSpacing) {
  const allLines = []
  lines.forEach(line => {
    const wrapLines = wrapText(line, maxWith, font, letterSpacing)
    wrapLines.forEach(wrapLine => {
      allLines.push(wrapLine)
    })
  })
  return allLines
}
