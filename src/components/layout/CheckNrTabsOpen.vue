<template>
  <q-btn
    v-if="countTabs > 1"
    dense
    color="red"
    text-color="white"
    class="q-mr-sm"
    label="Open in meerdere tabs !"
    @click="reCountTabs"
  >
    <q-tooltip>
      Meerdere tabs met Vezy-Worship open!<br>
      Dit kan fouten & sync problemen geven.<br>
      Aanklikken na sluiten andere tabs om deze melding weg te laten gaan.
    </q-tooltip>
  </q-btn>
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
        // send update to other tabs (not self)
        this.lastTimeStamp = Date.now()
        bc.postMessage({
          countTabs: this.countTabs, 
          lastTimeStamp: this.lastTimeStamp
        })
      }
      this.externalUpdate = false
    }
  },
  created () {
    bc.onmessage = (message) => {
      if (message === undefined) {
        bc.postMessage({
          countTabs: this.countTabs, 
          lastTimeStamp: this.lastTimeStamp
        })
        return
      }

      if (message.data.lastTimeStamp <= this.lastTimeStamp) return

      if (message.data.countTabs === 0) {
        this.MeCounted = false // restart count
        this.setTimeoutReCount = setTimeout(() => this.countThisTab(), 100)
      }

      this.externalUpdate = true
      this.lastTimeStamp = message.data.lastTimeStamp
      this.countTabs = message.data.countTabs
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
      this.externalUpdate = false
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
