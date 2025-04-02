import { defineStore, acceptHMRUpdate } from 'pinia'
import cloneDeep from 'lodash/cloneDeep'
import { nanoid } from 'nanoid'
import PACKAGE from '../../package.json'
import presentationPresets from '../components/presentation-presets.js'
import { versionUpdate } from './versionUpdate.js'
import { sanitizerHtmlService } from '../components/common/CleanText.js'
import { addControlCloneDeep } from '../components/presentation-control-create.js'
import oscOutput from '../components/osc-output-settings.js'

let clearLastShortKey

export const useServiceStore = defineStore('service', {
  state: () => ({
    service: null,
    serviceSaved: null,
    media: {},
    replaceBackgroundUrl: null,
    replaceDefaultsImages: null,
    outputRatio: 16 / 9,
    previewPresentation: null,
    livePresentation: null,
    isClear: true,
    isOnlyLivestreamClear: false,
    noLivestream: false,
    arrowKeyContinueRemoteSetlist: 0, // 0 = false, 1 = true, 2 = true + remote keys
    arrowKeyLocation: false, // true = preview, false = live
    startEnd: false, // start in live aan einde item
    searchBaseIsLocal: !(localStorage.getItem('database.searchBase') === 'cloud' || false),
    algoliaIndexId: localStorage.getItem('database.algoliaIndexId') ? parseInt(localStorage.getItem('database.algoliaIndexId')) : 0,
    splitSongLines: localStorage.getItem('splitSongLines') ? parseInt(localStorage.getItem('splitSongLines')) : 4,
    serviceType: localStorage.getItem('serviceType') || 'standaard',
    dbCollections: [''], // start with 1 empty string so showpopup works to load rest
    message: '',
    lastShortKey: '',
    setlistScroll: false,
    osc: {
      enabled: localStorage.getItem('oscEnabled') === 'true' || false,
      outAddress: localStorage.getItem('oscOutAddress') || 'localhost',
      outPort: localStorage.getItem('oscOutPort') || 7000,
      output: JSON.parse(localStorage.getItem('oscOutput')) || cloneDeep(oscOutput)
    }
  }),
  getters: {
    previewPresentationId(state) {
      return state.previewPresentation?.id
    },
    livePresentationId(state) {
      return state.livePresentation?.id
    }
  },
  actions: {
    setServiceSaved () {
      this.serviceSaved = JSON.stringify(this.service)
    },
    loadService (data) {
      // first update en check
      let serviceOpen = cloneDeep(data)
      if (serviceOpen.version !== PACKAGE.version) {
        serviceOpen = versionUpdate(serviceOpen)
        serviceOpen.version = PACKAGE.version
      }
      serviceOpen = sanitizerHtmlService(serviceOpen)
      // add to store/render
      this.$patch((state) => {
        state.service = cloneDeep(serviceOpen)
        state.previewPresentation = null
        state.livePresentation = null
      })
      this.serviceSaved = JSON.stringify(this.service)
    },
    addService (data) {
      // first update en check
      let serviceAdd = cloneDeep(data)
      if (serviceAdd.version !== PACKAGE.version) {
        serviceAdd = versionUpdate(serviceAdd)
        serviceAdd.version = PACKAGE.version
      }
      serviceAdd = sanitizerHtmlService(serviceAdd)
      // add to store/render
      serviceAdd.presentations.forEach(presentation => {
        const existing = this.service.presentations.find(p => p.id === presentation.id)
        if (existing) presentation.id = nanoid()
        this.addPresentation(presentation)
      })
    },
    fillService ({ id, date, time, theme, host, preacher, worshiplead, backgroundImageId, pcoId }) {
      // Create if is a new service (so has no id yet)
      if (!id) {
        this.loadService({
          id: nanoid(),
          version: PACKAGE.version,
          date,
          time,
          theme,
          host,
          preacher,
          worshiplead,
          backgroundImageId,
          pcoId,
          presentations: []
        })
        this.serviceSaved = null
      }

      // Default countdown
      this.addOrUpdatePresentation({
        id: 'countdown',
        type: 'countdown',
        settings: {
          time,
          type: 0
        }
      })

      // Default host caption
      if (theme) {
        this.addOrUpdatePresentation({
          id: 'info',
          type: 'caption',
          settings: {
            title: theme,
            text: '<div>Spreker &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ' + preacher + '<br>Aanbidding : ' + worshiplead + '<br>Host &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ' + host + '</div>',
            formatBeamer: 'Thema',
            formatLivestream: 'Breed'
          }
        })
      }

      // Default host caption
      if (host) {
        this.addOrUpdatePresentation({
          id: 'host',
          type: 'caption',
          settings: {
            title: 'Host',
            text: '<div>' + host + '</div>',
            formatBeamer: 'Geen',
            formatLivestream: 'Standaard'
          }
        })
      }

      // Default preacher caption
      if (preacher) {
        this.addOrUpdatePresentation({
          id: 'preacher',
          type: 'caption',
          settings: {
            title: 'Spreker',
            text: '<div>' + preacher + '</div>',
            formatBeamer: 'Geen',
            formatLivestream: 'Standaard'
          }
        })
      }

      presentationPresets.forEach(this.addOrIgnorePresentation)
    },

    addPresentation (presentation) {
      presentation.id = presentation.id || nanoid()
      this.service.presentations.push(presentation)
    },
    updatePresentation (presentation, settings) {
      Object.assign(presentation.settings, settings)
    },
    addOrUpdatePresentation (presentation) {
      const existing = this.service.presentations.find(p => p.id === presentation.id)

      existing
        ? this.updatePresentation(existing, presentation.settings)
        : this.addPresentation(presentation)
    },
    addOrIgnorePresentation (presentation) {
      const existing = this.service.presentations.find(p => p.id === presentation.id)

      if (existing) {
        return // ignore
      }

      this.addPresentation(presentation)
    },
    removePresentation (presentation) {
      this.service.presentations = this.service.presentations.filter(s => s.id !== presentation.id)
    },

    preview (presentation) {
      if (!presentation) return
      this.previewPresentation = addControlCloneDeep(presentation, this.noLivestream, this.splitSongLines, true, false)
    },
    goLive (presentation, previewNextPresentation = true) {
      if (!presentation) return

      if (previewNextPresentation) {
        const i = this.service.presentations.findIndex(s => s.id === presentation.id)
        const nextPresentation = this.service.presentations[i + 1] || null
        if (nextPresentation === null || nextPresentation?.id !== this.previewPresentationId) {
          // update live & preview
          this.$patch((state) => {
            // preview update
            state.previewPresentation = addControlCloneDeep(nextPresentation, this.noLivestream, this.splitSongLines, true, false)          
            state.setlistScroll = true
            // live update
            state.livePresentation = addControlCloneDeep(presentation, this.noLivestream, this.splitSongLines, false, this.startEnd)
            state.startEnd = false
            state.arrowKeyLocation = false // active arrow keys naar live
            state.isOnlyLivestreamClear = false
          })
          return
        }
      }

      // no preview update
      this.$patch((state) => {
        state.livePresentation = addControlCloneDeep(presentation, this.noLivestream, this.splitSongLines, false, this.startEnd)
        state.startEnd = false
        state.arrowKeyLocation = false // active arrow keys naar live
        state.isOnlyLivestreamClear = false
      })
    },
    goLiveNext () {
      this.startEnd = false
      if (!this.previewPresentation) return
      this.goLive(this.previewPresentation, true)
    },
    goLiveBack () {
      if (!this.livePresentationId) return
      const i = this.service.presentations.findIndex(s => s.id === this.livePresentationId)
      if (i === 0) return
      const backPresentation = this.service.presentations[i + -1]
      if (backPresentation) {
        switch (backPresentation.type) {
          case 'song':
          case 'caption':
          case 'scripture':
            this.startEnd = true // only used bij textslidescontrole to start at end.
            break
          default:
        }
      }
      this.goLive(backPresentation, true)
    },

    // Clear
    clear () {
      this.isClear = true
    },
    unclear () {
      this.isClear = false
    },
    toggleClear () {
      this.isClear = !this.isClear
    },
    toggleNoLivestream () {
      this.noLivestream = !this.noLivestream
    },
    shortkeysClear () {
      if (this.arrowKeyContinueRemoteSetlist > 1) return { ctrlc: ['ctrl', 'c'], f6: ['f6'], space: ['space'], period: ['.'] }
      return { ctrlc: ['ctrl', 'c'], f6: ['f6'], space: ['space'] }
    },
    shortkeysNextBack () {
      if (this.arrowKeyContinueRemoteSetlist > 1) return { up: ['arrowup'], down: ['arrowdown'], left: ['arrowleft'], right: ['arrowright'], pageup: ['pageup'], pagedown: ['pagedown'] }
      return { up: ['arrowup'], down: ['arrowdown'], left: ['arrowleft'], right: ['arrowright'] }
    },
    shortkeysPlay () {
      if (this.arrowKeyContinueRemoteSetlist > 1) return { f5: ['f5'], esc: ['esc'] }
      return { }
    },
    setLastShortKey (key) {
      this.lastShortKey = key
      // reset delayed
      clearTimeout(clearLastShortKey)
      clearLastShortKey = setTimeout(() => { this.lastShortKey = '' }, 200)
    },

    // Media
    addMedia (file) {
      const ext = file.name.split('.').pop()
      const id = `${nanoid()}.${ext}`

      this.media[id] = URL.createObjectURL(file)

      return id
    },
    removeMedia (id, check = false) {
      if (!id) {
        return null
      }
      if (id.startsWith('/')) {
        return null
      }
      // check if not used in service, preview or live:
      if (!check || !JSON.stringify(this.service).includes(id)) {
        if (!JSON.stringify(this.livePresentation).includes(id) && !JSON.stringify(this.previewPresentation).includes(id)) {
          URL.revokeObjectURL(this.media[id])
          delete this.media[id]
        }
      }
    },
    cleanMedia (notId, check = false) {
      for (const mediaId of Object.keys(this.media)) {
        if (mediaId !== notId) {
          this.removeMedia(mediaId, check)
        }
      }
    },
    getMediaUrl (id) {
      if (!id) {
        return null
      }

      // Media from `/public` folder
      if (id.startsWith('/')) {
        // check if public/image is replaced by settings
        const replaceDefault = this.replaceDefaultsImages?.find(t => t.fileId === id)
        if (replaceDefault?.url) return replaceDefault.url
        // use default
        return id.substring(1) // Remove leading slash to make it work on Electron
      }

      return this.media[id]
    },
    getImageIds () {
      // const imageExt = ['png', 'jpg', 'gif', 'tga', 'tif', 'jpeg']
      const videoExt = ['mp4', 'mov', 'avi', 'wmv', 'vob', 'mpg', 'mp2', 'mpv2', 'mpe', 'mpeg', 'mpev2']
      let mediaIds = Object.keys(this.media)
      if (mediaIds.length) {
        mediaIds = mediaIds.filter((id) => {
          const ext = id.split('.').pop().toLowerCase()
          if (videoExt.includes(ext)) return false
          // if (imageExt.includes(ext)) return true
          // Nu wannneer extentie niet bekend, vanuitgaan dat image is
          return true
        })
      }
      return mediaIds
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useServiceStore, import.meta.hot))
}
