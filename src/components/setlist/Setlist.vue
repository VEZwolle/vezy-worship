<template>
  <q-card flat square class="full-height">
    <q-card-section>
      <div class="text-h6">
        Setlist {{ $date(store.service.date) }}
      </div>
    </q-card-section>

    <q-fab color="primary" icon="add" direction="down" class="absolute" style="top: 20px; right: 20px;">
      <q-fab-action color="secondary" icon="menu_book" external-label label-position="left" label="Bijbeltekst toevoegen" />
      <q-fab-action color="secondary" icon="description" external-label label-position="left" label="Lied toevoegen" @click="openEditSongDialog" />
    </q-fab>

    <q-separator />

    <q-list>
      <Song
        v-for="(song, i) in store.service.songs"
        :key="i"
        :song="song"
        :nr="i + 1"
        :color="colors[i % 7]"
        :active="store.previewSong === song"
        @click="select(song)"
      />
    </q-list>

    <EditSongDialog ref="editSongDialog" />
  </q-card>
</template>

<script>
import useServiceStore from 'stores/service'
import EditSongDialog from './EditSongDialog.vue'
import Song from './Song.vue'

export default {
  components: { EditSongDialog, Song },
  setup () {
    const store = useServiceStore()
    return { store }
  },
  computed: {
    colors () {
      return ['primary', 'secondary', 'accent', 'positive', 'negative', 'info', 'warning']
    }
  },
  methods: {
    select (song) {
      this.store.previewSong = song
    },
    openEditSongDialog () {
      this.$refs.editSongDialog.show()
    }
  }
}
</script>
