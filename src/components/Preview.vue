<template>
  <q-layout view="lHh lpr lFf" container class="full-height">
    <q-header>
      <q-toolbar class="bg-grey-3 text-dark">
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
    </q-header>

    <q-page-container>
      <q-page>
        <SongSectionSelect :sections="store.previewSongSections" />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import useServiceStore from 'stores/service'
import SongSectionSelect from './song/SongSectionSelect.vue'

export default {
  components: { SongSectionSelect },
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
