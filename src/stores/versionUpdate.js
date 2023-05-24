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
            presentation.settings.bgFileId = presentation.settings.bgFileId || presentation.settings.fileId || null
            presentation.settings.bgOpacity = presentation.settings.bgOpacity || 0
            break
          case 'caption':
            presentation.settings.formatBeamer = presentation.settings.formatBeamer || 'Geen'
            presentation.settings.formatLivestream = presentation.settings.formatLivestream || 'Standaard'
            // eslint-disable-next-line
          case 'image':
          case 'video':
          case 'countdown':
          case 'scripture':
            presentation.settings.bgOpacity = presentation.settings.bgOpacity || 0
            presentation.settings.bgFileId = presentation.settings.bgFileId || null
            break
          default:
        }
      })
      service.pcoId = ''
      service.presentations.forEach(presentation => {
        if (presentation.type === 'video') {
          presentation.settings.startTime = presentation.settings.startTime || 0
          presentation.settings.endTime = presentation.settings.endTime || -1
        }
      })
      // eslint-disable-next-line
    case version <= 1.0602: // 1.6.2-beta first version white number
    default: // no changes
      // console.log(`version file: ${version}`)
      break
  }
  return service
}
