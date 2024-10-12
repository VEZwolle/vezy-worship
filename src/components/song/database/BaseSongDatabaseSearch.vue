<script>
import { getAlgoliaSearch, getAlgoliaCollections, ApiKeyEdit, algoliaIndexNames } from './algolia.js'

export default {
  data () {
    return {
      searchInput: this.title || '',
      searchLyrics: false,
      searchTranslation: false,
      dbCollection: this.collection || '',
      selected: [],
      resultSongDatabase: [],
      noLocalDatabase: true,
      isLoading: false
    }
  },
  computed: {
    apiKeyEditExist () {
      return ApiKeyEdit(this.$store.algoliaIndexId)
    },
    selectedFalse () {
      return !this.selected[0]
    },
    algoliaIndexNames () {
      return algoliaIndexNames
    },
    algoliaIndexNameLabel () {
      const algoliaIndexName = this.algoliaIndexNames.find(t => t.value === this.$store.algoliaIndexId) || { label: 'geen' }
      return algoliaIndexName.label
    }
  },
  methods: {
    async toggleDatabase () {
      // reset
      this.$store.dbCollections = ['']
      this.resultSongDatabase = []
      this.noLocalDatabase = true
      // open database
      if (this.$store.searchBaseIsLocal) {
        await this.openLocalDatabase()
      } else {
        // algolia --> no load needed.
      }
      // search input
      this.searchResults()
    },
    setAlgoliaIndexId (indexId) {
      this.$store.algoliaIndexId = indexId
      this.$store.dbCollections = ['']
      this.searchResults()
    },
    toggleAlgoliaIndexId () {
      const id = this.algoliaIndexNames.findIndex(t => t.value === this.$store.algoliaIndexId) + 1 || 0
      if (id < this.algoliaIndexNames.length) {
        this.$store.algoliaIndexId = this.algoliaIndexNames[id].value
      } else {
        this.$store.algoliaIndexId = this.algoliaIndexNames[0].value
      }
      this.$store.dbCollections = ['']
      this.searchResults()
    },
    searchResults () {
      if (this.$store.searchBaseIsLocal) return this.localSearchResults()
      this.algoliaSearch()
    },
    loadCollections () {
      if (this.$store.dbCollections.length > 1) return // default minimum empty string ['']
      if (this.$store.searchBaseIsLocal) return this.getLocalCollections()
      this.algoliaCollections()
    },
    resetSearch () {
      this.searchInput = ''
      this.searchResults()
    },
    resetCollection () {
      this.dbCollection = ''
      this.searchResults()
    },
    async openLocalDatabase () {
      this.isLoading = true
      if (!this.$fsdb.localSongDatabase) {
        if (!(await this.$fsdb.openSongDatabase())) {
          // error open saved location, open new
          if (!(await this.$fsdb.openSongDatabase(true))) {
            this.noLocalDatabase = true
            return
          }
        }
      }
      this.noLocalDatabase = false
      this.searchResults()
      this.isLoading = false
    },
    localSearchResults () {
      if (this.noLocalDatabase) return this.openLocalDatabase()
      this.isLoading = true
      this.selected = []
      const searchInput = this.searchInput.toLowerCase()
      if (!this.dbCollection) {
        this.resultSongDatabase = this.$fsdb.localSongDatabase.filter(song => {
          if (this.searchTranslation && !song.lyricstranslate) return false
          switch (true) {
            case song.title?.toLowerCase().includes(searchInput):
            case song.number?.toLowerCase().includes(searchInput):
            case (this.searchLyrics && song.lyrics?.toLowerCase().includes(searchInput)):
              return true
            default:
              return false
          }
        })
      } else {
        this.resultSongDatabase = this.$fsdb.localSongDatabase.filter(songcol => songcol.collection === this.dbCollection).filter(song => {
          if (this.searchTranslation && !song.lyricstranslate) return false
          switch (true) {
            case song.title?.toLowerCase().includes(searchInput):
            case song.number?.toLowerCase().includes(searchInput):
            case (this.searchLyrics && song.lyrics?.toLowerCase().includes(searchInput)):
              return true
            default:
              return false
          }
        })
      }
      this.isLoading = false
    },
    async getLocalCollections () {
      if (this.noLocalDatabase) return this.openLocalDatabase()
      this.$store.dbCollections = await this.$fsdb.getCollections()
    },
    async algoliaSearch () {
      if (!this.searchInput) return
      this.isLoading = true
      this.selected = []
      const result = await getAlgoliaSearch(this.$store.algoliaIndexId, this.searchInput, this.searchLyrics, this.dbCollection)
      if (result === false) {
        this.resultSongDatabase = []
      } else {
        this.resultSongDatabase = result
      }
      this.isLoading = false
    },
    async algoliaCollections () {
      this.$store.dbCollections = await getAlgoliaCollections(this.$store.algoliaIndexId)
    }
  }
}
</script>
