<template>
  <q-card-section>
    <q-file v-model="file" accept="image/*" label="Selecteer afbeelding" outlined @update:model-value="update">
      <template #prepend>
        <q-icon name="image" />
      </template>
    </q-file>

    <q-input v-if="fileUrl" v-model="settings.title" outlined label="Naam" :rules="['required']" class="q-mt-sm" />

    <img v-if="fileUrl" :src="fileUrl" class="full-width">
  </q-card-section>
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
  computed: {
    fileUrl () {
      return this.$store.media[this.settings.fileId]
    }
  },
  methods: {
    update (file) {
      this.settings.fileId = this.$store.addMedia(file)
      this.settings.title = file.name
    }
  }
}
</script>
