<template>
  <div>
    <q-file v-model="file" accept="video/*" label="Selecteer video" outlined @update:model-value="update">
      <template #prepend>
        <q-icon name="smart_display" />
      </template>
    </q-file>

    <video v-if="settings.url" :src="settings.url" muted class="q-mt-md full-width" />
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
