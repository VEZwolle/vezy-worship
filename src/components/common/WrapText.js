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

export function wrapTextLinesFormat (lines, maxWidth, fonttype, fontSize, fontSizeSup, fontSizeSmall, fontBold, letterSpacing, maxLineCount = 10000) {
  // lineRFS.push({text: string, class: string, font, letterSpacing, firstCharSpace: boolean, lastCharSpace: boolean })
  // allLines.push({ text: string, class: sting, newLine: boolean, line: integer })

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
  const allBeamerSections = []
  let allLines = []

  // opsplitsen: uitgaande van plain text & \n
  // - voor regelstart voor max tekens '\n' --> bij 1e in en toets op single line zodat niet bij elke regeleinde gesplitst wordt
  // - voor sentenceEndChars1 voor max tekens '\n.?!’”\'";'
  // - voor sentenceEndChars2 voor max tekens ',:'
  // - voor willekeurig teken voor max tekens .
  // const regex = new RegExp(`.{1,}[\n.?!’”\'";]|.{1,}[,:]|.{1,}.`, 'gs')
  const sentenceEndChars1 = '\n.?!’”\'";)'
  const sentenceEndChars2 = ',:'
  const regexB = new RegExp(`.{1,}[${sentenceEndChars1}]|.{1,}[${sentenceEndChars2}]|.{1,}.`, 'gs')
  
  // start format
  let bold = false
  let italic = false
  let underline = false
  let sup = false
  let small = false

  for (let i = 0; i < lines.length; i++) {
    // split main line into different formatting pieces
    const linePieces = lines[i].trimEnd().split(/<(?=b>|\/b>|i>|\/i>|u>|\/u>|sup>|\/sup>|small>|\/small>)/) // /<(?=([biuspmal/]*?)>)/) // '<')
    let lineRFS = [] // line pieces Result Format Segments
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
        linePieceText = linePieceText
          .replace(/&nbsp;/g, ' ')
          .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') // html-entities
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
      allLines.push({ text: '  ', class: null, newLine: true, line: i })
      continue // for lines[n]
    }

    // wrapText
    let remainingWidth = maxWidth
    let firstlinePiece = true

    for (let n = 0; n < lineRFS.length; n++) {
      // check last word complete or with section in other style
      let lastWordAddLength = 0
      if (!lineRFS[n].lastCharSpace) { //geen spatie aan het einde laatste woord vorige opmaak, mogelijk loopt woord verder met andere opmaak,
        for (let m = n + 1; m < lineRFS.length; m++) {
          if (lineRFS[m].firstCharSpace) break // spatie aan begin --> is nieuw woord
          const remainingWords = lineRFS[m].text.split(' ') // verschillende woorden opsplitsen
          lastWordAddLength += getTextWidth(remainingWords[0], lineRFS[m].font, lineRFS[m].letterSpacing) // voeg lengte tekens aan woord toe
          if (remainingWords[0].length !== lineRFS[m].text.length) break // wanneer 1e woord niet gelijk lengte totale opmaak regel --> meerdere woorden --> stop
        }
      }

      // splits opmaak regel naar meerdere regels, rekening houdend met beschikbare lengte op 1 regel en extra lengte voor laatste woord.
      const wrapLineRFS = wrapText(lineRFS[n].text, remainingWidth, maxWidth, lastWordAddLength, lineRFS[n].font, lineRFS[n].letterSpacing)

      // voeg regels toe aan totaal
      for (let j = 0; j < wrapLineRFS.length; j++) {
        switch (true) {
          case (j === 0):
            // voor eerste regel check of nog bij huidige bij bast of op nieuwe regel begint.
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
            allLines.push({ text: wrapLineRFS[j], class: lineRFS[n].class, newLine: firstlinePiece, line: i })
            break
            // voor laatste regel, bepaal resterende lengte op de regels.
          case (j + 1 === wrapLineRFS.length):
            remainingWidth = maxWidth - getTextWidth(wrapLineRFS[j], lineRFS[n].font, lineRFS[n].letterSpacing)
            // voor alle andere regels voeg regels dan 1e toe als nieuwe regel.
            // eslint-disable-next-line
          default:
            allLines.push({ text: wrapLineRFS[j], class: lineRFS[n].class, newLine: true, line: i })
        }
      }

      firstlinePiece = false

      // check if count allLines.newLine > maximaal op pagina --> dan netjes opsplitsen
      let countNewLines = allLines.reduce((count, allLine) => count + (allLine.newLine === true), 0) // count
      while (countNewLines > maxLineCount) { // er moet opgesplitst worden.
        // voor nu hier geen reset opmaak gedaan, als het goed is staan deze al allemaal op false aan einde van de line:i
        // nog wel checken
        let plainText = ''
        let countLines = 0
        let indexW = 0
        let iLine = allLines[0].line
        // get plaintext of lines
        while (countLines <= maxLineCount) {
          if (allLines[indexW].newLine) {
            // extra spatie als begin niet heeft en einde vorige ook niet
            if (indexW) {
              if (!allLines[indexW].text.startsWith(' ') && !allLines[indexW - 1].text.endsWith(' ')) {
                allLines[indexW - 1].text += ' '
                plainText += ' '
              }
            }
            countLines++
            if (countLines > maxLineCount) break
          }
          if (allLines[indexW].line !== iLine) {
            plainText += '\n'
            iLine = allLines[indexW].line
          }
          plainText += allLines[indexW].text
          indexW++
        }
        // zoek een net einde.
        let allLineSections = plainText.match(regexB)
        if (allLineSections[0] === plainText) {
          // huidige einde blijft gelijk.
          allBeamerSections.push({ formats: allLines.splice(0, indexW), plainText: allLineSections[0] }) // voeg indexW objecten toe aan push en verwijder uit array.
          countNewLines -= maxLineCount
          continue
        }
        // ander dan huidig einde;
        const allLinesTemp = []
        iLine = allLines[0].line
        let plainTextLeftLenght = allLineSections[0].length
        let k = 0
        while (plainTextLeftLenght > 0) {
          if (allLines[k].line !== iLine) { // nieuwe user inputline
            plainTextLeftLenght -= '\n'.length
            iLine = allLines[k].line
          }
          if (allLines[k].text.length < plainTextLeftLenght) {
            // past geheel
            allLinesTemp.push(allLines[k])
            plainTextLeftLenght -= allLines[k].text.length
            k++
          } else {
            // past niet geheel meer
            allLinesTemp.push({ text: allLines[k].text.slice(0, plainTextLeftLenght), class: allLines[k].class, newLine: allLines[k].newLine, line: allLines[k].line })
            allLines[k].text = allLines[k].text.slice(plainTextLeftLenght)
            if (!allLines[k].text.length) k++ // wanneer leeg regel negeren verder;
            if (allLines[k].text === ' ') k++ // wanneer spatie negeren verder; volgende is toch nieuwe section (geen combinatie met volgende regel in livestream door ander section).
            allLines.splice(0, k)
            plainTextLeftLenght = 0
            allBeamerSections.push({ formats: allLinesTemp, plainText: allLineSections[0] })
            // rest allLines heeft geen juiste regeleinden meer... zet terug naar lineRFS
            remainingWidth = maxWidth
            firstlinePiece = true
            const lineRFStemp = []
            let endSpace = false
            if (allLines[0].line !== i) { // niet afgebroken in laatste line.
              // <--> kan dit wel voorkomen? nieuwe line i gebeurt alleen bij regeleinde <br> en dat kan nooit meer dan 1 i verder zijn en die blijft dan geheel voor volgende sheet of een deel.
              i = allLines[0].line // 'start opnieuw na i, resterend van i nog laten lopen
              endSpace = !(allLines.filter((allLine) => allLine.line === i+1)[1]?.startsWith(' '))
              allLines = allLines.filter((allLine) => allLine.line === i)
              lineRFS = []
              const iClassEnd = allLines[length-1]?.class
              bold = iClassEnd?.includes('bold') ? true : false
              italic = iClassEnd?.includes('italic') ? true : false
              underline = iClassEnd?.includes('underline') ? true : false
              sup = iClassEnd?.includes('sup') ? true : false
              small = iClassEnd?.includes('small') ? true : false
              // <-->
            } else {
              endSpace = lineRFS[n].endSpace
              lineRFS.splice(0, n + 1) // verwijder gereed zijde pagina (deel) van huidige line
            }
            // hier nog spaties toeveoegen, 1e geen op nieuwe pagina, laatste 'endSpace'
            for (let indexF = 0; indexF < allLines.length; indexF++) {
              // getTextWidth font & space
              let font = allLines[indexF].class?.includes('italic') ? 'italic ' : ''
              font += allLines[indexF].class?.includes('bold') ? 'bold ' : fontBold ? `${fontBold} ` : ''
              font += allLines[indexF].class?.includes('sup') ? `${fontSizeSup} ` : allLines[indexF].class?.includes('small') ? `${fontSizeSmall} ` : `${fontSize} `
              font += fonttype
              if (indexF === 0) { // start spatie op nieuwe extra pagina verwijderen.
                allLines[indexF].text = allLines[indexF].text.replace(/^ /g, '')
              }
              // add spaces
              if (indexF === allLines.length - 1) {
                if ( !allLines[indexF].text.endsWith(' ') && endSpace) {
                  allLines[indexF].text += ' '
                }
              } else {
                if (allLines[indexF+1].newLine) {
                // extra spatie als begin niet heeft en einde vorige ook niet
                  if (!allLines[indexF+1].text.startsWith(' ') && !allLines[indexF].text.endsWith(' ')) {
                    allLines[indexF].text += ' '
                  }
                }
              }
              //allLines[i] to lineRFS
              lineRFStemp.push({
                text: allLines[indexF].text,
                class: allLines[indexF].class,
                font,
                letterSpacing,
                firstCharSpace: allLines[indexF].text.startsWith(' '),
                lastCharSpace: allLines[indexF].text.endsWith(' ')
              })
            }
            allLines = []
            countNewLines = 0
            lineRFS = lineRFStemp.concat(lineRFS)
            n = -1
          }
        }
      }
    }
  }

  if (allLines.length) {
    let plainText = ''
    let iLine = allLines[0].line
    for (let indexE = 0; indexE < allLines.length; indexE++) {
      if (indexE && allLines[indexE].newLine) {
        // extra spatie als begin niet heeft en einde vorige ook niet
        if (!allLines[indexE].text.startsWith(' ') && !allLines[indexE - 1].text.endsWith(' ')) {
          allLines[indexE - 1].text += ' '
          plainText += ' '
        }
      }
      if (allLines[indexE].line !== iLine) {
        plainText += '\n'
        iLine = allLines[indexE].line
      }
      plainText += allLines[indexE].text
    }
    allBeamerSections.push({ formats: allLines, plainText: plainText })
  }
  
  return allBeamerSections
}
