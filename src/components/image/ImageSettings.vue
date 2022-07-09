<template>
  <q-card-section>
    <q-input v-if="fileUrl" v-model="settings.title" outlined label="Naam" :rules="['required']" class="q-mt-sm" />
    <div class="row">
      <q-file v-model="file" accept="image/*" :label="labelFile" outlined class="width50" @update:model-value="update">
        <template #prepend>
          <q-icon name="image" />
        </template>
      </q-file>
      <q-file v-if="!equalFile" v-model="fileLivestream" accept="image/*" label="Selecteer afbeelding Livestream" outlined class="width50" @update:model-value="updateLivestream">
        <template #prepend>
          <q-icon name="image" />
        </template>
      </q-file>
    </div>
    <q-toggle v-model="equalFile" label="Zelfde bestand voor Beamer & Livestream" @update:model-value="updateEqual" />
    <div class="row">
      <img v-if="fileUrl" :src="fileUrl" class="width50">
      <img v-if="fileLivestreamUrl && !equalFile" :src="fileLivestreamUrl" class="width50">
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
      equalFile: true,
      labelFile: 'Selecteer afbeelding'
    }
  },
  computed: {
    fileUrl () {
      return this.$store.media[this.settings.fileId]
    },
    fileLivestreamUrl () {
      return this.$store.media[this.settings.fileLivestreamId]
    }
  },
  created () {
    if (this.settings.fileLivestreamId !== this.settings.fileId) {
      this.equalFile = false
    }
  },
  methods: {
    update (file) {
      this.settings.fileId = this.$store.addMedia(file)
      this.settings.title = file.name
      if (this.equalFile) {
        this.settings.fileLivestreamId = this.settings.fileId
      }
    },
    updateLivestream (fileLivestream) {
      this.settings.fileLivestreamId = this.$store.addMedia(fileLivestream)
    },
    updateEqual () {
      if (this.equalFile) {
        this.settings.fileLivestreamId = this.settings.fileId
        this.labelFile = 'Selecteer afbeelding'
      } else {
        this.labelFile = 'Selecteer afbeelding Beamer'
      }
    }
  }
}
</script>

<style scope>
.width50 {
  width: 50%;
}
</style>
