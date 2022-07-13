<template>
  <OutputPreview :component="CountdownOutput" :presentation="presentation" :clear="clear && !preview" />
</template>

<script>
import BaseControl from '../presentation/BaseControl.vue'
import dayjs from 'dayjs'
import OutputPreview from '../output/OutputPreview.vue'
import CountdownOutput from './CountdownOutput.vue'

export default {
  components: { OutputPreview },
  extends: BaseControl,
  setup () {
    return { CountdownOutput }
  },
  created () {
    this.ticker = setInterval(this.tick, 1000)
    this.tick()
  },
  unmounted () {
    clearInterval(this.ticker)
  },
  methods: {
    tick () {
      const now = dayjs()

      this.settings.now = now.format('H:mm:ss')

      const end = dayjs(this.settings.time, 'HH:mm')
      const seconds = end.diff(now, 'seconds')

      this.settings.seconds = seconds % 60
      this.settings.minutes = Math.floor((seconds % 3600) / 60)
      this.settings.hours = Math.floor(seconds / 3600)
    }
  }
}
</script>
