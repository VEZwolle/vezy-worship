import * as zip from '@zip.js/zip.js'
import { Notify } from 'quasar'
import { get, set } from 'idb-keyval' // use IndexedDB database name: 'keyval-store', and store: 'keyval'
import dayjs from 'dayjs'
import { nanoid } from 'nanoid'

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
  /* JSON
  {
    "objectID":"2",
    "title":"Namen van God",
    "collection":null,
    "number":null,
    "lyrics":"chorus\nWonderbare raadsman\n\nGoddelijke held\n\nEeuwige vader\n\nVredevorst\n\nJezus",
    "lyricstranslate":"",
    "creator":"ew-import",
    "created_at":"2022-06-15 15:30:28",
    "updated_at":null
  }
  */

  async getSongDatabaseSettings () {
    try {
      const fileHandleSongDatabase = await get('VezySongDatabase') // get from IndexedDB
      if (fileHandleSongDatabase) return fileHandleSongDatabase.name
      return ''
    } catch (error) {
      console.log(error)
      return ''
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
        if ('showOpenFilePicker' in window) {
          [fileHandleSongDatabase] = await window.showOpenFilePicker(filePickerOptionsDb)
        } else {
          Notify.create({ type: 'info', message: 'Browser ondersteund openen dialoog niet, gebruik bijv. Chome of Edge' })
          return false
        }
      }
      // when file no longer exists an error is generated, caught with catch.
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

  async saveSongDatabase (showPicker = false, db = []) {
    if (!fsdb.localSongDatabase && db.length === 0) {
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
      if ('showOpenFilePicker' in window) { // if not exist/support --> download file via catch by emty filehandle
        try {
          fsdb.fileHandleSongDatabase = await window.showSaveFilePicker(filePickerOptionsDb)
        } catch (error) {
          if (error.name === 'AbortError') return Notify.create({ type: 'negative', message: 'Opslaan is geannuleerd' }) // user abort or files too sensitive or dangerous
          console.error(error) // unknown error --> download file via catch by emty filehandle
        }
      }
    }

    const blobWriter = new zip.BlobWriter('application/zip')
    const zipWriter = new zip.ZipWriter(blobWriter)

    // Add database data to zip
    const songDatabase = db.length > 0 ? JSON.stringify(db) : JSON.stringify(fsdb.localSongDatabase)
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
      Notify.create({ type: 'negative', message: 'Database kon niet worden opgeslagen. --> Downloaden...  gelukt?' })
      // try download
      const link = document.createElement('a')
      link.download = 'vezydatabase.vezdb'
      link.href = URL.createObjectURL(blob)
      link.click()
      URL.revokeObjectURL(link.href)
      return false
    }
  },

  newEmptyDatabase () {
    fsdb.fileHandleSongDatabase = null
    fsdb.localSongDatabase = []
  },

  async getCollections (open = false) {
    if (!fsdb.localSongDatabase) {
      if (!open) return []
      if (!(await fsdb.openSongDatabase())) return []
    }
    const collections = [...new Set(fsdb.localSongDatabase.map(d => d.collection))]
    return collections.sort()
  },
  async addToDatabase (settings, creator, objectID = null) {
    if (!fsdb.localSongDatabase) {
      if (!(await fsdb.openSongDatabase())) {
        Notify.create({ type: 'negative', message: 'Database kon niet worden geopend...' })
        return false
      }
    }
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const addSong = {
      objectID: null, // controle op bestaat toevoegen? nieuwe maken?
      title: settings.title,
      collection: settings.collection,
      number: settings.number,
      lyrics: settings.text,
      lyricstranslate: settings.translation,
      creator,
      created_at: now,
      updated_at: now
    }
    if (objectID) {
      const dbIndex = fsdb.localSongDatabase.findIndex(s => s.objectID === objectID)
      if (dbIndex !== -1) {
        addSong.objectID = fsdb.localSongDatabase[dbIndex].objectID
        addSong.created_at = fsdb.localSongDatabase[dbIndex].created_at
        fsdb.localSongDatabase[dbIndex] = addSong
        return true
      }
    }
    addSong.objectID = nanoid() // creare uniek objectID
    fsdb.localSongDatabase.push(addSong)
    return true
  },
  async removeFromDatabase (objectID) {
    if (!objectID) return false
    if (!fsdb.localSongDatabase) {
      if (!(await fsdb.openSongDatabase())) {
        Notify.create({ type: 'negative', message: 'Database kon niet worden geopend...' })
        return false
      }
    }
    fsdb.localSongDatabase = fsdb.localSongDatabase.filter(song => song.objectID !== objectID)
    return true
  }
}

export default ({ app }) => {
  // Allows to use this.$fsdb inside Vue components.
  app.config.globalProperties.$fsdb = fsdb
}

export { fsdb }
