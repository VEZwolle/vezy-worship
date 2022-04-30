<template>
  <q-card flat square class="full-height">
    <q-toolbar class="bg-grey-3">
      <q-toolbar-title class="text-subtitle2">
        Preview
        <span v-if="song">- {{ song.title }}</span>
      </q-toolbar-title>

      <q-btn label="Go live" icon-right="arrow_forward" :disabled="!song" @click="goLive">
        <q-tooltip>
          Zet het item in de preview op het scherm
        </q-tooltip>
      </q-btn>
    </q-toolbar>

    <q-card-section>
      {{ song }}
    </q-card-section>
  </q-card>
</template>

<script>
import useServiceStore from 'stores/service'

export default {
  setup () {
    const store = useServiceStore()
    return { store }
  },
  computed: {
    song () {
      return this.store.previewSong
    }
  },
  methods: {
    goLive () {
      this.store.liveSong = this.song
    }
  }
}
</script>
