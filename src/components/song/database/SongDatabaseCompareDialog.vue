<template>
  <q-dialog ref="dialogAddDatabase" persistent square>
    <q-card>
      <q-toolbar class="bg-secondary text-white">
        <q-toolbar-title>
          <span>Liedtekst vergelijken/toevoegen met lokale database</span>
        </q-toolbar-title>
        <q-btn v-close-popup flat round dense icon="close" />
      </q-toolbar>

      <div class="row q-pa-md q-gutter-md">
        <q-list class="col q-pt-sm songlist">
          <div v-for="(song, index) in songs" :key="song.id" class="row">
            <div class="col">
              <SongItem
                :new-song="song"
                :song-todo-index="songsTodoIndex[index]"
                :active="selectedId === song.id"
                @click="select(song)"
                @add="songsTodoIndex[index] = -1"
                @change="change(index)"
                @remove="songsTodoIndex[index] = -2"
              />
            </div>
            <div class="col">
              <SongItemDatabase
                v-if="songsSearchResults[index]"
                :song-databases="songsSearchResults[index]"
                :song-todo-index="songsTodoIndex[index]"
                :active="selectedId === song.id"
                @click="select(song)"
                @set-index="(i) => songsTodoIndex[index] = i"
              />
            </div>
          </div>
        </q-list>
      </div>

      <q-separator />

      <div v-if="selectedId" class="row q-pa-md q-gutter-md">
        <SongLyricsView
          :title="newTitle"
          :collection-number="newCollectionNumber"
          :lyrics="newLyrics"
          :lyrics-translation="newLyricsTranslation"
          class="col"
        />
        <SongLyricsView
          :title="compareTitle"
          :collection-number="compareCollectionNumber"
          :lyrics="compareLyrics"
          :lyrics-translation="compareLyricsTranslation"
          show-diff
          class="col"
        />
        <SongLyricsView
          :title="databaseTitle"
          :collection-number="databaseCollectionNumber"
          :lyrics="databaseLyrics"
          :lyrics-translation="databaseLyricsTranslation"
          class="col"
        />
      </div>

      <q-separator />

      <q-card-actions align="right">
        <q-btn color="secondary" label="Opslaan in database" @click.stop="save">
          <q-tooltip>Geselecteerde liederen toevoegen, vervangen & opslaan in database</q-tooltip>
        </q-btn>
        <q-btn color="secondary" label="Annuleren" @click.stop="hide">
          <q-tooltip>Wijzigingen niet toepassen</q-tooltip>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import SongItem from './SongItem.vue'
import SongItemDatabase from './SongItemDatabase.vue'
import SongLyricsView from './SongLyricsView.vue'
import { HtmlDiff } from '../../common/HtmlDiff.js'
import { Notify } from 'quasar'

export default {
  components: { SongItem, SongLyricsView, SongItemDatabase },
  props: {
  },
  emits: [
  ],
  data () {
    return {
      songs: [],
      songsSearchResults: [],
      songsTodoIndex: [], // -2 = no add; -1 = add; 0, 1 etc = change
      selected: {},
      isLoading: false
    }
  },
  computed: {
    selectedId () {
      return this.selected?.id || ''
    },
    selectedIndex () {
      return this.songs.findIndex(s => s.id === this.selectedId)
    },
    selectedDatabase () {
      if (this.selectedIndex < this.songsSearchResults.length &&
        this.selectedIndex < this.songsTodoIndex.length &&
        this.songsTodoIndex[this.selectedIndex] >= 0 &&
        this.songsSearchResults[this.selectedIndex][this.songsTodoIndex[this.selectedIndex]].title) {
        return this.songsSearchResults[this.selectedIndex][this.songsTodoIndex[this.selectedIndex]]
      }
      // leeg
      return { }
    },
    newTitle () {
      return this.selected?.settings.title || ''
    },
    databaseTitle () {
      return this.selectedDatabase.title || ''
    },
    compareTitle () {
      return HtmlDiff(this.databaseTitle, this.newTitle)
    },
    newCollectionNumber () {
      if (this.selected?.settings.collection && this.selected?.settings.number) { return `${this.selected.settings.collection} ${this.selected.settings.number}` }
      if (this.selected?.settings.collection) { return this.selected.settings.collection }
      if (this.selected?.settings.number) { return this.selected.settings.number }
      return ''
    },
    databaseCollectionNumber () {
      if (this.selectedDatabase.collection && this.selectedDatabase.number) { return `${this.selectedDatabase.collection} ${this.selectedDatabase.number}` }
      if (this.selectedDatabase.collection) { return this.selectedDatabase.collection }
      if (this.selectedDatabase.number) { return this.selectedDatabase.number }
      return ''
    },
    compareCollectionNumber () {
      return HtmlDiff(this.databaseCollectionNumber, this.newCollectionNumber)
    },
    newLyrics () {
      return this.selected?.settings.text.replace(/\r?\n/g, '<br>') || ''
    },
    databaseLyrics () {
      return this.selectedDatabase.lyrics?.replace(/\r?\n/g, '<br>') || ''
    },
    compareLyrics () {
      return HtmlDiff(this.databaseLyrics, this.newLyrics)
    },
    newLyricsTranslation () {
      return this.selected?.settings.translation.replace(/\r?\n/g, '<br>') || ''
    },
    databaseLyricsTranslation () {
      return this.selectedDatabase.lyricstranslate?.replace(/\r?\n/g, '<br>') || ''
    },
    compareLyricsTranslation () {
      return HtmlDiff(this.databaseLyricsTranslation, this.newLyricsTranslation)
    }
  },
  methods: {
    async show () {
      // reset
      this.songs = []
      this.songsSearchResults = []
      this.songsTodoIndex = []
      this.selected = {}
      this.$refs.dialogAddDatabase.show()

      this.isLoading = true
      // get songs setlist
      this.songs = this.$store.service.presentations.filter(t => t.type === 'song')
      if (this.songs.length < 1) {
        this.hide()
        return Notify.create({ type: 'negative', message: 'geen liederen in setlist gevonden', position: 'top' })
      }
      // open database
      if (!this.$fsdb.localSongDatabase) {
        if (!(await this.$fsdb.openSongDatabase())) {
          // geen database geselecteerd
          // vragen om nieuwe te maken?
          // nog uitzoeken, ga voor nu uit dat er een database is.
          this.hide()
        }
      }
      // database is open of lege gemaakt
      // zoek liederen in database die meest op setlist liederen lijken of niet gevonden
      this.searchSongs()
      this.isLoading = false
    },
    hide () {
      this.$refs.dialogAddDatabase.hide()
    },
    save () {
      // save database, nog uitwerken
    },
    select (presentation) {
      this.selected = presentation
    },
    change (index) {
      if (this.songsTodoIndex[index] >= 0) return
      this.songsTodoIndex[index] = this.songsSearchResults[index]?.length ? 0 : -1
    },
    searchSongs () {
      this.songsSearchResults = []
      this.songsTodoIndex = []
      this.songs.forEach(song => {
        const databaseSong = this.filterSearchSongInDatabase(song.settings) || []
        this.songsSearchResults.push(databaseSong)
        this.songsTodoIndex.push(databaseSong.length < 1 ? -1 : 0) // -1 (add) if no database else first result (replace)
      })
    },
    filterSearchSongInDatabase (settings) {
      /* JSON
      {
        "id":"2",
        "title":"Namen van God",
        "collection":null,
        "number":null,
        "lyrics":"chorus\nWonderbare raadsman\n\nGoddelijke held\n\nEeuwige vader\n\nVredevorst\n\nJezus",
        "lyricstranslate":"",
        "creator":"ew-import",
        "created_at":"2022-06-15 15:30:28",
        "updated_at":null
      }
      */
      // exactly the same
      let filteredSongDatabase = this.$fsdb.localSongDatabase
        .filter(songTitle => songTitle.title === settings.title)
        .filter(songCol => songCol.collection === settings.collection)
        .filter(songNumber => songNumber.number === settings.number)
        .filter(songText => songText.lyrics === settings.text)
        .filter(songTranslation => songTranslation.lyricstranslate === settings.translation)
      if (filteredSongDatabase.length > 0) { return filteredSongDatabase }

      // all equal (lowercase)
      filteredSongDatabase = this.$fsdb.localSongDatabase
        .filter(songTitle => songTitle.title?.trim().toLowerCase() === settings.title?.trim().toLowerCase())
        .filter(songCol => songCol.collection?.trim().toLowerCase() === settings.collection?.trim().toLowerCase())
        .filter(songNumber => songNumber.number?.trim().toLowerCase() === settings.number?.trim().toLowerCase())
        .filter(songText => songText.lyrics?.trim().toLowerCase() === settings.text?.trim().toLowerCase())
        .filter(songTranslation => songTranslation.lyricstranslate?.trim().toLowerCase() === settings.translation?.trim().toLowerCase())
      if (filteredSongDatabase.length > 0) { return filteredSongDatabase }

      // equal whitout translation (lowercase)
      filteredSongDatabase = this.$fsdb.localSongDatabase
        .filter(songTitle => songTitle.title?.trim().toLowerCase() === settings.title?.trim().toLowerCase())
        .filter(songCol => songCol.collection?.trim().toLowerCase() === settings.collection?.trim().toLowerCase())
        .filter(songNumber => songNumber.number?.trim().toLowerCase() === settings.number?.trim().toLowerCase())
        .filter(songText => songText.lyrics?.trim().toLowerCase() === settings.text?.trim().toLowerCase())
        .filter(songTranslation => songTranslation.lyricstranslate?.trim().toLowerCase() === settings.translation?.trim().toLowerCase())
      if (filteredSongDatabase.length > 0) { return filteredSongDatabase }

      // equal title, collection, no. (lowercase)
      filteredSongDatabase = this.$fsdb.localSongDatabase
        .filter(songTitle => songTitle.title?.trim().toLowerCase() === settings.title?.trim().toLowerCase())
        .filter(songCol => songCol.collection?.trim().toLowerCase() === settings.collection?.trim().toLowerCase())
        .filter(songNumber => songNumber.number?.trim().toLowerCase() === settings.number?.trim().toLowerCase())
      if (filteredSongDatabase.length > 0) { return filteredSongDatabase }

      // equal title (lowercase)
      filteredSongDatabase = this.$fsdb.localSongDatabase
        .filter(songTitle => songTitle.title?.trim().toLowerCase() === settings.title?.trim().toLowerCase())
      if (filteredSongDatabase.length > 0) { return filteredSongDatabase }

      // equal collection, no.  (lowercase) (wanneer ingevuld)
      if (settings.collection?.trim() && settings.number?.trim()) {
        filteredSongDatabase = this.$fsdb.localSongDatabase
          .filter(songCol => songCol.collection?.trim().toLowerCase() === settings.collection?.trim().toLowerCase())
          .filter(songNumber => songNumber.number?.trim().toLowerCase() === settings.number?.trim().toLowerCase())
        if (filteredSongDatabase.length > 0) { return filteredSongDatabase }
      }

      // title includes (lowercase) // misschien wijzigen in zoeken vanaf /^[^([{<|\\/>}\])]*/
      filteredSongDatabase = this.$fsdb.localSongDatabase
        .filter(songTitle =>
          songTitle.title?.trim().toLowerCase().includes(settings.title?.trim().toLowerCase()) ||
          settings.title?.trim().toLowerCase().includes(songTitle.title?.trim().toLowerCase())
        )
      if (filteredSongDatabase.length > 0) { return filteredSongDatabase }

      // deze of ipv boven; nazien wat nu handig is. of misschien controle op hoeveel tekst er overeen komt
      // title includes (lowercase) // misschien wijzigen in zoeken vanaf begin? /^[^([{<|\\/>}\])]*/
      filteredSongDatabase = this.$fsdb.localSongDatabase
        .filter(songTitle =>
          songTitle.title?.match(/^[^([{<|\\/>}\])]*/)[0].trim().toLowerCase() === settings.title?.trim().toLowerCase()
        )
      if (filteredSongDatabase.length > 0) { return filteredSongDatabase }

      // no match --> empty
      return filteredSongDatabase
    }
  }
}

</script>

<style scoped lang="scss">
.q-card {
  min-width: max(60vw, min(1152px, 95vw));
  min-height: 80vh;

  .songlist {
    max-height: 30vh;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .q-card {
    min-width: 0;
    min-height: 15vh;
  }
}
</style>
