import { defineStore } from 'pinia'
import { api } from 'boot/api'
import chunk from 'lodash/chunk'
import { nanoid } from 'nanoid'

export default defineStore('service', {
  state: () => ({
    service: null,
    previewSong: null,
    liveSong: null,
    isClear: true,

    selectedSectionIndex: null,
    selectedSlideIndex: null
  }),
  getters: {
    previewSongSections () {
      return splitSong(this.previewSong?.text)
    },
    liveSongSections () {
      return splitSong(this.liveSong?.text)
    },

    selectedSection () {
      return this.liveSongSections?.[this.selectedSectionIndex] || []
    },
    selectedSlide () {
      return this.selectedSection?.[this.selectedSlideIndex] || []
    }
  },
  actions: {
    async loadService (id) {
      this.service = await api.get(`/services/${id}`)
    },
    saveService () {
      return api.patch(`/services/${this.service.id}`, this.service)
    },
    addSong (song) {
      song.key = nanoid(10)
      this.service.songs.push(song)
    },
    removeSong (song) {
      this.service.songs = this.service.songs.filter(s => s.key !== song.key)
    }
  }
})

function splitSong (text) {
  if (!text) return []

  return text
    .replace(/\r?\n/g, '<br>')
    .split('<br><br>')
    .map((section) => {
      const lines = section.split('<br>')
      return chunk(lines, 2)
    })
}
