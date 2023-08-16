<template>
  <q-dialog ref="dialogAddDatabase" persistent square>
    <q-card>
      <q-toolbar class="bg-secondary text-white">
        <q-toolbar-title>
          <span>Liedtekst vergelijken/toevoegen met lokale database</span>
        </q-toolbar-title>
        <q-btn v-close-popup flat round dense icon="close" />
      </q-toolbar>
      <q-toolbar class="bg-grey-3 text-dark">
        <q-toolbar-title class="text-subtitle2 row">
          Nieuw lied
          <q-space />
          <q-inner-loading :showing="isLoading" />
          versie lied in database
        </q-toolbar-title>
      </q-toolbar>

      <div v-if="noNewSongs" class="row q-pa-md q-gutter-md">
        Geen nieuwe liederen gevonden om aan database toe te voegen
      </div>

      <div class="row q-pa-md q-gutter-md">
        <q-list class="col q-pt-sm songlist">
          <div v-for="(song, index) in songs" :key="song.id" class="row">
            <template v-if="songsTodoIndex[index] > -3">
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
                  :song-diffs="songsSearchCountDiff[index]"
                  :song-todo-index="songsTodoIndex[index]"
                  :active="selectedId === song.id"
                  @click="select(song)"
                  @set-index="(i) => songsTodoIndex[index] = i"
                />
              </div>
            </template>
          </div>
        </q-list>
      </div>

      <q-separator />

      <div v-if="selectedId" class="row q-pa-md q-gutter-md">
        <SongLyricsView
          v-if="view.new"
          :title="newTitle"
          :collection-number="newCollectionNumber"
          :lyrics="newLyrics"
          :lyrics-translation="newLyricsTranslation"
          class="col"
        />
        <SongLyricsView
          v-if="view.diff"
          :title="compareTitle"
          :collection-number="compareCollectionNumber"
          :lyrics="compareLyrics"
          :lyrics-translation="compareLyricsTranslation"
          show-diff
          class="col"
        />
        <SongLyricsView
          v-if="view.db"
          :title="databaseTitle"
          :collection-number="databaseCollectionNumber"
          :lyrics="databaseLyrics"
          :lyrics-translation="databaseLyricsTranslation"
          class="col"
        />
      </div>

      <q-separator />

      <q-card-actions align="right">
        <template v-if="selectedId">
          Voorbeeld:
          <q-toggle v-model="view.new" label="nieuw" />
          <q-toggle v-model="view.diff" label="verschil" />
          <q-toggle v-model="view.db" label="database" />
          <q-space />
          ({{ countDiff }})
        </template>
        <template v-else>
          Selecteer om voorbeeld / verschil te zien
        </template>
        <q-space />
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
import dayjs from 'dayjs'
import { HtmlDiff, CountDiff } from '../../common/HtmlDiff.js'
import { Notify } from 'quasar'

export default {
  components: { SongItem, SongLyricsView, SongItemDatabase },
  data () {
    return {
      songs: [],
      songsSearchResults: [],
      songsSearchCountDiff: [],
      songsTodoIndex: [], // -3 = exist in db, no add; -2 = no add; -1 = add; 0, 1 etc = change
      noNewSongs: true,
      selected: {},
      view: {
        new: true,
        diff: true,
        db: false
      },
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
        this.selectedIndex < this.songsSearchCountDiff.length &&
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
    countDiff () {
      if (this.selectedIndex < this.songsSearchResults.length &&
        this.selectedIndex < this.songsSearchCountDiff.length &&
        this.selectedIndex < this.songsTodoIndex.length &&
        this.songsTodoIndex[this.selectedIndex] >= 0 &&
        this.songsSearchCountDiff[this.selectedIndex][this.songsTodoIndex[this.selectedIndex]].text) {
        const diff = this.songsSearchCountDiff[this.selectedIndex][this.songsTodoIndex[this.selectedIndex]]
        return `tekst: +${diff.text.ins} -${diff.text.del} | vertaling: +${diff.translation.ins} -${diff.translation.del}`
      }
      // leeg
      return ''
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
      this.isLoading = true
      // reset
      this.songs = []
      this.songsSearchResults = []
      this.songsTodoIndex = []
      this.noNewSongs = true
      this.selected = {}
      this.$refs.dialogAddDatabase.show()

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
      this.addToDatabase()
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
      // reset results
      this.songsSearchResults = []
      this.songsSearchCountDiff = []
      this.songsTodoIndex = []
      // search database
      this.songs.forEach(song => {
        const databaseSong = this.filterSearchSongInDatabase(song.settings) || []
        const countDiff = []
        // get diff count
        for (let i = 0; i < databaseSong.length; i++) {
          const textDiff = CountDiff(HtmlDiff(databaseSong[i].lyrics, song.settings.text))
          const translationDiff = CountDiff(HtmlDiff(databaseSong[i].lyricstranslate, song.settings.translation))
          const count = textDiff.ins + textDiff.del + translationDiff.ins + translationDiff.del
          countDiff.push({ text: textDiff, translation: translationDiff, count })
        }
        let j = -1 // -1 (add) if no database else index nr 0, 1 db result (replace)
        // search best result
        for (let i = 0; i < countDiff.length; i++) {
          if (i === 0) {
            j = i
            continue
          }
          if (countDiff[i].count < countDiff[j].count) { j = i }
        }
        // if exactly
        if (countDiff[j]?.count === 0) {
          if (databaseSong[j].title === song.settings.title &&
          databaseSong[j].collection === song.settings.collection &&
          databaseSong[j].number === song.settings.number &&
          databaseSong[j].lyrics === song.settings.text &&
          databaseSong[j].lyricstranslate === song.settings.translation
          ) {
            j = -3 // exist in database --> no add
          } else {
            this.noNewSongs = false
          }
        } else {
          this.noNewSongs = false
        }
        // add result
        this.songsSearchResults.push(databaseSong)
        this.songsSearchCountDiff.push(countDiff)
        this.songsTodoIndex.push(j)
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

      // equal title (lowercase) // deel achter titel niet mee nemen wanner tussen... /^[^([{<|\\/>}\])]*/
      filteredSongDatabase = this.$fsdb.localSongDatabase
        .filter(songTitle => songTitle.title?.match(/^[^([{<|\\/>}\])]*/)[0].trim().toLowerCase() === settings.title?.trim().match(/^[^([{<|\\/>}\])]*/)[0].toLowerCase())
      if (filteredSongDatabase.length > 0) { return filteredSongDatabase }

      /*
      // equal title (lowercase)
      filteredSongDatabase = this.$fsdb.localSongDatabase
        .filter(songTitle => songTitle.title?.trim().toLowerCase() === settings.title?.trim().toLowerCase())
      if (filteredSongDatabase.length > 0) { return filteredSongDatabase }
      */

      // equal collection, no.  (lowercase) (wanneer ingevuld)
      if (settings.collection?.trim() && settings.number?.trim()) {
        filteredSongDatabase = this.$fsdb.localSongDatabase
          .filter(songCol => songCol.collection?.trim().toLowerCase() === settings.collection?.trim().toLowerCase())
          .filter(songNumber => songNumber.number?.trim().toLowerCase() === settings.number?.trim().toLowerCase())
        if (filteredSongDatabase.length > 0) { return filteredSongDatabase }
      }

      // title includes (lowercase)
      filteredSongDatabase = this.$fsdb.localSongDatabase
        .filter(songTitle =>
          songTitle.title?.trim().toLowerCase().includes(settings.title?.trim().toLowerCase()) ||
          settings.title?.trim().toLowerCase().includes(songTitle.title?.trim().toLowerCase())
        )
      if (filteredSongDatabase.length > 0) { return filteredSongDatabase }

      // no match --> empty
      return filteredSongDatabase
    },
    addToDatabase () {
      const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
      const creator = 'Naam'

      for (let i = 0; i < this.songs.length; i++) {
        const todoIndex = this.songsTodoIndex[i]
        if (todoIndex > -2) {
          const addSong = {
            id: this.songs[i].id, // controle op bestaat toevoegen? nieuwe maken?
            title: this.songs[i].settings.title,
            collection: this.songs[i].settings.collection,
            number: this.songs[i].settings.number,
            lyrics: this.songs[i].settings.text,
            lyricstranslate: this.songs[i].settings.translation,
            creator,
            created_at: now,
            updated_at: now
          }
          switch (todoIndex) {
            case undefined: break
            case -1: // add
              this.$fsdb.localSongDatabase.push(addSong)
              break
            default: {
              const dbResultId = this.songsSearchResults[i][todoIndex].id
              const dbIndex = this.$fsdb.localSongDatabase.indexOf(s => s.id === dbResultId)
              if (dbIndex !== -1) {
                addSong.id = this.$fsdb.localSongDatabase[dbIndex].id
                addSong.created_at = this.$fsdb.localSongDatabase[dbIndex].created_at
                this.$fsdb.localSongDatabase[dbIndex] = addSong
              } else {
                this.$fsdb.localSongDatabase.push(addSong)
              }
            }
          }
        }
      }
    }
  }
}

</script>

<style scoped lang="scss">
.q-card {
  min-width: max(75vw, min(1440px, 95vw));
  height: 95vh;

  .songlist {
    max-height: 33vh;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .q-card {
    min-width: 0;
    height: 38vh;
  }
}
</style>
