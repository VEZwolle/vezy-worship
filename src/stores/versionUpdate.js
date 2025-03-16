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
    case version < 1.0901:
      service.presentations.forEach(presentation => {
        switch (presentation.type) {
          case 'video': {
            presentation.settings.noLivestream = presentation.settings.noLivestream || false
            break
          }
          default:
        }
      })
      // eslint-disable-next-line
    case version <= 1.0902:
      service.presentations.forEach(presentation => {
        switch (presentation.type) {
          case 'caption': {
            presentation.settings.text = CleanText(presentation.settings.text)
            presentation.settings.maxLivestreamChar = 1000
            break
          }
          case 'scripture': {
            presentation.settings.text = CleanText(presentation.settings.text)
            presentation.settings.formatBeamer = 'Bijbeltekst'
            presentation.settings.formatLivestream = 'Breed'
            presentation.settings.maxLivestreamChar = 350
            break
          }
          default:
        }
      })
      // eslint-disable-next-line
    case version < 1.0909:
      service.presentations.forEach(presentation => {
        switch (presentation.type) {
          case 'countdown': {
            presentation.settings.position = 'RO'
            break
          }
          default:
        }
      })
      // eslint-disable-next-line
      case version < 2.0103 :
      service.presentations.forEach(presentation => {
        if (!presentation.settings.osc) presentation.settings.osc = {}
        if (!presentation.settings.osc.clip) presentation.settings.osc.clip = null
        switch (presentation.type) {
          case 'song':
            if (!presentation.settings.osc.text) presentation.settings.osc.text = null
              if (!presentation.settings.osc.translation) presentation.settings.osc.translation = null
            break
          case 'caption':
          case 'scripture':
            if (!presentation.settings.osc.text) presentation.settings.osc.text = null
              if (!presentation.settings.osc.title) presentation.settings.osc.title = null
            break
          case 'countdown':
            if (!presentation.settings.osc.text) presentation.settings.osc.text = null
            break
          case 'image':
          case 'video':
            if (!presentation.settings.osc.resolumePlayPauzeSync) presentation.settings.osc.resolumePlayPauzeSync = '0'
            break
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
