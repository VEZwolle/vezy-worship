<template>
  <q-card-section>
    <q-file v-model="file" accept="video/*" label="Selecteer video" outlined @update:model-value="update">
      <template #prepend>
        <q-icon name="smart_display" />
      </template>
    </q-file>

    <q-input v-if="fileUrl" v-model="settings.title" outlined label="Naam" :rules="['required']" class="q-mt-sm" />

    <video
      v-if="fileUrl"
      :src="fileUrl"
      controls
      muted
      playsinline
      disablePictureInPicture
      controlsList="nodownload noremoteplayback noplaybackrate"
      x-webkit-airplay="deny"
      class="full-width"
    />
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
