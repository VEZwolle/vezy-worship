// https://github.com/tnwinc/htmldiff.js (MIT) --> https://gist.github.com/KPChakravarthy/8a2fcddfa11f29ddb9cc557a87449aaa
// https://javascript.plainenglish.io/content-diff-view-in-vanilla-javascript-105a00abd7ce

class Match {
  constructor (startInFirst1, startInChanged1, length1) {
    this.startInFirst = startInFirst1
    this.startInChanged = startInChanged1
    this.length = length1
    this.endInFirst = this.startInFirst + this.length - 1
    this.endInChanged = this.startInChanged + this.length - 1
  }
}

// html to array of: <tag> | word | space(s)
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
        } else if (/[\w#@]+/i.test(char)) { // word, # of @ //was: /[\w\#@]+/i
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
  return words
}

function findMatch (firstTokens, changedTokens, indexOfFirstLocationsInChangedTokens, startInFirst, endInFirst, startInChanged, endInChanged) {
  let match
  let bestMatchInFirst = startInFirst
  let bestMatchInChanged = startInChanged
  let bestMatchLength = 0
  let matchLengthAt = {}
  let indexInFirst, i, ref, ref1
  for (
    indexInFirst = i = ref = startInFirst, ref1 = endInFirst;
    ref <= ref1 ? i < ref1 : i > ref1;
    indexInFirst = ref <= ref1 ? ++i : --i
  ) {
    const newMatchLengthAt = {}
    const lookingfor = firstTokens[indexInFirst]
    const locationsInChanged = indexOfFirstLocationsInChangedTokens[lookingfor]
    for (let j = 0; j < locationsInChanged.length; j++) {
      const indexInChanged = locationsInChanged[j]
      if (indexInChanged < startInChanged) { continue }
      if (indexInChanged >= endInChanged) { break }
      if (matchLengthAt[indexInChanged - 1] == null) { matchLengthAt[indexInChanged - 1] = 0 }
      const newMatchLength = matchLengthAt[indexInChanged - 1] + 1
      newMatchLengthAt[indexInChanged] = newMatchLength
      if (newMatchLength > bestMatchLength) {
        bestMatchInFirst = indexInFirst - newMatchLength + 1
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

function recursivelyfindMatchingBlocks (firstTokens, changedTokens, indexOfFirstLocationsInChangedTokens, startInFirst, endInFirst, startInChanged, endInChanged, matchingBlocks) {
  const match = findMatch(firstTokens, changedTokens, indexOfFirstLocationsInChangedTokens, startInFirst, endInFirst, startInChanged, endInChanged)
  if (match != null) {
    if (startInFirst < match.startInFirst && startInChanged < match.startInChanged) {
      recursivelyfindMatchingBlocks(firstTokens, changedTokens, indexOfFirstLocationsInChangedTokens, startInFirst, match.startInFirst, startInChanged, match.startInChanged, matchingBlocks)
    }
    matchingBlocks.push(match)
    if (match.endInFirst <= endInFirst && match.endInChanged <= endInChanged) {
      recursivelyfindMatchingBlocks(firstTokens, changedTokens, indexOfFirstLocationsInChangedTokens, match.endInFirst + 1, endInFirst, match.endInChanged + 1, endInChanged, matchingBlocks)
    }
  }
  return matchingBlocks
}

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

function findMatchingBlocks (firstTokens, changedTokens) {
  const indexOfFirstLocationsInChangedTokens = createIndex({ findThese: firstTokens, inThese: changedTokens })
  return recursivelyfindMatchingBlocks(firstTokens, changedTokens, indexOfFirstLocationsInChangedTokens, 0, firstTokens.length, 0, changedTokens.length, [])
}

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
  let i, index
  for (index = i = 0; i < matches.length; index = ++i) {
    const match = matches[index]
    const actionUpToMatchPositions = actionMap[[positionInFirst === match.startInFirst, positionInChanged === match.startInChanged].toString()]
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

function consecutiveWhere (start, content, tag) {
  console.log(`start: ${start} | content: ${content} | predicate: ${tag}`)
  content = content.slice(start, +content.length + 1 || 9e9)
  let lastMatchingIndex = void 0
  let i, index
  for (index = i = 0; i < content.length; index = ++i) {
    const answer = tag ? isTag(content[index]) : isNoTag(content[index])
    if (answer === true) { lastMatchingIndex = index }
    if (answer === false) { break }
  }
  if (lastMatchingIndex != null) { return content.slice(0, +lastMatchingIndex + 1 || 9e9) }
  return []
}

function isTag (token) { return /^\s*<[^>]+>\s*$/.test(token) }
function isNoTag (token) { return !isTag(token) }

// return <tag>..content..</tag>
function wrap (tag, content) {
  console.log(`tag: ${tag} | content: ${content}`)
  let nonTags, tags
  let rendering = ''
  let position = 0
  const length = content.length
  while (true) {
    if (position >= length) { break }
    nonTags = consecutiveWhere(position, content, false)
    position += nonTags.length
    if (nonTags.length !== 0) { rendering += `<${tag}>${nonTags.join('')}</${tag}>` }
    if (position >= length) { break }
    tags = consecutiveWhere(position, content, true)
    position += tags.length
    rendering += tags.join('')
  }
  console.log(`rendering: ${rendering}`)
  return rendering
}

function opMap (action, op, firstTokens, changedTokens) {
  switch (action) {
    case 'equal': return firstTokens.slice(op.startInFirst, +op.endInFirst + 1 || 9e9).join('')
    case 'insert': return wrap('ins', changedTokens.slice(op.startInChanged, +op.endInChanged + 1 || 9e9))
    case 'delete': return wrap('del', firstTokens.slice(op.startInFirst, +op.endInFirst + 1 || 9e9))
    case 'replace': return (opMap('insert', op, firstTokens, changedTokens) + opMap('delete', op, firstTokens, changedTokens))
    default: return ''
  }
}

function renderOperations (firstTokens, changedTokens, operations) {
  let rendering = ''
  for (let i = 0; i < operations.length; i++) {
    const op = operations[i]
    rendering += opMap(op.action, op, firstTokens, changedTokens)
  }
  return rendering
}

// Invoked like so => let output = HtmlDiff(originalHTML, changedHTML)
export function HtmlDiff (first, changed) {
  console.log(`first: ${first}`)
  console.log(`changed: ${changed}`)
  if (first === changed) { return first } // equal

  // text to array of <tag> | word | space(s)
  first = htmlToTokens(first)
  changed = htmlToTokens(changed)
  console.log(first)
  console.log(changed)

  // calculate match, insert, delete positions
  const ops = calculateOperations(first, changed)
  console.log(ops)
  // add tag <ins><del> to output
  return renderOperations(first, changed, ops)
}
