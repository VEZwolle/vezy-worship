import * as zip from '@zip.js/zip.js'
import useServiceStore from 'stores/service'
import { Notify } from 'quasar'
import { nanoid } from 'nanoid'

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

    const loadFile = async (fileId) => {
      // Find file in zip
      const file = entries.find(e => e.filename === fileId)
      if (!file) {
        return null
      }

      // Read file as blob
      const blob = await file.getData(new zip.BlobWriter())

      return URL.createObjectURL(blob)
    }

    // Load service data from `service.json`
    let service = entries.find(e => e.filename === 'service.json')
    if (!service) {
      Notify.create({ type: 'negative', message: 'Ongeldig VezyWorship bestand' })
      await zipReader.close()
      return
    }

    service = await service.getData(new zip.TextWriter())
    service = JSON.parse(service)

    // Loop over presentations and download associated files from zip
    for (const presentation of service.presentations) {
      const settings = presentation.settings

      // Skip presentations without files
      if (!settings.fileId) {
        continue
      }

      // Set new file url in `presentation.settings`
      settings.fileUrl = await loadFile(settings.fileId)
    }

    // Load service background image
    if (service.backgroundImageId) {
      service.backgroundImageUrl = await loadFile(service.backgroundImageId)
    }

    await zipReader.close()

    // Add loaded service to store
    const store = useServiceStore()
    store.loadService(service)
  },

  async save (showPicker = false) {
    // Show SaveFilePicker on first save
    if (showPicker || !fs.fileHandle) {
      fs.fileHandle = await window.showSaveFilePicker(filePickerOptions)
    }

    const blobWriter = new zip.BlobWriter('application/zip')
    const zipWriter = new zip.ZipWriter(blobWriter)

    const addFile = async (id, url) => {
      // Read the file from its url
      const reader = new zip.HttpReader(url, {
        preventHeadRequest: true
      })

      // Add file to zip (by its id, which includes the file extension)
      await zipWriter.add(id, reader)
    }

    const store = useServiceStore()

    for (const presentation of store.service.presentations) {
      const settings = presentation.settings

      // Skip presentations without files
      if (!settings.fileId) {
        continue
      }

      await addFile(settings.fileId, settings.fileUrl)
    }

    // Add service background image
    if (store.service.backgroundImageId) {
      await addFile(store.service.backgroundImageId, store.service.backgroundImageUrl)
    }

    // Add service data to zip
    const service = JSON.stringify(store.service)
    await zipWriter.add('service.json', new zip.TextReader(service))

    await zipWriter.close()

    const blob = blobWriter.getData()

    // Write zip file to disk
    const writable = await fs.fileHandle.createWritable()
    await writable.write(blob)
    await writable.close()

    Notify.create({ type: 'positive', message: `Dienst succesvol opgeslagen als ${fs.fileHandle.name}` })
  },

  createFileId (file) {
    const ext = file.name.split('.').pop()
    return `${nanoid()}.${ext}`
  }
}

export default ({ app }) => {
  // Allows to use this.$fs inside Vue components.
  app.config.globalProperties.$fs = fs
}

export { fs }
