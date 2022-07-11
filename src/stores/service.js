import { defineStore } from 'pinia'
import cloneDeep from 'lodash/cloneDeep'
import { nanoid } from 'nanoid'

export default defineStore('service', {
  state: () => ({
    service: null,
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
    createService ({ date, time, host, preacher, backgroundImageId, backgroundImageUrl }) {
      const service = {
        id: nanoid(),
        date,
        time,
        host,
        preacher,
        backgroundImageId,
        backgroundImageUrl,
        presentations: []
      }

      // Add default countdown
      service.presentations.push({
        id: 'countdown',
        type: 'countdown',
        settings: { time }
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
      this.previewPresentation = cloneDeep(presentation)
    },
    goLive (presentation) {
      const i = this.service.presentations.findIndex(s => s.id === presentation.id)
      const nextPresentation = this.service.presentations[i + 1]
      if (nextPresentation) {
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
    }
  }
})
