import * as zip from '@zip.js/zip.js'
import { Notify } from 'quasar'
import { get, set } from 'idb-keyval' // use IndexedDB database name: 'keyval-store', and store: 'keyval'

const filePickerOptionsDb = {
  types: [{
    description: 'VezyWorship database bestand',
    accept: {
      'application/vezdb': '.vezdb'
    }
  }],
  excludeAcceptAllOption: true
}

const fsdb = {
  fileHandleSongDatabase: null,
  localSongDatabase: null,

  async getSongDatabaseSettings () {
    try {
      const fileHandleSongDatabase = await get('VezySongDatabase') // get from IndexedDB
      if (fileHandleSongDatabase) return fileHandleSongDatabase.name
      return ''
    } catch (error) {
      console.log(error)
    }
  },

  async openSongDatabase (newFile = false) {
    try {
      let fileHandleSongDatabase = null

      if (!newFile) {
        fileHandleSongDatabase = await get('VezySongDatabase') // get from IndexedDB
        if (fileHandleSongDatabase) {
          // verifyPermission: 'granted', 'denied' or 'prompt'
          const options = {}
          options.mode = 'read' // 'readwrite'
          if (await fileHandleSongDatabase.queryPermission(options) === 'prompt') await fileHandleSongDatabase.requestPermission(options)
          if (await fileHandleSongDatabase.queryPermission(options) !== 'granted') fileHandleSongDatabase = null
        }
      }
      if (!fileHandleSongDatabase) {
        [fileHandleSongDatabase] = await window.showOpenFilePicker(filePickerOptionsDb)
      }

      const file = await fileHandleSongDatabase.getFile()

      // Read file list from zip
      const zipReader = new zip.ZipReader(new zip.BlobReader(file))
      const entries = await zipReader.getEntries()

      // Load songdatabase data from `songdatabase.json`
      let songdatabase = entries.find(e => e.filename === 'songdatabase.json')
      if (!songdatabase) {
        Notify.create({ type: 'negative', message: 'Ongeldig VezyWorship song database bestand' })
        await zipReader.close()
        return false
      }

      fsdb.fileHandleSongDatabase = fileHandleSongDatabase
      await set('VezySongDatabase', fileHandleSongDatabase) // save to IndexedDB

      songdatabase = await songdatabase.getData(new zip.TextWriter())
      fsdb.localSongDatabase = JSON.parse(songdatabase)

      await zipReader.close()
      return true
    } catch (error) {
      console.log(error)
      Notify.create({ type: 'negative', message: `SongDatabase bestand Error: "${error.name}", "${error.message}"` })
      return false
    }
  },

  async saveSongDatabase (showPicker = false) {
    if (!fsdb.localSongDatabase) {
      Notify.create({ type: 'negative', message: 'Geen database gevonden voor opslaan.' })
      return false
    }

    if (!showPicker && fsdb.fileHandleSongDatabase) {
      // verifyPermission: 'granted', 'denied' or 'prompt'
      const options = {}
      options.mode = 'readwrite' // 'read'
      if (await fsdb.fileHandleSongDatabase.queryPermission(options) === 'prompt') await fsdb.fileHandleSongDatabase.requestPermission(options)
      if (await fsdb.fileHandleSongDatabase.queryPermission(options) !== 'granted') fsdb.fileHandleSongDatabase = null
    }
    // Show SaveFilePicker on first save
    if (showPicker || !fsdb.fileHandleSongDatabase) {
      fsdb.fileHandleSongDatabase = await window.showSaveFilePicker(filePickerOptionsDb)
    }

    const blobWriter = new zip.BlobWriter('application/zip')
    const zipWriter = new zip.ZipWriter(blobWriter)

    // Add database data to zip
    const songDatabase = JSON.stringify(fsdb.localSongDatabase)
    await zipWriter.add('songdatabase.json', new zip.TextReader(songDatabase))

    const blob = await zipWriter.close()

    // Write zip file to disk
    try {
      const writable = await fsdb.fileHandleSongDatabase.createWritable()
      await writable.write(blob)
      await writable.close()

      Notify.create({ type: 'positive', message: `Database opgeslagen als ${fsdb.fileHandleSongDatabase.name}` })
      await set('VezySongDatabase', fsdb.fileHandleSongDatabase) // save to IndexedDB
      return true
    } catch {
      Notify.create({ type: 'negative', message: 'Database kon niet worden opgeslagen. Is het bestand geopend in een ander programma?' })
      return false
    }
  },
  async getCollections (open = false) {
    if (!fsdb.localSongDatabase) {
      if (!open) return []
      if (!(await fsdb.openSongDatabase())) return []
    }
    const collections = [...new Set(fsdb.localSongDatabase.map(d => d.collection))]
    return collections.sort()
  }
}

export default ({ app }) => {
  // Allows to use this.$fsdb inside Vue components.
  app.config.globalProperties.$fsdb = fsdb
}

export { fsdb }
