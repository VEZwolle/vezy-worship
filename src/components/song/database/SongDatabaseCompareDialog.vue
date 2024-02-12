<template>
  <q-dialog ref="dialogAddDatabase" persistent square>
    <q-card>
      <q-toolbar class="bg-secondary text-white">
        <q-toolbar-title>
          <span>Liedtekst vergelijken met {{ $store.searchBaseIsLocal ? 'lokale database' : `cloud database "${algoliaActiveDatabaseName}"` }}</span>
          <q-inner-loading :showing="isLoading" />
        </q-toolbar-title>
        <q-btn v-close-popup flat round dense icon="close" />
      </q-toolbar>

      <div class="q-pa-md">
        <div class="text-h6">
          Gevonden liederen met overeenkomsten in de database:
        </div>
        <div ref="listDiff" class="row">
          <div class="col-auto">
            <SongItemDatabase
              v-if="songsSearchResults[0]"
              :song-databases="songsSearchResults[0]"
              :song-diffs="songsSearchCountDiff[0]"
              :song-todo-index="songsTodoIndex[0]"
              :width="SongItemDatabaseWidth"
              icon="lyrics"
              @set-index="(i) => songsTodoIndex[0] = i"
            />
          </div>
          <div class="col">
            <q-badge v-if="songsTodoIndex[0] < 0">
              Geen versie met meer dan<br>
              40% overeenkomst gevonden
            </q-badge>
          </div>
        </div>
      </div>

      <q-separator color="secondary" class="q-mx-md" />

      <div v-if="selectedId" class="q-pa-md">
        <SongLyricsViews
          :new-title="newTitle"
          :new-collection-number="newCollectionNumber"
          :new-lyrics="newLyrics"
          :new-lyrics-translation="newLyricsTranslation"
          :compare-title="compareTitle"
          :compare-collection-number="compareCollectionNumber"
          :compare-lyrics="compareLyrics"
          :compare-lyrics-translation="compareLyricsTranslation"
          :database-title="databaseTitle"
          :database-collection-number="databaseCollectionNumber"
          :database-lyrics="databaseLyrics"
          :database-lyrics-translation="databaseLyricsTranslation"
          :tabs="tabs"
          tab="newDiff"
          lyrics-height="36.5"
        />
      </div>

      <q-separator />
      <q-card-actions align="right">
        <div v-if="selectedId" class="text-grey-5">
          Overeenkomst: text: {{ countDifftext }} | vertaling: {{ countDiffTrans }}
        </div>

        <q-space />

        <q-btn color="secondary" :disable="songsTodoIndex[0] < 0" label="Gebruik database versie" @click.stop="useDatabase">
          <q-tooltip>Gebruik de geselecteerde versie uit de database</q-tooltip>
        </q-btn>
        <q-btn color="secondary" label="Sluiten" @click.stop="hide" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import BaseSongDatabaseCompare from './BaseSongDatabaseCompare.vue'

export default {
  extends: BaseSongDatabaseCompare,
  data () {
    return {
      tabs: [
        { name: 'newDiff', label: 'Liedtekst & Verschil' },
        { name: 'diffDb', label: 'Verschil & Database versie' }
      ],
      SongItemDatabaseWidth: 500,
      presentation: null
    }
  },
  methods: {
    async show (song) {
      this.isLoading = true
      this.presentation = song
      if (!this.presentation.id) this.presentation.id = 'tempSongCompare'
      // reset
      this.songsSearchResults = []
      this.songsTodoIndex = []
      this.noNewSongs = true
      this.selected = {}
      this.songs = [this.presentation]
      this.$refs.dialogAddDatabase.show()

      if (this.songs.length < 1) {
        this.hide()
      }
      this.$nextTick(() => { this.setListDiffWidth() })
      // open database
      if (this.$store.searchBaseIsLocal && !this.$fsdb.localSongDatabase) {
        if (!(await this.$fsdb.openSongDatabase())) {
          // geen database geselecteerd of error bij opgeslagen versie
          this.$q.notify({ type: 'negative', message: 'geen database gevonden' })
          this.hide()
          return
        }
      }
      // database is open or cloud
      // search songs in database most similar to setlist songs or not found
      if (!(await this.searchSongs())) return this.hide()
      this.select(this.presentation)
      if (this.noNewSongs) {
        this.$q.notify({ type: 'positive', message: 'Lied is exact gelijk aan de database versie', position: 'top' })
        this.hide()
        return
      }
      this.isLoading = false
    },
    hide () {
      this.$refs.dialogAddDatabase.hide()
      if (this.presentation.id === 'tempSongCompare') this.presentation.id = ''
    },
    useDatabase () {
      if (this.presentation.settings) {
        this.presentation.settings.title = this.selectedDatabase.title || ''
        this.presentation.settings.collection = this.selectedDatabase.collection || ''
        this.presentation.settings.number = this.selectedDatabase.number || ''
        this.presentation.settings.text = this.selectedDatabase.lyrics || ''
        this.presentation.settings.translation = this.selectedDatabase.lyricstranslate || ''
        this.hide()
      }
    },
    setListDiffWidth () {
      this.SongItemDatabaseWidth = this.$refs.listDiff?.clientWidth * 0.5 || 400
    }
  }
}
</script>

<style scoped lang="scss">
.q-card {
  min-width: max(60vw, min(1152px, 95vw));
  height: 80vh;
}
</style>
