<template>
  <q-card-section>
    <q-input v-model="settings.time" :label="types[settings.types].definition" outlined mask="time" :rules="['time']">
      <template #append>
        <q-icon name="access_time" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-time v-model="settings.time" />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-option-group
      v-model="settings.types"
      :options="types"
      color="primary"
      inline
    />
  </q-card-section>
</template>

<script>
import BaseSettings from '../presentation/BaseSettings.vue'

export default {
  extends: BaseSettings,
  data () {
    return {
      types: [
        {
          label: 'Aftelklok',
          value: 0,
          definition: 'Aftellen tot (weergave bij tijd in de toekomst op dezelfde dag)'
        },
        {
          label: 'Klok',
          value: 1,
          definition: 'Klok tot (weergave bij tijd in de toekomst op dezelfde dag)'
        }
      ]
    }
  },
  created () {
    if (!this.settings.time) {
      this.settings.time = this.$store.service.time
    }
    if (this.settings.types === undefined) {
      this.settings.types = 0
    }
  }
}
</script>
