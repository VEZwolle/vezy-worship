<template>
  <div>
    <q-input v-model="settings.time" label="Aftellen tot" outlined mask="time" :rules="['time']">
      <template #append>
        <q-icon name="access_time" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-time v-model="settings.time" />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script>
import BaseSettings from '../presentation/BaseSettings.vue'
import useServiceStore from 'stores/service'

export default {
  extends: BaseSettings,
  setup () {
    const store = useServiceStore()
    return { store }
  },
  created () {
    if (!this.settings.time) {
      this.settings.time = this.store.service.time
    }
  }
}
</script>
