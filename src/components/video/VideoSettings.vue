<template>
  <div>
    <q-file v-model="file" accept="video/*" label="Selecteer video" outlined @update:model-value="update">
      <template #prepend>
        <q-icon name="smart_display" />
      </template>
    </q-file>

    <q-input v-if="settings.url" v-model="settings.name" outlined label="Naam" stack-label :rules="['required']" class="q-mt-sm" />

    <video v-if="settings.url" :src="settings.url" muted class="full-width" />
  </div>
</template>

<script>
import BaseSettings from '../presentation/BaseSettings.vue'

export default {
  extends: BaseSettings,
  data () {
    return {
      file: null
    }
  },
  methods: {
    update (file) {
      this.settings.url = URL.createObjectURL(file)
      this.settings.name = file.name
    }
  }
}
</script>
