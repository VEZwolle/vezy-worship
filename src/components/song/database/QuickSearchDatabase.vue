<template>
  <div class="bg-subtoolbar text-subtoolbar quick-search-container">
    <div
      v-if="!$store.searchBaseIsLocal || ($store.searchBaseIsLocal && !noLocalDatabase)"
      v-show="searchInput.length > 0"
      class="row"
    >
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
        table-class="bg-subtoolbar"
        table-header-class="bg-primary text-white"
        row-key="objectID"
        :visible-columns="['title', 'collection', 'number', 'actions']"
        class="virtscroll-table"
        virtual-scroll
        :rows-per-page-options="[0]"
        :virtual-scroll-sticky-size-start="20"
        :loading="isLoading"
        :rows="resultSongDatabase"
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
      <div class="col-auto q-pt-sm">
        <q-toggle
          v-model="$store.searchBaseIsLocal"
          checked-icon="lyrics"
          unchecked-icon="cloud"
          color="primary"
          dense
          @update:model-value="toggleDatabase"
        >
          <q-tooltip>cloud of locale database</q-tooltip>
        </q-toggle>
      </div>
      <template v-if="$store.searchBaseIsLocal && noLocalDatabase">
        <q-btn flat dense size="md" text-color="primary" label="Snel zoeken database openen" @click.stop="openLocalDatabase">
          <q-tooltip anchor="top middle" self="center middle">
            Open lokale database voor snel zoeken
          </q-tooltip>
        </q-btn>
      </template>
      <template v-else>
        <div class="col q-pt-xs">
          <q-input
            v-model="searchInput"
            outlined
            dense
            hide-bottom-space
            :label="`Lied zoeken in ${$store.searchBaseIsLocal ? 'lokale' : 'cloud'} database`"
            :rules="['required']"
            debounce="500"
            @update:model-value="searchResults"
          >
            <template #prepend>
              <q-icon :name="$store.searchBaseIsLocal ? 'lyrics' : 'img:images/algolia-mark.svg'" />
            </template>
            <template v-if="searchInput" #append>
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
            popup-content-class="bg-subtoolbar"
            popup-content-style="height: 30vh;"
            options-dense
            :options="$store.dbCollections"
            @click="loadCollections"
            @popup-show="loadCollections"
            @update:model-value="searchResults"
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
              @update:model-value="searchResults"
            >
              <q-tooltip>Schakel tussen zoeken in titel en nummer of ook in tekst.</q-tooltip>
            </q-toggle>
          </div>
          <div class="row">
            <q-toggle
              v-if="$store.searchBaseIsLocal"
              v-model="searchTranslation"
              checked-icon="check"
              color="primary"
              dense
              size="xs"
              label="Vertaling"
              unchecked-icon="clear"
              @update:model-value="searchResults"
            >
              <q-tooltip>Schakel in om alleen liederen met vertalling te vinden.</q-tooltip>
            </q-toggle>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import BaseSongDatabaseSearch from './BaseSongDatabaseSearch.vue'
import presentationTypes from '../../presentation-types'
import cloneDeep from 'lodash/cloneDeep'

export default {
  components: { },
  extends: BaseSongDatabaseSearch,
  data () {
    return {
      columns: [
        { name: 'objectID', label: '#', field: 'objectID', sortable: true },
        { name: 'actions', label: '', style: 'width: 1vw;' },
        { name: 'title', label: 'Titel', field: 'title', align: 'left', required: true, sortable: true },
        { name: 'collection', label: 'Collectie', field: 'collection', sortable: true, style: 'width: 1vw; color: gray;' },
        { name: 'number', label: 'Nummer', field: 'number', sortable: true, style: 'width: 1vw; color: gray;' }
      ]
    }
  },
  computed: {
    found () {
      return this.resultSongDatabase.length > 0
    }
  },
  async mounted () {
    this.searchInput = ''
    this.dbCollection = localStorage.getItem('database.collection') || ''
    const localSongDatabaseName = await this.$fsdb.getSongDatabaseSettings()
    if (this.$fsdb.localSongDatabase || (this.$q.platform.is.electron && localSongDatabaseName)) this.openLocalDatabase() // open only when already loaded
  },
  methods: {
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
