import * as zip from '@zip.js/zip.js'
import useServiceStore from 'stores/service'
import { Notify } from 'quasar'

const filePickerOptions = {
  types: [{
    description: 'VezyWorship bestand',
    accept: {
      'application/vez': '.vez'
    }
  }],
  excludeAcceptAllOption: true
}

const fs = {
  fileHandle: null,

  async open () {
    const [fileHandle] = await window.showOpenFilePicker(filePickerOptions)
    fs.fileHandle = fileHandle

    const file = await fileHandle.getFile()

    // Read file list from zip
    const zipReader = new zip.ZipReader(new zip.BlobReader(file))
    const entries = await zipReader.getEntries()

    // Load service data from `service.json`
    let service = entries.find(e => e.filename === 'service.json')
    if (!service) {
      Notify.create({ type: 'negative', message: 'Ongeldig VezyWorship bestand' })
      await zipReader.close()
      return
    }

    service = await service.getData(new zip.TextWriter())
    service = JSON.parse(service)

    const store = useServiceStore()

    // Load media into store
    const mediaEntries = entries.filter(e => e.filename !== 'service.json')

    for (const file of mediaEntries) {
      const blob = await file.getData(new zip.BlobWriter())

      store.media[file.filename] = URL.createObjectURL(blob)
    }

    // Add loaded service to store
    store.loadService(service)

    await zipReader.close()
  },

  async save (showPicker = false) {
    // Show SaveFilePicker on first save
    if (showPicker || !fs.fileHandle) {
      fs.fileHandle = await window.showSaveFilePicker(filePickerOptions)
    }

    const blobWriter = new zip.BlobWriter('application/zip')
    const zipWriter = new zip.ZipWriter(blobWriter)

    const store = useServiceStore()

    // Add service data to zip
    const service = JSON.stringify(store.service)
    await zipWriter.add('service.json', new zip.TextReader(service))

    // Add media files to zip
    for (const [fileId, fileUrl] of Object.entries(store.media)) {
      if (!service.includes(fileId)) {
        continue // File isn't used anymore, so don't save it
      }

      // Read the file from its url
      const reader = new zip.HttpReader(fileUrl, {
        preventHeadRequest: true
      })

      // Add file to zip (by its id, which includes the file extension)
      await zipWriter.add(fileId, reader)
    }

    await zipWriter.close()

    const blob = blobWriter.getData()

    // Write zip file to disk
    try {
      const writable = await fs.fileHandle.createWritable()
      await writable.write(blob)
      await writable.close()

      Notify.create({ type: 'positive', message: `Dienst succesvol opgeslagen als ${fs.fileHandle.name}` })
    } catch {
      Notify.create({ type: 'negative', message: 'De dienst kon niet worden opgeslagen. Is het bestand geopend in een ander programma?' })
    }
  }
}

export default ({ app }) => {
  // Allows to use this.$fs inside Vue components.
  app.config.globalProperties.$fs = fs
}

export { fs }
