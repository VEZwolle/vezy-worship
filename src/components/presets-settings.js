import { Notify } from 'quasar'
import { get, set } from 'idb-keyval' // use IndexedDB database name: 'keyval-store', and store: 'keyval'
import presentationPresets from './presentation-presets.js'
import BgPng from '../assets/bg.png'

const fileDefaults = {
  baseFileId: null,
  handle: null,
  URL: null
}

const filePickerOptionsImage = {
  types: [{
    description: 'Images',
    accept: {
      'image/*': ['.png', '.gif', '.jpeg', '.jpg']
    }
  }],
  excludeAcceptAllOption: true
}

async function getPresentationPresetsSettings (imageFileOutput, indexedDBName) {
  // imageFileOutput update imageFiles[i].beamer/livestream door javascript array link
  try {
    imageFileOutput.handle = await get(indexedDBName) // get from IndexedDB
    if (imageFileOutput.handle) {
      // verifyPermission: 'granted', 'denied' or 'prompt'
      const options = {}
      options.mode = 'read' // 'readwrite'
      if (await imageFileOutput.handle.queryPermission(options) === 'prompt') await imageFileOutput.handle.requestPermission(options)
      if (await imageFileOutput.handle.queryPermission(options) !== 'granted') imageFileOutput.handle = null
    }
    if (imageFileOutput.handle) {
      // imageFileOutput.handle.name
      // when file no longer exists an error is generated, caught with catch.
      const file = await imageFileOutput.handle.getFile()
      if (!file) {
        imageFileOutput.handle = null
      } else {
        imageFileOutput.URL = URL.createObjectURL(file)
      }
    }
  } catch (error) {
    console.error(error)
  }
  if (!imageFileOutput.URL) return false
  return true
}

// export used by app settings to change
export const imageFiles = [
  {
    name: 'background',
    label: 'Achtergrond',
    beamer: {
      ...fileDefaults
    },
    livestream: {
      ...fileDefaults
    }
  },
  {
    name: 'offering',
    label: 'Collecte',
    beamer: {
      ...fileDefaults
    },
    livestream: {
      ...fileDefaults
    }
  },
  {
    name: 'ministry',
    label: 'Nazorg',
    beamer: {
      ...fileDefaults
    },
    livestream: {
      ...fileDefaults
    }
  },
  {
    name: 'end',
    label: 'Einde dienst',
    beamer: {
      ...fileDefaults
    },
    livestream: {
      ...fileDefaults
    }
  }
]

const replaceDefaults = []
// used in output / outputpreview / beckgroundsettings

export let replaceBackgroundUrl

let firstRunGet = true
// run once after first user klik; new/open/appsettings
export async function getPresentationsPresetsSettings () {
  if (firstRunGet) {
    firstRunGet = false // only run once
    // presentation-presets
    for (let i = 0; i < imageFiles.length; i++) {
      const presentationPreset = presentationPresets.find(t => t.id === imageFiles[i].name)
      if (presentationPreset) {
        imageFiles[i].beamer.baseFileId = presentationPreset.settings.beamer.fileId.substring(1) // Remove leading slash to make it work on Electron
        imageFiles[i].livestream.baseFileId = presentationPreset.settings.livestream.fileId.substring(1) // Remove leading slash to make it work on Electron
      }
      if (await getPresentationPresetsSettings(imageFiles[i].beamer, `imgbeamer${imageFiles[i].name}`)) {
        if (presentationPreset) {
          replaceDefaults.push({
            fileId: presentationPreset.settings.beamer.fileId,
            url: imageFiles[i].beamer.URL
          })
        }
      }
      if (await getPresentationPresetsSettings(imageFiles[i].livestream, `imglivestream${imageFiles[i].name}`)) {
        if (presentationPreset) {
          replaceDefaults.push({
            fileId: presentationPreset.settings.livestream.fileId,
            url: imageFiles[i].livestream.URL
          })
        }
      }
    }
    // background
    const index = imageFiles.findIndex(t => t.name === 'background')
    imageFiles[index].beamer.baseFileId = BgPng
    if (imageFiles[index]?.beamer.URL) replaceBackgroundUrl = imageFiles[index].beamer.URL
  }
}

// used in settings
export async function setPresentationPresetsSettings () {
  for (let i = 0; i < imageFiles.length; i++) {
    await set(`imgbeamer${imageFiles[i].name}`, imageFiles[i].beamer.handle) // save to IndexedDB
    await set(`imglivestream${imageFiles[i].name}`, imageFiles[i].livestream.handle) // save to IndexedDB
  }
}

// used in settings
export async function openPresentationPresetsSettings (imageFileOutput) {
  if ('showOpenFilePicker' in window) { // if not exist: no support
    try {
      [imageFileOutput.handle] = await window.showOpenFilePicker(filePickerOptionsImage)
    } catch (error) {
      imageFileOutput.handle = null
      if (error.name === 'AbortError') {
        Notify.create({ type: 'negative', message: 'Openen is geannuleerd' }) // user abort or files too sensitive or dangerous
        return false
      }
      console.error(error) // unknown error
      return false
    }
    try {
      if (imageFileOutput.handle) {
        // verifyPermission: 'granted', 'denied' or 'prompt'
        const options = {}
        options.mode = 'read' // 'readwrite'
        if (await imageFileOutput.handle.queryPermission(options) === 'prompt') await imageFileOutput.handle.requestPermission(options)
        if (await imageFileOutput.handle.queryPermission(options) !== 'granted') imageFileOutput.handle = null
      }
      if (imageFileOutput.handle) {
        // when file no longer exists an error is generated, caught with catch.
        const file = await imageFileOutput.handle.getFile()
        if (!file) {
          imageFileOutput.handle = null
        } else {
          imageFileOutput.URL = URL.createObjectURL(file)
        }
      }
    } catch (error) {
      console.error(error)
    }
    if (!imageFileOutput.URL) return false
    return true
  }
  return false
}

// used in settings
export function removePresentationPresetsSettings (imageFileOutput) {
  imageFileOutput.handle = null
}

// used in service(store)
export function getDefaultURL (fileId) {
  const replaceDefault = replaceDefaults.find(t => t.fileId === fileId)
  if (replaceDefault?.url) return replaceDefault.url
  return false
}
