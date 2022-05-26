<template>
  <OutputPreview :sync-clear="!preview">
    <CountdownOutput :presentation="presentation" />
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
      const now = dayjs()
      const end = dayjs(this.settings.time, 'HH:mm')

      const seconds = end.diff(now, 'seconds')

      this.settings.seconds = seconds % 60
      this.settings.minutes = Math.floor(seconds / 60)
    }
  }
}
</script>
