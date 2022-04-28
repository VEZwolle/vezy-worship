<template>
  <q-item v-ripple class="q-my-sm" clickable>
    <q-item-section avatar>
      <q-avatar :color="color" text-color="white">
        {{ dateNumber }}
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label class="title">
        {{ $date(service.date) }}
      </q-item-label>
      <q-item-label caption lines="1">
        {{ service.host }}
        <span v-if="service.theme">- “{{ service.theme }}”</span>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import dayjs from 'dayjs'

export default {
  props: {
    service: Object,
    color: String
  },
  computed: {
    dateNumber () {
      return dayjs(this.service.date).format('DD')
    }
  }
}
</script>

<style scoped>
.title:first-letter {
  text-transform: capitalize;
}
</style>
