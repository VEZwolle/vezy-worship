import { defineStore } from 'pinia'
import cloneDeep from 'lodash/cloneDeep'
import { nanoid } from 'nanoid'
import presentationPresets from '../components/presentation-presets'

export default defineStore('service', {
  state: () => ({
    service: null,
    media: {},
    outputRatio: 16 / 9,
    previewPresentation: null,
    livePresentation: null,
    isClear: true,
    message: ''
  }),
  actions: {
    loadService (data) {
      this.service = cloneDeep(data)
      this.previewPresentation = null
      this.livePresentation = null
    },
    fillService ({ id, date, time, theme, host, preacher, worshiplead, backgroundImageId, pcoId }) {
      // Create if is a new service (so has no id yet)
      if (!id) {
        this.loadService({
          id: nanoid(),
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
            // Waarom worden de spaties en nieuwe regeleinden (\r\n) verwijderd??? <br> & &nbsp; blijft wel staan
            text: 'Spreker &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ' + preacher + '<br>Aanbidding : ' + worshiplead + '<br>Host &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ' + host
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
            text: host
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
            text: preacher
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

      this.previewPresentation = cloneDeep(presentation)
    },
    goLive (presentation, previewNextPresentation = true) {
      if (!presentation) return

      if (previewNextPresentation) {
        const i = this.service.presentations.findIndex(s => s.id === presentation.id)
        const nextPresentation = this.service.presentations[i + 1]
        if (nextPresentation && nextPresentation.id !== this.previewPresentation.id) {
          this.previewPresentation = cloneDeep(nextPresentation)
        }
      }

      this.livePresentation = cloneDeep(presentation)
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

    // Media
    addMedia (file) {
      const ext = file.name.split('.').pop()
      const id = `${nanoid()}.${ext}`

      this.media[id] = URL.createObjectURL(file)

      return id
    },
    getMediaUrl (id) {
      if (!id) {
        return null
      }

      // Media from `/public` folder
      if (id.startsWith('/')) {
        return id.substring(1) // Remove leading slash to make it work on Electron
      }

      return this.media[id]
    }
  }
})
