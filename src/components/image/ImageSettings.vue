<template>
  <div>
    <q-file v-model="file" accept="image/*" label="Selecteer afbeelding" outlined @update:model-value="update">
      <template #prepend>
        <q-icon name="image" />
      </template>
    </q-file>

    <img v-if="settings.url" :src="settings.url" class="q-mt-md full-width">
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
