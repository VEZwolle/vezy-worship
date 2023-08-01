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
        return
      }

      fsdb.fileHandleSongDatabase = fileHandleSongDatabase
      await set('VezySongDatabase', fileHandleSongDatabase) // save to IndexedDB

      songdatabase = await songdatabase.getData(new zip.TextWriter())
      fsdb.localSongDatabase = JSON.parse(songdatabase)

      await zipReader.close()
    } catch (error) {
      console.log(error)
      Notify.create({ type: 'negative', message: `SongDatabase bestand Error: "${error.name}", "${error.message}"` })
    }
  }
}

export default ({ app }) => {
  // Allows to use this.$fsdb inside Vue components.
  app.config.globalProperties.$fsdb = fsdb
}

export { fsdb }
