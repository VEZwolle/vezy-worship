<template>
  <div class="bg-grey-3 quick-search-container">
    <template v-if="noDatabase">
      <q-btn flat dense size="md" text-color="primary" label="Snel zoeken database openen" @click.stop="openDatabase">
        <q-tooltip anchor="top middle" self="center middle">
          Open database voor snel zoeken
        </q-tooltip>
      </q-btn>
      <q-btn flat dense size="md" text-color="primary" label="Zoeken via Algolia" @click.stop="algoliasearch" />
    </template>
    <template v-else>
      <div v-show="search.length > 0" class="row">
        <q-table
          v-model:selected="selected"
          no-data-label="Geen resultaten gevonden"
          no-results-label="Geen resultaten gevonden"
          hide-selected-banner
          :hide-bottom="found"
          flat
          bordered
          dense
          binary-state-sort
          color="secondary"
          table-class="bg-grey-3"
          table-header-class="bg-primary text-white"
          row-key="id"
          :visible-columns="['title', 'collection', 'number', 'actions']"
          class="virtscroll-table"
          virtual-scroll
          :rows-per-page-options="[0]"
          :virtual-scroll-sticky-size-start="20"
          :loading="isLoading"
          :rows="filteredSongDatabase"
          :columns="columns"
          @row-click="rowClickSelect"
          @row-dblclick="rowdblClickSelect"
        >
          <template #body-cell-actions="props">
            <q-td :props="props">
              <q-item-section class="table-actions">
                <div class="text-grey-8 q-gutter-xs">
                  <q-btn class="gt-xs" size="10px" flat dense round icon="playlist_play" @click.stop="toSetlist(props.row)">
                    <q-tooltip anchor="top middle" self="center middle">
                      Naar setlist
                    </q-tooltip>
                  </q-btn>
                  <q-btn class="gt-xs" size="10px" flat dense round icon="remove_red_eye" @click.stop="toPreview(props.row)">
                    <q-tooltip anchor="top middle" self="center middle">
                      Naar preview (zonder setlist)
                    </q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>
            </q-td>
          </template>
        </q-table>
      </div>
      <div class="row q-gutter-xs">
        <div class="col q-pt-xs">
          <q-input
            v-model="search"
            outlined
            dense
            hide-bottom-space
            label="Lied zoeken in database"
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
        <div class="col-4 q-pt-xs">
          <q-select
            v-model="dbCollection"
            label="in collectie"
            outlined
            dense
            hide-bottom-space
            popup-content-class="bg-grey-3"
            popup-content-style="height: 30vh;"
            options-dense
            :options="dbCollections"
            @update:model-value="filterSearchResults"
          >
            <template v-if="dbCollection" #append>
              <q-icon name="cancel" size="xs" class="cursor-pointer" @click="resetCollection" />
            </template>
          </q-select>
        </div>
        <div class="col-auto">
          <div class="row">
            <q-toggle
              v-model="searchLyrics"
              checked-icon="check"
              color="primary"
              label="Liedtekst"
              dense
              size="xs"
              unchecked-icon="clear"
              @update:model-value="filterSearchResults"
            >
              <q-tooltip>Schakel tussen zoeken in titel en nummer of ook in tekst.</q-tooltip>
            </q-toggle>
          </div>
          <div class="row">
            <q-toggle
              v-model="searchTranslation"
              checked-icon="check"
              color="primary"
              dense
              size="xs"
              label="Vertaling"
              unchecked-icon="clear"
              @update:model-value="filterSearchResults"
            >
              <q-tooltip>Schakel in om alleen liederen met vertalling te vinden.</q-tooltip>
            </q-toggle>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import BaseSongDatabase from './BaseSongDatabase.vue'
import presentationTypes from '../../presentation-types'
import cloneDeep from 'lodash/cloneDeep'

export default {
  components: { },
  extends: BaseSongDatabase,
  data () {
    return {
      columns: [
        { name: 'id', label: '#', field: 'id', sortable: true },
        { name: 'actions', label: '', style: 'width: 1vw;' },
        { name: 'title', label: 'Titel', field: 'title', align: 'left', required: true, sortable: true },
        { name: 'collection', label: 'Collectie', field: 'collection', sortable: true, style: 'width: 1vw; color: gray;' },
        { name: 'number', label: 'Nummer', field: 'number', sortable: true, style: 'width: 1vw; color: gray;' }
      ],
      noDatabase: true
    }
  },
  computed: {
    found () {
      return this.filteredSongDatabase.length > 0
    }
  },
  mounted () {
    this.search = ''
    this.dbCollection = localStorage.getItem('database.collection') || ''
    if (this.$fsdb.localSongDatabase) this.openDatabase()
  },
  methods: {
    async openDatabase () {
      this.isLoading = true
      if (!this.$fsdb.localSongDatabase) {
        if (!(await this.$fsdb.openSongDatabase())) {
          // error open saved location, open new
          if (!(await this.$fsdb.openSongDatabase(true))) {
            this.noDatabase = true
            return
          }
        }
      }
      this.noDatabase = false
      this.dbCollections = await this.$fsdb.getCollections()
      this.filterSearchResults()
      this.isLoading = false
    },
    rowClickSelect (e, row) {
      this.selected = [row]
      if (this.selectedFalse) return
      this.toPreview(this.selected[0])
    },
    rowdblClickSelect (e, row) {
      this.selected = [row]
      if (this.selectedFalse) return
      this.toSetlist(this.selected[0])
    },
    toSetlist (props) {
      this.$store.addPresentation(this.propsToPresentation(props))
    },
    toPreview (props) {
      this.$store.preview(this.propsToPresentation(props))
    },
    propsToPresentation (props) {
      const type = presentationTypes.find(t => t.id === 'song')
      const presentation = {
        type: 'song',
        settings: cloneDeep(type.settings)
      }
      presentation.settings.title = props.title || ''
      presentation.settings.collection = props.collection || ''
      presentation.settings.number = props.number || ''
      presentation.settings.text = props.lyrics || ''
      presentation.settings.translation = props.lyricstranslate || ''
      return presentation
    },
    async algoliasearch () {
      try {
        const result = await this.$api.post('/search', {
          search: 'Einde'
        })
        console.log(result)
        if (result.hits) {
          console.log(result.hits)
        }
      } catch {
        // error
      } finally {
        // gereed, stop loading
      }
    }
  }
}
</script>

<style scoped lang="scss">
.quick-search-container {
  padding: 3px 3px;
  border-top: $layout-border;
  color: black;
}

.virtscroll-table {
  max-height: 25vh;
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
.table-actions {
  opacity: 0;
  transition: opacity 0.2s;
}
tr:hover .table-actions {
  opacity: 1;
}
</style>
