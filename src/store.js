import { defineStore } from 'pinia'
import api from './util/api'

export default defineStore('main', {
  state: () => ({
    service: null
  }),
  actions: {
    async loadService (id) {
      this.service = await api.get(`/services/${id}`)
    }
  }
})
