<template>
  <q-card-section>
    <q-input v-model="settings.time" label="Aftellen tot (weergave bij tijd in de toekomst op dezelfde dag)" outlined mask="time" :rules="['time']">
      <template #append>
        <q-icon name="access_time" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-time v-model="settings.time" />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </q-card-section>
</template>

<script>
import BaseSettings from '../presentation/BaseSettings.vue'

export default {
  extends: BaseSettings,
  created () {
    if (!this.settings.time) {
      this.settings.time = this.$store.service.time
    }
  }
}
</script>
