<script>

export default {
  data () {
    return {
      search: this.title || '',
      searchLyrics: false,
      searchTranslation: false,
      dbCollection: this.collection || '',
      dbCollections: [],
      selected: [],
      filteredSongDatabase: [],
      isLoading: false
    }
  },
  computed: {
    selectedFalse () {
      return !this.selected[0]
    }
  },
  methods: {
    filterSearchResults () {
      this.isLoading = true
      this.selected = []
      const search = this.search.toLowerCase()
      if (!this.dbCollection) {
        this.filteredSongDatabase = this.$fsdb.localSongDatabase.filter(song => {
          if (this.searchTranslation && !song.lyricstranslate) return false
          switch (true) {
            case song.title?.toLowerCase().includes(search):
            case song.number?.toLowerCase().includes(search):
            case (this.searchLyrics && song.lyrics?.toLowerCase().includes(search)):
              return true
            default:
              return false
          }
        })
      } else {
        this.filteredSongDatabase = this.$fsdb.localSongDatabase.filter(songcol => songcol.collection === this.dbCollection).filter(song => {
          if (this.searchTranslation && !song.lyricstranslate) return false
          switch (true) {
            case song.title?.toLowerCase().includes(search):
            case song.number?.toLowerCase().includes(search):
            case (this.searchLyrics && song.lyrics?.toLowerCase().includes(search)):
              return true
            default:
              return false
          }
        })
      }
      this.isLoading = false
    },
    resetSearch () {
      this.search = ''
      this.filterSearchResults()
    },
    resetCollection () {
      this.dbCollection = ''
      this.filterSearchResults()
    }
  }
}
</script>
