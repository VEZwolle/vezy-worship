import * as zip from '@zip.js/zip.js'
import { Notify } from 'quasar'

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
  localSongDatabase: null,

  async openSongDatabase (dbFile = '') {
    let file

    if (dbFile) { // electron
      try {
        // nog uitwerken
        // file = ....
      } catch {
        Notify.create({ type: 'negative', message: 'Fout bij inladen VezyWorship song database bestand' })
      }
    }

    if (!file) {
      // ask file location
      const [fileHandleSongDatabase] = await window.showOpenFilePicker(filePickerOptionsDb)
      file = await fileHandleSongDatabase.getFile()
    }

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

    songdatabase = await songdatabase.getData(new zip.TextWriter())
    fsdb.localSongDatabase = JSON.parse(songdatabase)

    await zipReader.close()
  }
}

export default ({ app }) => {
  // Allows to use this.$fsdb inside Vue components.
  app.config.globalProperties.$fsdb = fsdb
}

export { fsdb }
