<template>
  <q-banner v-if="countTabs > 1" dense inline-actions class="text-white bg-red">
    Meerdere tabs {{ this.countTabs }} met Vezy-Worship open; dit kan de werking verminderen en fouten geven.
    <template v-slot:action>
      <q-btn flat round color="white" icon="close" @click="reCountTabs" />
    </template>
  </q-banner>
</template>

<script>
import { defineComponent } from 'vue'

const bc = new BroadcastChannel('CheckNrTabsOpen')

export default defineComponent({
  name: 'CheckNrTabsOpen',
  data () {
    return {
      externalUpdate: false,
      lastTimeStamp: 0,
      countTabs: -1, // sync on tabs by component
      MeCounted: false,
      setTimeoutReCount: null
    }
  },
  watch: {
    'countTabs' () {
      if (!this.externalUpdate) {
        this.lastTimeStamp = Date.now()
        bc.postMessage(`${this.countTabs}|${this.lastTimeStamp}`)
      }
      this.externalUpdate = false
    }
  },
  created () {
    bc.onmessage = (message) => {
      console.log(message)
      if (message === undefined) {
        this.bc.postMessage(`${this.countTabs}`)
        return
      }
      const data = message.data.split('|')
      if (data.length < 2) return 
      const messageData = parseInt(data[0])
      const messageTimeStamp = parseInt(data[1])

      if (messageData === 0) {
        this.MeCounted = false // restart count
        this.setTimeoutReCount = setTimeout(() => this.countThisTab(), 100)
      }
      console.log(`[ ${messageTimeStamp} ] [ ${this.lastTimeStamp} ] ${messageData} | ${this.MeCounted}`)
      if (messageTimeStamp <= this.lastTimeStamp) return

      this.externalUpdate = true
      this.lastTimeStamp = messageTimeStamp
      this.countTabs = messageData
    }
  },
  mounted () {
    this.reCountTabs()
  },
  unmouted () {
    if (this.setTimeoutReCount) clearTimeout(this.setTimeoutReCount)
    bc.close()
  },
  methods: {
    countThisTab () {
      if (!this.MeCounted) {
        this.MeCounted = true
        this.countTabs++
      }
    },
    reCountTabs () {
      this.countTabs = 0
      if (this.setTimeoutReCount) clearTimeout(this.setTimeoutReCount) // no dubble
      this.setTimeoutReCount = setTimeout(() => this.reCountTabsNext(), 200)
    },
    reCountTabsNext () {
      this.MeCounted = false
      this.countThisTab()
    }
  }
})
</script>

<style scoped>
</style>
