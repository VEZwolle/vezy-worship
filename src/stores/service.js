import { defineStore } from 'pinia'
import cloneDeep from 'lodash/cloneDeep'
import { nanoid } from 'nanoid'

export default defineStore('service', {
  state: () => ({
    service: null,
    previewPresentation: null,
    livePresentation: null,
    isClear: true
  }),
  actions: {
    loadService (data) {
      this.service = { ...data }
    },

    addPresentation (presentation) {
      presentation.id = nanoid(10)
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
