import { CleanText } from '../components/common/CleanText.js'

export function versionUpdate (service) {
  let version = 0
  if (service.version !== undefined) {
    const versionSpit = service.version.split(/[.-]/)
    version = Number(versionSpit[0]) + Number(versionSpit[1]) / 100 + Number(versionSpit[2]) / 10000
  }
  switch (true) {
    case version === 0 : // tm versie 1.5.0-beta "no version"
      service.presentations.forEach(presentation => {
        switch (presentation.type) {
          case 'song':
            presentation.settings.bgOpacity = presentation.settings.bgOpacity || 0
            presentation.settings.bgFileId = presentation.settings.bgFileId || presentation.settings.fileId || null
            break
          case 'caption':
            presentation.settings.bgOpacity = presentation.settings.bgOpacity || 0
            presentation.settings.bgFileId = presentation.settings.bgFileId || null
            presentation.settings.formatBeamer = presentation.settings.formatBeamer || 'Geen'
            presentation.settings.formatLivestream = presentation.settings.formatLivestream || 'Standaard'
            break
          case 'scripture':
            presentation.settings.bgOpacity = presentation.settings.bgOpacity || 0
            presentation.settings.bgFileId = presentation.settings.bgFileId || null
            presentation.settings.title = ''
            break
          case 'image':
          case 'countdown':
            presentation.settings.bgOpacity = presentation.settings.bgOpacity || 0
            presentation.settings.bgFileId = presentation.settings.bgFileId || null
            break
          case 'video':
            presentation.settings.bgOpacity = presentation.settings.bgOpacity || 0
            presentation.settings.bgFileId = presentation.settings.bgFileId || null
            presentation.settings.startTime = presentation.settings.startTime || 0
            presentation.settings.endTime = presentation.settings.endTime || -1
            break
          default:
        }
      })
      service.pcoId = ''
      // eslint-disable-next-line
    case version <= 1.0602: // 1.6.2-beta first version white number
    case version <= 1.0603:
    case version <= 1.0700:
      service.presentations.forEach(presentation => {
        switch (presentation.type) {
          case 'caption':
          case 'scripture': {
            presentation.settings.text = CleanText(presentation.settings.text)
            break
          }
          default:
        }
      })
      // eslint-disable-next-line
    case version < 1.0800:
      service.presentations.forEach(presentation => {
        switch (presentation.type) {
          case 'song': {
            presentation.settings.collection = presentation.settings.collection || ''
            presentation.settings.number = presentation.settings.number || ''
            if (presentation.settings.noSplitLines === undefined) presentation.settings.noSplitLines = false
            break
          }
          default:
        }
      })
      // eslint-disable-next-line
    default: // no changes
      // console.log(`version file: ${version}`)
      break
  }
  return service
}
