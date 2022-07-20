<template>
  <q-list>
    <q-item
      clickable
      class="bg-primary text-white"
      :active="true"
      active-class="text-bold"
      @dblclick="goLive"
    >
      <q-item-section>
        <q-item-label>{{ description }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-item
      clickable
      :active="true"
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
import BaseControl from '../presentation/BaseControl.vue'
import dayjs from 'dayjs'

export default {
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

<style scoped>
.q-item {
  transition: none;
  user-select: none;
  cursor: default !important;
  min-height: unset;
  padding: 6px 13px;
}
</style>
