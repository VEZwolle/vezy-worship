<template>
  <q-dialog ref="dialogAddDatabase" persistent square>
    <q-card>
      <q-toolbar class="bg-secondary text-white">
        <q-toolbar-title>
          <span>Liedtekst vergelijken/toevoegen met lokale database</span>
        </q-toolbar-title>
        <q-btn v-close-popup flat round dense icon="close" />
      </q-toolbar>
      <q-splitter
        v-model="splitterModel"
        @update:model-value="setListDiffWidth"
      >
        <template #before>
          <q-toolbar class="bg-grey-3 text-dark">
            <q-toolbar-title class="text-subtitle2 row">
              Nieuw lied
              <q-space />
              <q-inner-loading :showing="isLoading" />
              versie lied in database
            </q-toolbar-title>
          </q-toolbar>

          <div v-if="noNewSongs && !isLoading" class="row q-pa-md q-gutter-md">
            Geen nieuwe liederen gevonden om aan database toe te voegen
          </div>

          <div ref="listDiff" class="row q-gutter-md">
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
                      @edit="edit(song)"
                    />
                  </div>
                  <div class="col">
                    <SongItemDatabase
                      v-if="songsSearchResults[index]"
                      :song-databases="songsSearchResults[index]"
                      :song-diffs="songsSearchCountDiff[index]"
                      :song-todo-index="songsTodoIndex[index]"
                      :active="selectedId === song.id"
                      :width="SongItemDatabaseWidth"
                      @click="select(song)"
                      @set-index="(i) => songsTodoIndex[index] = i"
                    />
                  </div>
                </template>
              </div>
            </q-list>
          </div>
        </template>

        <template #after>
          <q-toolbar class="bg-grey-3 text-dark">
            <q-toolbar-title class="text-subtitle2 row">
              <template v-if="selectedId">
                <div>
                  text: {{ countDiff }}
                </div>
                <q-space />
                <div>
                  vertaling: {{ countDiffTrans }}
                </div>
              </template>
              <template v-else>
                Selecteer om voorbeeld / verschil te zien
              </template>
            </q-toolbar-title>
          </q-toolbar>
          <div v-if="selectedId">
            <q-tabs v-model="lyricsTab" class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator :breakpoint="0">
              <q-tab name="new" label="Nieuw" />
              <q-tab name="newDiff" label="N + V" />
              <q-tab name="diff" label="Verschil" />
              <q-tab name="diffDb" label="V + D" />
              <q-tab name="db" label="Database" />
            </q-tabs>
            <q-separator />
            <q-tab-panels v-model="lyricsTab" animated>
              <q-tab-panel name="new">
                <SongLyricsView
                  :title="newTitle"
                  :collection-number="newCollectionNumber"
                  :lyrics="newLyrics"
                  :lyrics-translation="newLyricsTranslation"
                  class="col"
                />
              </q-tab-panel>
              <q-tab-panel name="newDiff">
                <div class="row">
                  <SongLyricsView
                    :title="newTitle"
                    :collection-number="newCollectionNumber"
                    :lyrics="newLyrics"
                    :lyrics-translation="newLyricsTranslation"
                    class="col"
                  />
                  <q-separator vertical color="secondary" class="q-mx-md" />
                  <SongLyricsView
                    :title="compareTitle"
                    :collection-number="compareCollectionNumber"
                    :lyrics="compareLyrics"
                    :lyrics-translation="compareLyricsTranslation"
                    show-diff
                    class="col"
                  />
                </div>
              </q-tab-panel>
              <q-tab-panel name="diff">
                <SongLyricsView
                  :title="compareTitle"
                  :collection-number="compareCollectionNumber"
                  :lyrics="compareLyrics"
                  :lyrics-translation="compareLyricsTranslation"
                  show-diff
                  class="col"
                />
              </q-tab-panel>
              <q-tab-panel name="diffDb">
                <div class="row">
                  <SongLyricsView
                    :title="compareTitle"
                    :collection-number="compareCollectionNumber"
                    :lyrics="compareLyrics"
                    :lyrics-translation="compareLyricsTranslation"
                    show-diff
                    class="col"
                  />
                  <q-separator vertical color="secondary" class="q-mx-md" />
                  <SongLyricsView
                    :title="databaseTitle"
                    :collection-number="databaseCollectionNumber"
                    :lyrics="databaseLyrics"
                    :lyrics-translation="databaseLyricsTranslation"
                    class="col"
                  />
                </div>
              </q-tab-panel>
              <q-tab-panel name="db">
                <SongLyricsView
                  :title="databaseTitle"
                  :collection-number="databaseCollectionNumber"
                  :lyrics="databaseLyrics"
                  :lyrics-translation="databaseLyricsTranslation"
                  class="col"
                />
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </template>
      </q-splitter>

      <q-separator />
      <q-card-actions align="right">
        <div class="q-pr-md">
          Hele lijst:
        </div>
        <q-btn color="secondary" label="Uitzetten" :disable="songsTodoIndex.length === 0" @click.stop="setAction(-2)">
          <q-tooltip>Alle liederen uitzetten voor importeren</q-tooltip>
        </q-btn>
        <q-btn color="secondary" label="Toevoegen" :disable="songsTodoIndex.length === 0" @click.stop="setAction(-1)">
          <q-tooltip>Alle liederen toevoegen aan database</q-tooltip>
        </q-btn>
        <q-btn color="secondary" label="Vervangen" :disable="songsSearchCountDiff.length === 0" @click.stop="setAction(0)">
          <q-tooltip>Alle liederen vervangen in database met > 40% overeenkomst <br>(of toevoegen bij kleiner)</q-tooltip>
        </q-btn>
        <q-space />
        <q-btn-dropdown
          color="secondary"
          split
          icon="save"
          label="Opslaan in database"
          :disable="!changesDatabase"
          :loading="isSaving"
          @click.stop="save(false)"
        >
          <template #label>
            label
            <q-tooltip>Geselecteerde liederen toevoegen, vervangen & opslaan in database</q-tooltip>
          </template>
          <q-list>
            <q-item v-close-popup clickable @click.stop="save(true)">
              <q-item-section>
                <q-item-label>Opslaan als</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn color="secondary" label="Sluiten" @click.stop="hide">
          <q-tooltip>Wijzigingen niet toepassen</q-tooltip>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
  <PresentationSettingsDialog ref="presentationSettingsDialog" />
</template>

<script>
import SongItem from './SongItem.vue'
import SongItemDatabase from './SongItemDatabase.vue'
import SongLyricsView from './SongLyricsView.vue'
import { splitSong } from '../SongControl.vue'
import PresentationSettingsDialog from '../../presentation/PresentationSettingsDialog.vue'
import dayjs from 'dayjs'
import { HtmlDiff, CountDiff } from '../../common/HtmlDiff.js'
import { Notify } from 'quasar'
import cloneDeep from 'lodash/cloneDeep'

export default {
  components: { SongItem, SongLyricsView, SongItemDatabase, PresentationSettingsDialog },
  data () {
    return {
      songs: [],
      songsSearchResults: [],
      songsSearchCountDiff: [],
      songsTodoIndex: [], // -3 = exist in db, no add; -2 = no add; -1 = add; 0, 1 etc = change
      noNewSongs: true,
      selected: {},
      splitterModel: 70,
      SongItemDatabaseWidth: 500,
      lyricsTab: 'diff',
      isLoading: false,
      isSaving: false
    }
  },
  computed: {
    changesDatabase () {
      return this.songsTodoIndex.filter(i => i >= -1).length
    },
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
      return '&nbsp;'
    },
    databaseCollectionNumber () {
      if (this.selectedDatabase.collection && this.selectedDatabase.number) { return `${this.selectedDatabase.collection} ${this.selectedDatabase.number}` }
      if (this.selectedDatabase.collection) { return this.selectedDatabase.collection }
      if (this.selectedDatabase.number) { return this.selectedDatabase.number }
      return '&nbsp;'
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
      const diff = CountDiff(this.compareLyrics)
      return `+${diff.ins} -${diff.del} (${diff.factor100.toFixed(0)}%)`
    },
    countDiffTrans () {
      const diff = CountDiff(this.compareLyricsTranslation)
      return `+${diff.ins} -${diff.del} (${diff.factor100.toFixed(0)}%)`
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
      this.$nextTick(() => { this.setListDiffWidth() })
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
    save (newFile = false) {
      this.isSaving = true
      // backup this.$fsdb.localSongDatabase
      const backupSongDatabase = cloneDeep(this.$fsdb.localSongDatabase)
      this.addToDatabase()
      // save database, nog uitwerken
      this.$fsdb.saveSongDatabase(newFile) // true = gelukt, false = niet gelukt
        .then((result) => {
          if (!result) { this.$fsdb.localSongDatabase = cloneDeep(backupSongDatabase) }
        })
        .finally(() => {
          this.isSaving = false
        })
    },
    select (presentation) {
      this.selected = presentation
    },
    change (index, factor = 0) {
      // no change if database replace
      if (this.songsTodoIndex[index] >= 0) return
      // add if no database found
      if (!this.songsSearchResults[index]?.length) {
        this.songsTodoIndex[index] = -1
        return
      }
      // search best result
      let j = -1 // -1 (add) if no database else index nr 0, 1 db result (replace)
      for (let i = 0; i < this.songsSearchCountDiff[index].length; i++) {
        if (i === 0) {
          j = i
          continue
        }
        if (this.songsSearchCountDiff[index][i].factor200 > this.songsSearchCountDiff[index][j].factor200) { j = i }
      }
      if (this.songsSearchCountDiff[index][j]?.text.factor100 < factor) { j = -1 } // less than 40%(factor) similarity text, probably different song --> add
      this.songsTodoIndex[index] = j
    },
    searchSongs () {
      // reset results
      this.songsSearchResults = []
      this.songsSearchCountDiff = []
      this.songsTodoIndex = []
      // search database
      this.songs.forEach(song => {
        const databaseSong = this.filterSearchSongInDatabase(song.settings).slice(0, 9) || [] // max 0 results pro song
        const countDiff = []
        // get diff count
        for (let i = 0; i < databaseSong.length; i++) {
          const textDiff = CountDiff(HtmlDiff(databaseSong[i].lyrics, song.settings.text))
          const translationDiff = CountDiff(HtmlDiff(databaseSong[i].lyricstranslate, song.settings.translation))
          const factor200 = textDiff.factor100 + translationDiff.factor100
          countDiff.push({ text: textDiff, translation: translationDiff, factor200 })
        }
        let j = -1 // -1 (add) if no database else index nr 0, 1 db result (replace)
        // search best result
        for (let i = 0; i < countDiff.length; i++) {
          if (i === 0) {
            j = i
            continue
          }
          if (countDiff[i].factor200 > countDiff[j].factor200) { j = i }
        }
        if (countDiff[j]?.text.factor100 < 40) { j = -1 } // less than 50% similarity text, probably different song --> add
        // if exactly
        if (countDiff[j]?.factor200 > 190) { // check if te same
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
    getTextLines (lyrics) {
      // return 2 lines off te lyrics with more ten 8 char
      const sections = splitSong(lyrics, 100)
      const lines = []
      for (let i = sections.length > 1 ? 1 : 0; i < sections.length; i++) {
        // sla 1e over, vaak een titel intro tenzij maar 1 section
        for (let j = 0; j < sections[i].slides[0].length; j++) {
          const line = sections[i].slides[0][j].trim().replace(/[.,;?!:]$/g, '').trim()
          if (line.length < 8) continue // zoek een langere regel
          lines.push(line.toLowerCase())
          if (lines.length > 1) break // na 2 regels stoppen
        }
        if (lines.length > 1) break // na 2 regels stoppen
      }
      console.log(lines)
      return lines
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

      const title = settings.title?.trim().toLowerCase()
      const collection = settings.collection?.trim().toLowerCase()
      const number = settings.number?.trim().toLowerCase()
      const text = settings.text?.trim().toLowerCase()
      const translation = settings.translation?.trim().toLowerCase()

      // equal title, collection, no. (lowercase) [first more detail before return]
      const filteredSongDatabaseTCN = this.$fsdb.localSongDatabase
        .filter(songTitle => songTitle.title?.trim().toLowerCase() === title)
        .filter(songCol => songCol.collection?.trim().toLowerCase() === collection)
        .filter(songNumber => songNumber.number?.trim().toLowerCase() === number)

      // equal whitout translation (lowercase) [first more detail before return]
      const filteredSongDatabaseTCNT = filteredSongDatabaseTCN
        .filter(songText => songText.lyrics?.trim().toLowerCase() === text)

      // all equal (lowercase)
      filteredSongDatabase = filteredSongDatabaseTCNT
        .filter(songTranslation => songTranslation.lyricstranslate?.trim().toLowerCase() === translation)
      if (filteredSongDatabase.length > 0) { return filteredSongDatabase }

      // equal whitout translation (lowercase)
      if (filteredSongDatabaseTCNT.length > 0) { return filteredSongDatabaseTCNT }

      // equal title, collection, no. (lowercase)
      if (filteredSongDatabaseTCN.length > 0) { return filteredSongDatabaseTCN }

      // equal title (lowercase) // deel achter titel niet mee nemen wanner tussen... /^[^([{<|\\/>}\])]*/
      // title includes (lowercase)
      // een regel komt voor (test op 2 regels, zie getTekstLines())
      // equal collection, no.  (lowercase) (wanneer ingevuld)
      const textLines = this.getTextLines(settings.text)
      const titleMatch = title?.match(/^[^([{<|\\/>}\])]*/)[0]
      filteredSongDatabase = this.$fsdb.localSongDatabase
        .filter(song => {
          const lyrics = song.lyrics?.toLowerCase()
          switch (true) {
            case song.title?.match(/^[^([{<|\\/>}\])]*/)[0].trim().toLowerCase() === titleMatch:
            case song.title?.toLowerCase().includes(title):
            case title.includes(song.title?.trim().toLowerCase()):
            case song.collection?.trim().length > 0 &&
                 song.number?.trim().length > 0 &&
                 song.collection?.trim().toLowerCase() === collection &&
                 song.number?.trim().toLowerCase() === number:
            case textLines.length > 0 && lyrics.includes(textLines[0]):
            case textLines.length > 1 && lyrics.includes(textLines[1]):
              return true
            default:
              return false
          }
        })
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
    },
    edit (song) {
      this.$refs.presentationSettingsDialog.edit(song)
      // geen update vergelijking database in lijst; wel in voorbeeld markering.
    },
    setListDiffWidth () {
      this.SongItemDatabaseWidth = this.$refs.listDiff?.clientWidth * 0.5 || 400
    },
    setAction (actionNr) {
      switch (actionNr) {
        case -3: // -3 = exist in db
          break // no change
        case -2: // -2 = no add
        case -1: // -1 = add
          for (let i = 0; i < this.songsTodoIndex.length; i++) {
            if (this.songsTodoIndex[i] !== -3) { this.songsTodoIndex[i] = actionNr }
          }
          break
        default: // 0, 1 etc = change
          for (let i = 0; i < this.songsTodoIndex.length; i++) {
            if (this.songsTodoIndex[i] !== -3) { this.change(i, 40) }
          }
      }
    }
  }
}

</script>

<style scoped lang="scss">
.q-card {
  min-width: max(75vw, min(1440px, 95vw));
  height: 90vh;

  .q-splitter {
    height: 79vh;

    .songlist {
      height: 73vh;
      overflow-y: scroll;
      overflow-x: hidden;
    }
  }
}
</style>
