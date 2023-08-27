<template>
  <q-dialog ref="dialogDatabase" persistent square>
    <q-card>
      <q-toolbar class="bg-secondary text-white">
        <q-toolbar-title>
          <span>Liedtekst uit lokale database inladen</span>
        </q-toolbar-title>
        <q-btn v-close-popup flat round dense icon="close" />
      </q-toolbar>
      <div class="row q-px-md q-pt-md">
        <div class="col">
          <q-input
            v-model="search"
            outlined
            label="Zoeken"
            :rules="['required']"
            debounce="500"
            @update:model-value="filterSearchResults"
            @change="filterSearchResults"
          >
            <template #prepend>
              <q-icon name="lyrics" />
            </template>
            <template v-if="search" #append>
              <q-icon name="cancel" class="cursor-pointer" @click="resetSearch" />
            </template>
          </q-input>
        </div>
        <div class="col-4 q-pl-md">
          <q-select
            v-model="dbCollection"
            label="Collectie"
            outlined
            options-dense
            :options="dbCollections"
            @update:model-value="filterSearchResults"
          >
            <template #prepend>
              <q-icon name="book" />
            </template>
            <template v-if="dbCollection" #append>
              <q-icon name="cancel" class="cursor-pointer" @click="resetCollection" />
            </template>
          </q-select>
        </div>
      </div>
      <div class="row q-px-md">
        <div class="col">
          <q-table
            v-model:selected="selected"
            title="Zoek resultaten"
            no-data-label="Geen resultaten gevonden"
            no-results-label="Geen resultaten gevonden"
            flat
            bordered
            dense
            binary-state-sort
            color="secondary"
            row-key="id"
            selection="single"
            :visible-columns="['title', 'collection', 'number', 'creator', 'updated_at']"
            class="virtscroll-table"
            virtual-scroll
            :rows-per-page-options="[0]"
            :virtual-scroll-sticky-size-start="48"
            :loading="isLoading"
            :rows="filteredSongDatabase"
            :columns="columns"
            @selection="changeSelected"
            @row-click="rowClickSelect"
          />
        </div>
        <div class="col-4 q-pl-md">
          <q-tabs v-model="lyricsTab" class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator :breakpoint="0">
            <q-tab name="text" label="Liedtekst" />
            <q-tab name="translation" label="Vertaling" />
          </q-tabs>
          <q-separator />
          <q-tab-panels v-model="lyricsTab" animated>
            <q-tab-panel name="text">
              <div ref="lyricsViewer" class="lyrics" v-html="selectedLyrics" />
            </q-tab-panel>
            <q-tab-panel name="translation">
              <div ref="lyricsViewerTranslation" class="lyrics" v-html="selectedLyricsTranslation" />
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>

      <q-separator />

      <q-card-actions align="right">
        <q-toggle
          v-model="searchLyrics"
          checked-icon="check"
          color="secondary"
          label="Zoek in liedtext"
          unchecked-icon="clear"
          @update:model-value="filterSearchResults"
        >
          <q-tooltip>Schakel tussen zoeken in titel en nummer of ook in text.</q-tooltip>
        </q-toggle>
        <q-toggle
          v-model="searchTranslation"
          checked-icon="check"
          color="secondary"
          label="Zoek alleen liederen met vertaling"
          unchecked-icon="clear"
          @update:model-value="filterSearchResults"
        >
          <q-tooltip>Schakel tussen zoeken in titel en nummer of ook in text.</q-tooltip>
        </q-toggle>
        <q-space />
        <q-btn :disable="selectedFalse" color="secondary" label="Toepassen" @click.stop="submitSong">
          <q-tooltip>Pas het geselecteerde lied toe in de basis tab.</q-tooltip>
        </q-btn>
        <q-btn color="secondary" label="Annuleren" @click.stop="hide">
          <q-tooltip>Wijzigingen niet toepassen</q-tooltip>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    title: String,
    collection: String,
    number: String,
    text: String,
    translation: String
  },
  emits: [
    'update:title',
    'update:collection',
    'update:number',
    'update:text',
    'update:translation'
  ],
  data () {
    return {
      search: this.title,
      searchLyrics: false,
      searchTranslation: false,
      dbCollection: this.collection,
      dbCollections: [],
      selected: [],
      filteredSongDatabase: [],
      columns: [
        { name: 'id', label: '#', field: 'id', sortable: true },
        { name: 'title', label: 'Titel', field: 'title', align: 'left', required: true, sortable: true },
        { name: 'collection', label: 'Collectie', field: 'collection', align: 'left', sortable: true },
        { name: 'number', label: 'Nummer', field: 'number', sortable: true },
        { name: 'creator', label: 'opgeslagen', field: 'creator', sortable: true, style: 'width: 1vw; color: gray;', headerStyle: 'color: gray;' },
        { name: 'created_at', label: 'gemaakt', field: 'created_at', sortable: true, style: 'width: 1vw; color: gray;', headerStyle: 'color: gray;' },
        { name: 'updated_at', label: 'upgedate', field: 'updated_at', sortable: true, style: 'width: 1vw; color: gray;', headerStyle: 'color: gray;' }
      ],
      isLoading: false,
      lyricsTab: 'text'

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
    }
  },
  computed: {
    selectedLyrics () {
      return this.selected[0]?.lyrics.replaceAll('\n', '<br>')
    },
    selectedLyricsTranslation () {
      return this.selected[0]?.lyricstranslate.replaceAll('\n', '<br>')
    },
    selectedFalse () {
      return !this.selected[0]
    }
  },
  methods: {
    async show () {
      this.search = this.title
      this.dbCollection = this.collection
      if (!this.dbCollection) this.dbCollection = localStorage.getItem('database.collection') || ''
      this.$refs.dialogDatabase.show()
      this.isLoading = true
      if (!this.$fsdb.localSongDatabase) {
        if (!(await this.$fsdb.openSongDatabase())) this.hide()
      }
      this.dbCollections = await this.$fsdb.getCollections()
      this.filterSearchResults()
      this.isLoading = false
    },
    hide () {
      this.$refs.dialogDatabase.hide()
    },
    rowClickSelect (e, row) {
      this.selected = [row]
    },
    changeSelected () {
      if (this.lyricsTab === 'text') {
        this.$refs.lyricsViewer.scrollTop = 0
      } else {
        this.$refs.lyricsViewerTranslation.scrollTop = 0
      }
    },
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
    },
    submitSong () {
      this.$emit('update:title', this.selected[0]?.title)
      this.$emit('update:collection', this.selected[0]?.collection ? this.selected[0]?.collection : '')
      this.$emit('update:number', this.selected[0]?.number ? this.selected[0]?.number : '')
      this.$emit('update:text', this.selected[0]?.lyrics)
      this.$emit('update:translation', this.selected[0]?.lyricstranslate)
      this.hide()
    }
  }
}

</script>

<style scoped lang="scss">
.q-card {
  min-width: 60vw;
  min-height: 80vh;
}

.lyrics {
  height: 50vh;
  overflow-y: auto;
  overflow-x: hidden;
}
.virtscroll-table {
  height: 57vh;
  width: 100%;

  .q-table__top, .q-table__bottom, thead tr:first-child th {
    background-color: #00b4ff;
  }

  thead tr th {
    position: sticky;
    z-index: 1;
  }

  thead tr:last-child th {
    top: 48px;
  }

  thead tr:first-child th {
    top: 0;
  }

  tbody {
    scroll-margin-top: 48px;
  }
}
</style>
