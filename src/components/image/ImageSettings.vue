<template>
  <q-card-section>
    <q-input v-if="fileUrl" v-model="settings.title" outlined label="Naam" :rules="['required']" class="q-mt-sm" />

    <div class="inputs-header">
      Selecteer afbeelding(en):
      <q-toggle v-model="equalFile" label="Zelfde bestand op beamer & livestream" @update:model-value="toggleEqual" />
    </div>

    <div class="row q-gutter-md">
      <div class="col">
        <q-file v-model="file" accept="image/*" :label="equalFile ? 'Beamer & livestream' : 'Beamer'" outlined @update:model-value="updateFile">
          <template #prepend>
            <q-icon name="image" />
          </template>
        </q-file>

        <img v-if="fileUrl" :src="fileUrl" class="full-width">
      </div>

      <div class="col" :class="{ disabled: equalFile }">
        <q-file v-model="fileLivestream" :readonly="equalFile" accept="image/*" label="Livestream" outlined @update:model-value="updateFileLivestream">
          <template #prepend>
            <q-icon name="image" />
          </template>
        </q-file>

        <img v-if="fileLivestreamUrl" :src="fileLivestreamUrl" class="full-width">
      </div>
    </div>
  </q-card-section>
</template>

<script>
import BaseSettings from '../presentation/BaseSettings.vue'

export default {
  extends: BaseSettings,
  data () {
    return {
      file: null,
      fileLivestream: null,
      equalFile: true
    }
  },
  computed: {
    fileUrl () {
      return this.$store.media[this.settings.fileId]
    },
    fileLivestreamUrl () {
      return this.$store.media[this.settings.fileLivestreamId] || this.fileUrl
    }
  },
  created () {
    if (this.settings.fileLivestreamId) {
      this.equalFile = false
    }
  },
  methods: {
    updateFile (file) {
      this.settings.fileId = this.$store.addMedia(file)
      this.settings.title = file.name
    },
    updateFileLivestream (fileLivestream) {
      this.settings.fileLivestreamId = this.$store.addMedia(fileLivestream)
    },
    toggleEqual () {
      if (!this.equalFile) {
        this.settings.fileLivestreamId = null
      }
    }
  }
}
</script>

<style scoped>
.inputs-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
