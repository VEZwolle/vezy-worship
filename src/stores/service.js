import { defineStore } from 'pinia'
import { api } from 'boot/api'

export default defineStore('service', {
  state: () => ({
    service: null,
    previewSong: null
  }),
  actions: {
    async loadService (id) {
      this.service = await api.get(`/services/${id}`)
    },
    saveService () {
      return api.patch(`/services/${this.service.id}`, this.service)
    }
  }
})
