<template>
  <div>
    <q-file v-model="file" label="Selecteer afbeelding" @update:model-value="update" />
    <img v-if="settings.url" :src="settings.url">
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
