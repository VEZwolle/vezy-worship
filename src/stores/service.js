import { defineStore } from 'pinia'
import cloneDeep from 'lodash/cloneDeep'
import { nanoid } from 'nanoid'

export default defineStore('service', {
  state: () => ({
    service: null,
    media: {},
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
    createService ({ date, time, host, preacher, backgroundImageId }) {
      const service = {
        id: nanoid(),
        date,
        time,
        host,
        preacher,
        backgroundImageId,
        presentations: []
      }

      // Add default countdown
      service.presentations.push({
        id: 'countdown',
        type: 'countdown',
        settings: {
          time,
          type: 0
        }
      })

      // Add default host caption
      if (host) {
        service.presentations.push({
          id: 'host',
          type: 'caption',
          settings: {
            title: 'Host',
            text: host
          }
        })
      }

      // Add default preacher caption
      if (preacher) {
        service.presentations.push({
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
          fileId: 'collecte',
          fileLivestreamId: 'collecte',
          beamerDefault: true,
          beamerWidth: 1920,
          beamerHeight: 1080,
          beamerZoom: 100,
          beamerY: 0,
          beamerX: 0,
          beamerRotate: 0,
          livestreamDefault: true,
          livestreamWidth: 1920,
          livestreamHeight: 1080,
          livestreamZoom: 100,
          livestreamY: 0,
          livestreamX: 0,
          livestreamRotate: 0
        }
      })

      // Add nazorg
      service.presentations.push({
        id: 'nazorg',
        type: 'image',
        settings: {
          title: 'Nazorg',
          fileId: 'nazorg',
          fileLivestreamId: 'nazorg',
          beamerDefault: true,
          beamerWidth: 1920,
          beamerHeight: 1080,
          beamerZoom: 100,
          beamerY: 0,
          beamerX: 0,
          beamerRotate: 0,
          livestreamDefault: true,
          livestreamWidth: 1920,
          livestreamHeight: 1080,
          livestreamZoom: 100,
          livestreamY: 0,
          livestreamX: 0,
          livestreamRotate: 0
        }
      })

      // Add gezegendezondag
      service.presentations.push({
        id: 'end',
        type: 'image',
        settings: {
          title: 'Einde dienst / Gezegende Zondag',
          fileId: 'end',
          fileLivestreamId: 'end',
          beamerDefault: true,
          beamerWidth: 1920,
          beamerHeight: 1080,
          beamerZoom: 100,
          beamerY: 0,
          beamerX: 0,
          beamerRotate: 0,
          livestreamDefault: true,
          livestreamWidth: 1920,
          livestreamHeight: 1080,
          livestreamZoom: 100,
          livestreamY: 0,
          livestreamX: 0,
          livestreamRotate: 0
        }
      })

      this.loadService(service)
    },

    addPresentation (presentation) {
      presentation.id = nanoid()
      this.service.presentations.push(presentation)
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
