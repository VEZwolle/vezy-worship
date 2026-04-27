/*
Get/Set cursor position of contentEditable element with linebreaks
* Base: https://stackoverflow.com/questions/46434775/accounting-for-brs-in-contenteditable-caret-position
* Combi with Quasar caret of editor
* add linechar --> line always start with node <div> (after clean editor)
* -----------------
* not used in VezyEditorSong --> commented off.
* getCaret(el) / setCaret(el, start, end) --> Use index of node + char offset last node
* -----------------
* used:
* getCaretLine(el) / setCaretLine(el, start, end) --> Use index of first node + total char offset of that node [calculate between child nodes]
* -----------------
*/

function pathFromNode (node, reference) {
  function traverse (node, acc) {
    if (node === reference) {
      return acc
    } else {
      const parent = node.parentNode
      const index = [...parent.childNodes].indexOf(node)
      return traverse(parent, [index, ...acc])
    }
  }
  return traverse(node, [])
}

// not used in VezyEditorSong via setCaret
/*
function nodeFromPath (path, reference) {
  if (path.length === 0) {
    return reference
  } else {
    const [index, ...rest] = path
    const next = reference.childNodes[index]
    return nodeFromPath(rest, next)
  }
}
*/

// not used in VezyEditorSong
/*
export function getCaret (el) {
  if (el) {
    const selection = document.getSelection()
    // only when the selection in element
    if (isChildOf(selection.anchorNode, el, true) && isChildOf(selection.focusNode, el, true)) {
      const range = document.getSelection().getRangeAt(0)
      return {
        start: {
          container: pathFromNode(range.startContainer, el),
          offset: range.startOffset
        },
        end: {
          container: pathFromNode(range.endContainer, el),
          offset: range.endOffset
        }
      }
    }
  }
  return null
}
*/

// not used in VezyEditorSong
/*
export function setCaret (el, start, end) {
  if (el) {
    const range = document.createRange()
    range.setStart(nodeFromPath(start.container, el), start.offset)
    range.setEnd(nodeFromPath(end.container, el), end.offset)
    const selection = document.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
  }
}
*/

// Quasar Caret copy
function isChildOf (el, parent, orSame) {
  return !el || el === document.body
    ? false
    : (orSame === true && el === parent) || (parent === document ? document.body : parent).contains(el.parentNode)
}

// Quasar Caret copy
function createRange (node, chars, range) {
  if (!range) {
    range = document.createRange()
    range.selectNode(node)
    range.setStart(node, 0)
  }
  if (chars.count === 0) {
    range.setEnd(node, 0)
  } else if (chars.count > 0) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent.length < chars.count) {
        chars.count -= node.textContent.length
      } else {
        range.setEnd(node, chars.count)
        chars.count = 0
      }
    } else {
      for (let lp = 0; chars.count !== 0 && lp < node.childNodes.length; lp++) {
        range = createRange(node.childNodes[lp], chars, range)
      }
    }
  }

  return range
}

function lineOffsetFirstNode (path, reference, selection, start) {
  if (path.length === 0) {
    return 0
  } else {
    const lineReference = reference.childNodes[path[0]]
    let charCount = -1 // offset
    let node
    const parentEl = lineReference.parentNode
    // Detect if selection is backwards
    const range = document.createRange()
    range.setStart(selection.anchorNode, selection.anchorOffset) // if after setEnd --> setEnd is used --> range.collapsed = true
    range.setEnd(selection.focusNode, selection.focusOffset)
    const direction = range.collapsed ? !start : start // rotate start if backwards
    range.detach()
    // count offset node
    if (direction) {
      if (selection.anchorNode && isChildOf(selection.anchorNode, parentEl)) {
        node = selection.anchorNode
        charCount = selection.anchorOffset
      }
    } else {
      if (selection.focusNode && isChildOf(selection.focusNode, parentEl)) {
        node = selection.focusNode
        charCount = selection.focusOffset
      }
    }
    // count nodes before
    if (charCount > -1) {
      while (node && node !== parentEl) {
        if (node !== lineReference && node.previousSibling) {
          node = node.previousSibling
          charCount += node.textContent.length
        } else {
          node = node.parentNode
        }
      }
    }
    // return:
    // = -1 => error/not found
    // > -1 => offset
    return charCount
  }
}

function RangeEndFromFirstNodeLineOffset (path, reference, lineOffset) {
  if (path.length === 0) {
    return -1
  } else {
    const nextReference = reference.childNodes[path[0]]
    return createRange(nextReference, { count: lineOffset })
  }
}

export function getCaretLine (el) {
  if (el) {
    const selection = document.getSelection()
    // only when the selection in element
    if (isChildOf(selection.anchorNode, el, true) && isChildOf(selection.focusNode, el, true)) {
      const range = selection.getRangeAt(0)
      const startContainer = pathFromNode(range.startContainer, el)
      const endContainer = range.collapsed ? startContainer : pathFromNode(range.endContainer, el)
      return {
        start: {
          container: startContainer,
          lineOffset: lineOffsetFirstNode(startContainer, el, selection, true)
        },
        end: {
          container: endContainer,
          lineOffset: lineOffsetFirstNode(endContainer, el, selection, false)
        }
      }
    }
  }
  return null
}

export function setCaretLine (el, start, end) {
  if (el) {
    const range = RangeEndFromFirstNodeLineOffset(end.container, el, end.lineOffset)
    if (start.container === end.container && start.lineOffset === end.lineOffset) {
      range.setStart(range.endContainer, range.endOffset)
    } else {
      const startRange = RangeEndFromFirstNodeLineOffset(start.container, el, start.lineOffset)
      range.setStart(startRange.endContainer, startRange.endOffset)
    }
    const selection = document.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
  }
}
