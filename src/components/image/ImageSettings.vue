<template>
  <div>
    <q-file v-model="file" accept="image/*" label="Selecteer afbeelding" outlined @update:model-value="update">
      <template #prepend>
        <q-icon name="image" />
      </template>
    </q-file>

    <q-input v-if="settings.fileUrl" v-model="settings.title" outlined label="Naam" :rules="['required']" class="q-mt-sm" />

    <img v-if="settings.fileUrl" :src="settings.fileUrl" class="full-width">
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
      this.settings.fileId = this.$fs.createFileId(file)
      this.settings.fileUrl = URL.createObjectURL(file)
      this.settings.title = file.name
    }
  }
}
</script>
