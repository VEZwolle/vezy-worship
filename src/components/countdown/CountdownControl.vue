<template>
  <OutputPreview>
    <CountdownOutput :presentation="presentation" :clear="clear && !preview" />
  </OutputPreview>
</template>

<script>
import BaseControl from '../presentation/BaseControl.vue'
import dayjs from 'dayjs'
import OutputPreview from '../output/OutputPreview.vue'
import CountdownOutput from './CountdownOutput.vue'

export default {
  components: { OutputPreview, CountdownOutput },
  extends: BaseControl,
  created () {
    this.ticker = setInterval(this.tick, 1000)
    this.tick()
  },
  unmounted () {
    clearInterval(this.ticker)
  },
  methods: {
    tick () {
      this.settings.now = dayjs()
      const end = dayjs(this.settings.time, 'HH:mm')

      const seconds = end.diff(this.settings.now, 'seconds')

      this.settings.seconds = seconds % 60
      this.settings.minutes = Math.floor((seconds % 3600) / 60)
      this.settings.hours = Math.floor(seconds / 3600)
    }
  }
}
</script>
