<template>
  <q-list
    v-shortkey="shortkeysNextBack"
    @shortkey="baseHandleArrow"
    @click="setHandleArrowLocation"
  >
    <q-item
      clickable
      class="bg-primary text-white"
      active
      active-class="text-bold"
      @dblclick="goLive"
    >
      <q-item-section>
        <q-item-label>{{ description }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-item
      clickable
      active
      :active-class="!preview ? 'bg-secondary text-white' : null"
      @dblclick="goLive"
    >
      <q-item-section>
        <span>Tot <strong>{{ settings.time }}</strong></span>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import { defineComponent } from 'vue'
import BaseControl from '../presentation/BaseControl.vue'
import dayjs from 'dayjs'

export default defineComponent({
  name: 'CountdownControl',
  extends: BaseControl,
  computed: {
    description () {
      const types = {
        0: 'Aftellen',
        1: 'Klok'
      }

      return types[this.settings.type]
    }
  },
  created () {
    // create .control via store: preview/golive
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
      const remainingSeconds = end.diff(now, 'seconds')

      this.presentation.control.isFinished = remainingSeconds <= 0

      if (this.settings.type === 1) { // klok
        this.presentation.control.remaining = now.format('H:mm:ss')
        return
      }
      // countdown klok
      const remainingHours = Math.floor(remainingSeconds / 3600)
      const hours = remainingHours.toString()
      const minutes = Math.floor((remainingSeconds % 3600) / 60).toString().padStart(2, '0')
      const seconds = (remainingSeconds % 60).toString().padStart(2, '0')
      if (remainingHours > 0) {
        this.presentation.control.remaining = `${hours}:${minutes}:${seconds}`
        return
      }
      this.presentation.control.remaining = `${minutes}:${seconds}`
    }
  }
})
</script>

<style scoped>
.q-item {
  transition: none;
  user-select: none;
  cursor: default !important;
  min-height: unset;
  padding: 6px 13px;
}
</style>
