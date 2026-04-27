const labels = [
  { key: 'intro', color: 'deep-purple' },
  { key: 'introduction', color: 'deep-purple' },
  { key: 'verse', color: 'blue' },
  { key: 'vers', color: 'blue' },
  { key: 'couplet', color: 'blue' },
  { key: 'pre-chorus', color: 'purple' },
  { key: 'chorus', color: 'purple' },
  { key: 'refrein', color: 'purple' },
  { key: 'bridge', color: 'green' },
  { key: 'tag', color: 'deep-purple' },
  { key: 'tussenspel', color: 'deep-purple' },
  { key: 'interlude', color: 'deep-purple' },
  { key: 'misc', color: 'deep-purple' },
  { key: 'ending', color: 'red-10' },
  { key: 'end', color: 'red-10' },
  { key: 'eind', color: 'red-10' },
  { key: 'outro', color: 'red-10' },
  { key: 'slide', color: 'blue' },
  { key: 'vamp', color: 'blue' },
  { key: 'other', color: 'blue' },
  { key: 'scripture', color: 'red-10' }
]

export default labels

export function isLabel (line) {
  for (const label of labels) {
    if (((line?.toLowerCase().startsWith(label.key) && /[\d({[:;/\\|]/.test(line?.toLowerCase())) || line?.toLowerCase() === label.key) === false) {
      continue
    }
    return label
  }
  return false
}
