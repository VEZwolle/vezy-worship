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
    noLivestream: false,
    message: ''
  }),
  actions: {
    loadService (data) {
      this.service = cloneDeep(data)
      this.previewPresentation = null
      this.livePresentation = null
    },
    fillService ({ id, date, time, host, preacher, backgroundImageId }) {
      // Create if is a new service (so has no id yet)
      if (!id) {
        this.loadService({
          id: nanoid(),
          date,
          time,
          host,
          preacher,
          backgroundImageId,
          presentations: []
        })
      }

      // Default countdown
      this.upsertPresentation({
        id: 'countdown',
        type: 'countdown',
        settings: {
          time,
          type: 0
        }
      })

      // Default host caption
      if (host) {
        this.upsertPresentation({
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
        this.upsertPresentation({
          id: 'preacher',
          type: 'caption',
          settings: {
            title: 'Spreker',
            text: preacher
          }
        })
      }

      presentationPresets.forEach(this.upsertPresentation)
    },

    addPresentation (presentation) {
      presentation.id = presentation.id || nanoid()
      this.service.presentations.push(presentation)
    },
    updatePresentation (presentation, settings) {
      Object.assign(presentation.settings, settings)
    },
    upsertPresentation (presentation) {
      const existing = this.service.presentations.find(p => p.id === presentation.id)

      existing
        ? this.updatePresentation(existing, presentation.settings)
        : this.addPresentation(presentation)
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
    toggleNoLivestream () {
      this.noLivestream = !this.noLivestream
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
