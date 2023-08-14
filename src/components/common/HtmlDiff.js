// base https://github.com/tnwinc/htmldiff.js (MIT) --> https://gist.github.com/KPChakravarthy/8a2fcddfa11f29ddb9cc557a87449aaa
// explain https://javascript.plainenglish.io/content-diff-view-in-vanilla-javascript-105a00abd7ce

let mark = [] // wijziging opmaak gestart voor tag in lijst

class Match {
  constructor (startInFirst, startInChanged, length) {
    this.startInFirst = startInFirst
    this.startInChanged = startInChanged
    this.length = length
    this.endInFirst = this.startInFirst + this.length - 1
    this.endInChanged = this.startInChanged + this.length - 1
  }
}

/*
* Splitsing tekst in zoek/vergelijk onderdelen
*/
// html to array of: <tag> | word icm # en @ | losse leestekens e.d. | space(s)
function htmlToTokens (html) {
  let mode = 'char'
  let currentWord = ''
  const words = []
  for (let i = 0; i < html.length; i++) {
    const char = html[i]
    switch (mode) {
      case 'tag':
        if (char === '>') {
          // end of tag
          currentWord += '>'
          words.push(currentWord)
          currentWord = ''
          mode = 'char'
        } else {
          currentWord += char
        }
        break
      case 'char':
        if (char === '<') { // start of tag
          if (currentWord) { words.push(currentWord) }
          currentWord = '<'
          mode = 'tag'
        } else if (/\s/.test(char)) { // space
          if (currentWord) { words.push(currentWord) }
          currentWord = char
          mode = 'space'
        } else if (/[\w#@]+/i.test(char)) { // letters, # of @; voor compineren in 1 object
          currentWord += char
        } else {
          if (currentWord) { words.push(currentWord) }
          currentWord = char
        }
        break
      case 'space':
        if (char === '<') { // start of tag
          if (currentWord) { words.push(currentWord) }
          currentWord = '<'
          mode = 'tag'
        } else if (/\s/.test(char)) { // space
          currentWord += char
        } else {
          if (currentWord) { words.push(currentWord) }
          currentWord = char
          mode = 'char'
        }
        break
      default:
        throw new Error(`Unknown mode ${mode}`)
    }
  }
  if (currentWord) { words.push(currentWord) }
  // console.log(words)
  return words
}

/*
* zoek functies overeenkomsten en verschillen
*/

// find overeenkomstige stukken --> output "match class" of undefined
function findMatch (firstTokens, indexOfFirstLocationsInChangedTokens, startInFirst, endInFirst, startInChanged, endInChanged) {
  let match
  let bestMatchInFirst = startInFirst
  let bestMatchInChanged = startInChanged
  let bestMatchLength = 0
  let matchLengthAt = {}
  for (
    let i = startInFirst;
    startInFirst <= endInFirst ? i < endInFirst : i > endInFirst;
    startInFirst <= endInFirst ? ++i : --i
  ) {
    const newMatchLengthAt = {}
    const lookingfor = firstTokens[i]
    const locationsInChanged = indexOfFirstLocationsInChangedTokens[lookingfor]
    for (let j = 0; j < locationsInChanged.length; j++) {
      const indexInChanged = locationsInChanged[j]
      if (indexInChanged < startInChanged) { continue }
      if (indexInChanged >= endInChanged) { break }
      if (matchLengthAt[indexInChanged - 1] == null) { matchLengthAt[indexInChanged - 1] = 0 }
      const newMatchLength = matchLengthAt[indexInChanged - 1] + 1
      newMatchLengthAt[indexInChanged] = newMatchLength
      if (newMatchLength > bestMatchLength) {
        bestMatchInFirst = i - newMatchLength + 1
        bestMatchInChanged = indexInChanged - newMatchLength + 1
        bestMatchLength = newMatchLength
      }
    }
    matchLengthAt = newMatchLengthAt
  }
  if (bestMatchLength !== 0) {
    match = new Match(
      bestMatchInFirst,
      bestMatchInChanged,
      bestMatchLength
    )
  }
  return match
}

// array (class match) van gevonden gelijke blokken
function repeatingFindMatchingBlocks (firstTokens, indexOfFirstLocationsInChangedTokens, startInFirst, endInFirst, startInChanged, endInChanged, matchingBlocks) {
  const match = findMatch(firstTokens, indexOfFirstLocationsInChangedTokens, startInFirst, endInFirst, startInChanged, endInChanged)
  if (match) {
    if (startInFirst < match.startInFirst && startInChanged < match.startInChanged) {
      repeatingFindMatchingBlocks(firstTokens, indexOfFirstLocationsInChangedTokens, startInFirst, match.startInFirst, startInChanged, match.startInChanged, matchingBlocks)
    }
    matchingBlocks.push(match)
    if (match.endInFirst <= endInFirst && match.endInChanged <= endInChanged) {
      repeatingFindMatchingBlocks(firstTokens, indexOfFirstLocationsInChangedTokens, match.endInFirst + 1, endInFirst, match.endInChanged + 1, endInChanged, matchingBlocks)
    }
  }
  return matchingBlocks
}

// array van verschillende onderdelen met de posites waar deze voorkomen in array "htmlToTokens"
function createIndex (p) {
  if (p.findThese == null) { throw new Error('params must have findThese key') }
  if (p.inThese == null) { throw new Error('params must have inThese key') }
  const index = {}
  const ref = p.findThese
  for (let i = 0; i < ref.length; i++) {
    const token = ref[i]
    index[token] = []
    let idx = p.inThese.indexOf(token)
    while (idx !== -1) {
      index[token].push(idx)
      idx = p.inThese.indexOf(token, idx + 1)
    }
  }
  return index
}

// array (class match) van gevonden gelijke blokken
function findMatchingBlocks (firstTokens, changedTokens) {
  const indexOfFirstLocationsInChangedTokens = createIndex({ findThese: firstTokens, inThese: changedTokens })
  return repeatingFindMatchingBlocks(firstTokens, indexOfFirstLocationsInChangedTokens, 0, firstTokens.length, 0, changedTokens.length, [])
}

// array met vergelijk uitkomsten equal/insert/delete/replace/none icm posities in array HtmlToToken [undefined voor end welke niet van toepassing bij instert/delete]
function calculateOperations (firstTokens, changedTokens) {
  if (firstTokens == null) { throw new Error('firstTokens?') }
  if (changedTokens == null) { throw new Error('changedTokens?') }
  let positionInFirst = 0
  let positionInChanged = 0
  const operations = []
  const actionMap = {
    'false,false': 'replace',
    'true,false': 'insert',
    'false,true': 'delete',
    'true,true': 'none'
  }
  const matches = findMatchingBlocks(firstTokens, changedTokens)
  matches.push(new Match(firstTokens.length, changedTokens.length, 0))
  for (let i = 0; i < matches.length; ++i) {
    const match = matches[i]
    const actionUpToMatchPositions = actionMap[
      [
        positionInFirst === match.startInFirst,
        positionInChanged === match.startInChanged
      ].toString()
    ]
    if (actionUpToMatchPositions !== 'none') {
      operations.push({
        action: actionUpToMatchPositions,
        startInFirst: positionInFirst,
        endInFirst: actionUpToMatchPositions !== 'insert' ? match.startInFirst - 1 : void 0,
        startInChanged: positionInChanged,
        endInChanged: actionUpToMatchPositions !== 'delete' ? match.startInChanged - 1 : void 0
      })
    }
    if (match.length !== 0) {
      operations.push({
        action: 'equal',
        startInFirst: match.startInFirst,
        endInFirst: match.endInFirst,
        startInChanged: match.startInChanged,
        endInChanged: match.endInChanged
      })
    }
    positionInFirst = match.endInFirst + 1
    positionInChanged = match.endInChanged + 1
  }
  const postProcessed = []
  let lastOp = { action: 'none' }

  function isSingleSpace (op) {
    if (op.action !== 'equal') { return false }
    if (op.endInFirst - op.startInFirst !== 0) { return false }
    return /^\s$/.test(firstTokens.slice(op.startInFirst, +op.endInFirst + 1 || 9e9)) // 9e9 => to end string
  }

  for (let j = 0; j < operations.length; j++) {
    const op = operations[j]
    if ((isSingleSpace(op) && lastOp.action === 'replace') || (op.action === 'replace' && lastOp.action === 'replace')) {
      lastOp.endInFirst = op.endInFirst
      lastOp.endInChanged = op.endInChanged
    } else {
      postProcessed.push(op)
      lastOp = op
    }
  }
  return postProcessed
}

/*
* opmaak functies uitkomst
*/
function isTag (token) { return /^\s*<[^>]+>\s*$/.test(token) }
function isNoTag (token) { return !isTag(token) }

// array van opeenvolgende blokken (binnen/buiten tag)
function consecutiveWhere (start, content, tag) {
  content = content.slice(start, +content.length + 1 || 9e9)
  let lastMatchingIndex = void 0
  for (let i = 0; i < content.length; ++i) {
    const answer = tag ? isTag(content[i]) : isNoTag(content[i])
    if (answer === true) { lastMatchingIndex = i }
    if (answer === false) { break }
  }
  if (lastMatchingIndex != null) { return content.slice(0, +lastMatchingIndex + 1 || 9e9) }
  return []
}

// return <tag>..content..</tag>
function wrap (addTag, content) {
  let nonTags, tags
  let rendering = ''
  let position = 0
  const length = content.length
  while (position < length) {
    // control part that is not a tag?
    nonTags = consecutiveWhere(position, content, false)
    if (nonTags.length !== 0) {
      rendering += `<${addTag}>${nonTags.join('')}</${addTag}>`
    }
    position += nonTags.length
    if (position >= length) { break }
    // control part that is a tag?
    tags = consecutiveWhere(position, content, true)
    if (tags.length !== 0) {
      let markTag
      for (let i = 0; i < tags.length; i++) {
        const endTag = /^\s*<\//.test(tags[i])
        const [tagI] = tags[i].match(/(?<=^\s*<\/*)\w+(?=.*>\s*$)/) || []
        // no tag found, merge and through.
        if (!tagI) {
          rendering += tags[i]
          continue
        }
        // line break has no 2nd tag, close immediately
        if (tagI === 'br') {
          switch (true) {
            case addTag === 'del':
              rendering += `<${addTag}>↲</${addTag}>` // symbol instead of newline
              break
            default: // 'ins'
              rendering += `<${addTag}>↲${tags[i]}</${addTag}>`
          }
          continue
        }
        // another tag
        const markExistIndex = mark.indexOf(tagI)
        if (markExistIndex === -1) {
          markTag = '<mark>'
          mark.push(tagI)
        } else {
          markTag = '</mark>'
          mark.splice(markExistIndex, 1)
        }
        switch (true) {
          case tagI === 'div' && addTag === 'del' && !endTag:
            rendering += `<${addTag}>↲</${addTag}>` // symbol instead of <div>
            break
          case tagI === 'div' && addTag === 'ins' && !endTag:
            rendering += `<${addTag}>↲</${addTag}>${tags[i]}`
            break
          case tagI === 'div' && addTag === 'del' && endTag:
            rendering += `<${addTag}> </${addTag}>` // space instead of </div>
            break
          case tagI === 'div' && addTag === 'ins' && endTag:
            rendering += `<${addTag}> </${addTag}>${tags[i]}`
            break
          case addTag === 'del':
            rendering += markTag
            break
          case addTag === 'ins' && !endTag:
            rendering += markTag + tags[i]
            break
          case addTag === 'ins' && endTag:
            rendering += tags[i] + markTag
            break
          default:
            rendering += tags[i]
        }
      }
    }
    position += tags.length
  }
  return rendering
}

// return output van onderdeel incl. tag <ins>/<del>
function opMap (action, op, firstTokens, changedTokens) {
  switch (action) {
    case 'equal': return firstTokens.slice(op.startInFirst, +op.endInFirst + 1 || 9e9).join('')
    case 'insert': return wrap('ins', changedTokens.slice(op.startInChanged, +op.endInChanged + 1 || 9e9))
    case 'delete': return wrap('del', firstTokens.slice(op.startInFirst, +op.endInFirst + 1 || 9e9))
    case 'replace': return (opMap('insert', op, firstTokens, changedTokens) + opMap('delete', op, firstTokens, changedTokens))
    default: return ''
  }
}

// return totale output incl. tag <ins>/<del>
function renderOperations (firstTokens, changedTokens, operations) {
  let rendering = ''
  mark = []
  for (let i = 0; i < operations.length; i++) {
    const op = operations[i]
    rendering += opMap(op.action, op, firstTokens, changedTokens)
  }
  return rendering
}

// Invoked like so => let output = HtmlDiff(originalHTML, changedHTML)
// output whit <ins><del><mark> tags for insert, delete, style change
export function HtmlDiff (first, changed) {
  if (first === changed) { return first } // equal
  if (!first) { return `<ins>${changed || ''}</ins>` }
  if (!changed) { return `<del>${first}</del>` }

  // text to array of <tag> | word | space(s)
  first = htmlToTokens(first)
  changed = htmlToTokens(changed)
  // calculate match, insert, delete positions
  const ops = calculateOperations(first, changed)
  // add tag <ins><del> to output
  return renderOperations(first, changed, ops)
}
