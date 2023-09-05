<script>
import { HtmlDiff, CountDiff } from '../../common/HtmlDiff.js'
import { splitSong } from '../SongControl.vue'
import { getAlgoliaSearch } from './algolia.js'

export default {
  data () {
    return {
      userName: '',
      songs: [],
      songsSearchResults: [],
      songsSearchCountDiff: [],
      songsTodoIndex: [], // -3 = exist in db, no add; -2 = no add; -1 = add; 0, 1 etc = change
      noNewSongs: true,
      selected: {},
      isLoading: false,
      isSaving: false
    }
  },
  computed: {
    changesDatabase () {
      return this.songsTodoIndex.filter(i => i >= -1).length && this.userName.length
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
    countDifftext () {
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
    async searchSongs () {
      // reset results
      this.songsSearchResults = []
      this.songsSearchCountDiff = []
      this.songsTodoIndex = []
      // search database
      for (let k = 0; k < this.songs.length; k++) {
        let databaseSongFilter = []
        if (this.$store.searchBaseIsLocal) {
          databaseSongFilter = this.filterSearchSongInLocalDatabase(this.songs[k].settings).slice(0, 99) || [] // max 99 results pro song
        } else {
          databaseSongFilter = await this.SearchSongInAlgoliaDatabase(this.songs[k].settings)
          databaseSongFilter = databaseSongFilter.slice(0, 99) || []
        }
        const countDiffs = []
        const databaseSong = []

        // get diff count
        for (let i = 0; i < databaseSongFilter.length || countDiffs.length > 20; i++) { // maximaal 20 resultaten
          const textDiff = CountDiff(HtmlDiff(databaseSongFilter[i].lyrics, this.songs[k].settings.text))
          // gebruik alleen resultaten met meer dan 10% overeenkomst in de resultaten
          if (textDiff.factor100 > 10) {
            const translationDiff = CountDiff(HtmlDiff(databaseSongFilter[i].lyricstranslate, this.songs[k].settings.translation))
            const factor200 = textDiff.factor100 + translationDiff.factor100
            databaseSong.push(databaseSongFilter[i])
            countDiffs.push({ text: textDiff, translation: translationDiff, factor200 })
          }
        }
        let j = -1 // -1 (add) if no database else index nr 0, 1 db result (replace)
        // search best result
        for (let i = 0; i < countDiffs.length; i++) {
          if (i === 0) {
            j = i
            continue
          }
          if (countDiffs[i].factor200 > countDiffs[j].factor200) { j = i }
        }
        if (countDiffs[j]?.text.factor100 < 40) { j = -1 } // less than 40% similarity text, probably different song --> add
        // if exactly
        if (countDiffs[j]?.factor200 > 190) { // check if te same
          if (databaseSong[j].title === this.songs[k].settings.title &&
          databaseSong[j].collection === this.songs[k].settings.collection &&
          databaseSong[j].number === this.songs[k].settings.number &&
          databaseSong[j].lyrics === this.songs[k].settings.text &&
          databaseSong[j].lyricstranslate === this.songs[k].settings.translation
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
        this.songsSearchCountDiff.push(countDiffs)
        this.songsTodoIndex.push(j)
      }
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
      return lines
    },
    filterSearchSongInLocalDatabase (settings) {
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

      // equal collection, no. (lowercase) [first more detail before return]
      const filteredSongDatabaseCN = this.$fsdb.localSongDatabase
        .filter(songCol => songCol.collection?.trim().toLowerCase() === collection)
        .filter(songNumber => songNumber.number?.trim().toLowerCase() === number)

      // equal title, collection, no. (lowercase) [first more detail before return]
      const filteredSongDatabaseTCN = filteredSongDatabaseCN
        .filter(songTitle => songTitle.title?.trim().toLowerCase() === title)

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

      // equal collection, no. (lowercase) | no. = int & collection <> ''
      if (/^[0-9]+$/.test(number) && collection.length > 0) {
        if (filteredSongDatabaseCN.length > 0) { return filteredSongDatabaseCN }
      }

      // equal title (lowercase) // deel achter titel niet mee nemen wanner tussen... /^[^([{<|\\/>}\])]*/
      // title includes (lowercase)
      // een regel komt voor (test op 2 regels, zie getTekstLines())
      // equal collection, no.  (lowercase) (wanneer ingevuld)
      const textLines = this.getTextLines(settings.text)
      const titleMatch = title?.match(/^[^([{<|\\/>}\])]*/)[0]
      const titleCheck = titleMatch.length > 3 && titleMatch !== title // minimaal 2 tekens voor check
      filteredSongDatabase = this.$fsdb.localSongDatabase
        .filter(song => {
          const lyrics = song.lyrics?.toLowerCase()
          switch (true) {
            case titleCheck && song.title?.match(/^[^([{<|\\/>}\])]*/)[0].trim().toLowerCase() === titleMatch:
            case titleCheck && song.title?.toLowerCase().includes(title):
            case titleCheck && title.includes(song.title?.trim().toLowerCase()):
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
    async SearchSongInAlgoliaDatabase (settings) {
      const searchInputs = []

      const title = settings.title?.trim()
      if (title.length > 3) searchInputs.push(title)
      const titleMatch = title?.match(/^[^([{<|\\/>}\])]*/)[0]
      if (titleMatch.length > 3 && titleMatch !== title) searchInputs.push(titleMatch)

      const collection = settings.collection?.trim()
      const number = settings.number?.trim()
      if (/^[0-9]+$/.test(number) && collection.length > 0) searchInputs.push(`${collection} ${number}`)

      const noTextSeach = searchInputs.length

      const textLines = this.getTextLines(settings.text)
      if (textLines.length > 0) searchInputs.push(textLines[0])
      if (textLines.length > 1) searchInputs.push(textLines[1])

      if (searchInputs.length === 0) return

      let resultSongDatabase = []
      for (let i = 0; i < searchInputs.length; i++) {
        const result = await getAlgoliaSearch(this.$api, searchInputs[i], i >= noTextSeach, '')
        if (result.hits) {
          resultSongDatabase.push(result.hits)
        }
      }
      [resultSongDatabase] = [...new Map(resultSongDatabase.map((m) => [m.objectID, m])).values()] // unique
      return resultSongDatabase
    },
    addToDatabase () {
      let result = true
      for (let i = 0; i < this.songs.length; i++) {
        const todoIndex = this.songsTodoIndex[i]
        if (todoIndex > -2) {
          switch (todoIndex) {
            case undefined: break
            case -1: // add
              if (!this.$fsdb.addToDatabase(this.songs[i].settings, this.userName)) result = false
              break
            default: {
              if (!this.$fsdb.addToDatabase(this.songs[i].settings, this.userName, this.songsSearchResults[i][todoIndex].objectID)) result = false
            }
          }
        }
      }
      return result
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
