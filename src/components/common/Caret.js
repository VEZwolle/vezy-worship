/*
Get/Set cursor position of contentEditable element with linebreaks
* https://stackoverflow.com/questions/46434775/accounting-for-brs-in-contenteditable-caret-position
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

function nodeFromPath (path, reference) {
  if (path.length === 0) {
    return reference
  } else {
    const [index, ...rest] = path
    const next = reference.childNodes[index]
    return nodeFromPath(rest, next)
  }
}

export function getCaret (el) {
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

export function setCaret (el, start, end) {
  const range = document.createRange()
  range.setStart(nodeFromPath(start.container, el), start.offset)
  range.setEnd(nodeFromPath(end.container, el), end.offset)
  const selection = document.getSelection()
  selection.removeAllRanges()
  selection.addRange(range)
}
