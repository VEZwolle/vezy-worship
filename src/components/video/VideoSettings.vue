<template>
  <q-card-section>
    <q-input v-if="fileUrl" v-model="settings.title" outlined label="Naam" :rules="['required']" class="q-mt-sm" />

    <q-file v-model="file" accept="video/*" label="Selecteer video" outlined @update:model-value="update">
      <template #prepend>
        <q-icon name="smart_display" />
      </template>
    </q-file>

    <video
      v-if="fileUrl"
      ref="player"
      :src="fileUrl"
      controls
      muted
      playsinline
      disablePictureInPicture
      controlsList="nodownload noremoteplayback noplaybackrate"
      x-webkit-airplay="deny"
      class="full-width"
    />
    <div class="q-pa-md col">
      <q-btn color="primary" icon="first_page" label="zet start tijd" @click="setStartTime" /> {{ settings.startTime }}
      <q-btn color="primary" icon="last_page" label="zet stop (clear) tijd" @click="setEndTime" /> {{ settings.endTime }}
    </div>
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
      return this.$store.getMediaUrl(this.settings.fileId)
    }
  },
  methods: {
    setStartTime () {
      this.settings.startTime = this.$refs.player.currentTime
    },
    setEndTime () {
      this.settings.endTime = this.$refs.player.currentTime
    },
    update (file) {
      this.settings.fileId = this.$store.addMedia(file)
      this.settings.title = file.name
      this.settings.setStartTime = 0
      this.settings.endTime = this.$refs.player.duration
    }
  }
}
</script>
