import { defineStore } from 'pinia'
import cloneDeep from 'lodash/cloneDeep'
import { nanoid } from 'nanoid'

export default defineStore('service', {
  state: () => ({
    service: null,
    media: {},
    outputRatio: 16 / 9,
    previewPresentation: null,
    livePresentation: null,
    livePresentationToRestore: null,
    isClear: true,
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

      // Add collecte
      service.presentations.push({
        id: 'collecte',
        type: 'image',
        settings: {
          title: 'Collecte',
          beamer: {
            fileId: 'Collectebeamer.png',
            ratio: 16 / 9,
            advanced: false,
            zoom: 100,
            x: 0,
            y: 0,
            rotate: 0
          },
          livestream: {
            fileId: 'collectelivestream.png',
            ratio: 16 / 9,
            advanced: false,
            zoom: 100,
            x: 0,
            y: 0,
            rotate: 0
          }
        }
      })

      // Add nazorg
      service.presentations.push({
        id: 'nazorg',
        type: 'image',
        settings: {
          title: 'Nazorg',
          beamer: {
            fileId: 'nazorgbeamer.png',
            ratio: 16 / 9,
            advanced: false,
            zoom: 100,
            x: 0,
            y: 0,
            rotate: 0
          },
          livestream: {
            fileId: 'nazorglivestream.png',
            ratio: 16 / 9,
            advanced: false,
            zoom: 100,
            x: 0,
            y: 0,
            rotate: 0
          }
        }
      })

      // Add gezegendezondag
      service.presentations.push({
        id: 'end',
        type: 'image',
        settings: {
          title: 'Einde dienst / Gezegende Zondag',
          beamer: {
            fileId: 'endbeamer.png',
            ratio: 16 / 9,
            advanced: false,
            zoom: 100,
            x: 0,
            y: 0,
            rotate: 0
          },
          livestream: {
            fileId: 'endlivestream.png',
            ratio: 16 / 9,
            advanced: false,
            zoom: 100,
            x: 0,
            y: 0,
            rotate: 0
          }
        }
      })

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
    goLive (presentation) {
      if (!presentation) return

      const i = this.service.presentations.findIndex(s => s.id === presentation.id)
      const nextPresentation = this.service.presentations[i + 1]
      if (nextPresentation && nextPresentation.id !== this.previewPresentation.id) {
        this.previewPresentation = cloneDeep(nextPresentation)
      }

      this.livePresentation = cloneDeep(presentation)
      this.livePresentationToRestore = null
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
    }
  }
})
