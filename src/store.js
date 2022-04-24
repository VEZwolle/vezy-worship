import { defineStore } from 'pinia'

export default defineStore('main', {
  state: () => ({
    counter: 0
  }),
  actions: {
    increment () {
      this.counter++
    }
  }
})
