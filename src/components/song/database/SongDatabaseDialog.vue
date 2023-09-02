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
        <div class="col-auto q-pt-sm">
          <q-toggle
            v-model="$store.searchBaseIsLocal"
            checked-icon="lyrics"
            unchecked-icon="cloud"
            color="primary"
            size="80px"
            dense
            @update:model-value="toggleDatabase"
          >
            <q-tooltip>cloud of locale database</q-tooltip>
          </q-toggle>
        </div>
        <div class="col">
          <q-input
            v-model="searchInput"
            outlined
            label="Lied zoeken in database"
            :rules="['required']"
            debounce="500"
            @update:model-value="searchResults"
          >
            <template #prepend>
              <q-icon name="lyrics" />
            </template>
            <template v-if="searchInput" #append>
              <q-icon name="cancel" class="cursor-pointer" @click="resetSearch" />
            </template>
          </q-input>
        </div>
        <div class="col-4 q-pl-md">
          <q-select
            v-model="dbCollection"
            label="in collectie"
            outlined
            popup-content-style="height: 30vh;"
            options-dense
            :options="$store.dbCollections"
            @click="loadCollections"
            @popup-show="loadCollections"
            @update:model-value="searchResults"
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
            :no-data-label="tableLabel"
            :no-results-label="tableLabel"
            flat
            bordered
            dense
            hide-selected-banner
            binary-state-sort
            color="secondary"
            row-key="id"
            :visible-columns="visibleColumns"
            class="virtscroll-table"
            virtual-scroll
            :rows-per-page-options="[0]"
            :virtual-scroll-sticky-size-start="48"
            :loading="isLoading"
            :rows="resultSongDatabase"
            :columns="columns"
            @row-click="rowClickSelect"
          >
            <template #body-cell-actions="props">
              <q-td :props="props">
                <q-item-section class="table-actions">
                  <div class="text-grey-8 q-gutter-xs">
                    <q-btn class="gt-xs" size="10px" flat dense round icon="edit" @click.stop="startEditSong(props.row)">
                      <q-tooltip anchor="top middle" self="center middle">
                        Bewerk lied in database
                      </q-tooltip>
                    </q-btn>
                    <q-btn class="gt-xs" size="10px" flat dense round icon="clear" @click.stop="removeLocalSong(props.row.id)">
                      <q-tooltip anchor="top middle" self="center middle">
                        verwijderen uit database
                      </q-tooltip>
                    </q-btn>
                  </div>
                </q-item-section>
              </q-td>
            </template>
          </q-table>
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
          label="Zoek in liedtekst"
          unchecked-icon="clear"
          @update:model-value="searchResults"
        >
          <q-tooltip>Schakel tussen zoeken in titel en nummer of ook in tekst.</q-tooltip>
        </q-toggle>
        <template v-if="$store.searchBaseIsLocal">
          <q-toggle
            v-model="searchTranslation"
            checked-icon="check"
            color="secondary"
            label="Zoek alleen liederen met vertaling"
            unchecked-icon="clear"
            @update:model-value="searchResults"
          >
            <q-tooltip>Schakel in om alleen liederen met vertalling te vinden.</q-tooltip>
          </q-toggle>
          <q-space />
          <q-btn :disable="selectedFalse" color="primary" label="Bewerk in database" dense @click.stop="startEditSong(selected[0])">
            <q-tooltip>Bewerk "<i>{{ selectedTitle }}</i>" in database</q-tooltip>
          </q-btn>
          <q-btn :disable="selectedFalse" color="primary" label="Verwijder uit database" dense @click.stop="removeLocalSong(selected[0]?.id)">
            <q-tooltip>Verwijder "<i>{{ selectedTitle }}</i>" van database</q-tooltip>
          </q-btn>
          <q-btn :disable="backupLocalSongDatabaseExist" color="primary" icon="settings_backup_restore" dense @click.stop="undoremoveLocalSong">
            <q-tooltip>Ongedaan maken bewerken database</q-tooltip>
          </q-btn>
          <q-input
            v-model="userName"
            outlined
            dense
            :label-color="userName ? '' : 'red'"
            label="Gebruikersnaam"
            class="q-pl-md"
          >
            <q-tooltip>Naam waaronder wijzigingen in de database worden opgeslagen</q-tooltip>
          </q-input>
        </template>
        <q-space />
        <q-btn v-if="!onlyEditor" :disable="selectedFalse" color="secondary" label="Toepassen" @click.stop="submitSong">
          <q-tooltip>Pas het geselecteerde lied toe in de basis tab.</q-tooltip>
        </q-btn>
        <q-btn color="secondary" :label="onlyEditor ? 'Sluiten' : 'Annuleren'" @click.stop="hide">
          <q-tooltip>Wijzigingen niet toepassen</q-tooltip>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
  <PresentationSettingsDialog ref="presentationSettingsDialog" @save="saveEditSong" />
</template>

<script>
import BaseSongDatabase from './BaseSongDatabase.vue'
import cloneDeep from 'lodash/cloneDeep'
import presentationTypes from '../../presentation-types'
import { Notify } from 'quasar'

export default {
  extends: BaseSongDatabase,
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
      columns: [
        { name: 'id', label: '#', field: 'id', sortable: true },
        { name: 'title', label: 'Titel', field: 'title', align: 'left', required: true, sortable: true },
        { name: 'collection', label: 'Collectie', field: 'collection', sortable: true, style: 'width: 1vw; color: gray;' },
        { name: 'number', label: 'Nummer', field: 'number', sortable: true, style: 'width: 1vw; color: gray;' },
        { name: 'creator', label: 'opgeslagen', field: 'creator', sortable: true, style: 'width: 1vw; color: gray;', headerStyle: 'color: gray;' },
        { name: 'created_at', label: 'gemaakt', field: 'created_at', sortable: true, style: 'width: 1vw; color: gray;', headerStyle: 'color: gray;' },
        { name: 'updated_at', label: 'upgedate', field: 'updated_at', sortable: true, style: 'width: 1vw; color: gray;', headerStyle: 'color: gray;' },
        { name: 'actions', label: '', style: 'width: 1vw;' }
      ],
      onlyEditor: false,
      lyricsTab: 'text',
      editPresentation: null,
      userName: '',
      backupLocalSongDatabase: null
    }
  },
  computed: {
    selectedLyrics () {
      return this.selected[0]?.lyrics.replaceAll('\n', '<br>')
    },
    selectedLyricsTranslation () {
      return this.selected[0]?.lyricstranslate.replaceAll('\n', '<br>')
    },
    selectedTitle () {
      return this.selected[0]?.title || ''
    },
    backupLocalSongDatabaseExist () {
      return !this.backupLocalSongDatabase
    },
    tableLabel () {
      if (this.$store.searchBaseIsLocal ||
        (!this.$store.searchBaseIsLocal && this.searchInput.length > 0)
      ) return 'Geen resultaten gevonden'
      return 'Geef eerst een zoekopdracht voor resultaten'
    },
    visibleColumns () {
      if (this.$store.searchBaseIsLocal) return ['title', 'collection', 'number', 'creator', 'updated_at', 'actions']
      return ['title', 'collection', 'number', 'creator', 'updated_at']
    }
  },
  methods: {
    async show (onlyEditor = false) {
      this.onlyEditor = onlyEditor
      this.searchInput = this.title || ''
      this.dbCollection = this.collection || ''
      if (!this.dbCollection && !this.title) this.dbCollection = localStorage.getItem('database.collection') || ''
      this.$refs.dialogDatabase.show()
      await this.openLocalDatabase()
      if (this.noLocalDatabase) return this.hide()
      this.userName = localStorage.getItem('database.userName') || ''
    },
    hide () {
      this.$refs.dialogDatabase.hide()
    },
    rowClickSelect (e, row) {
      this.selected = [row]
      if (this.lyricsTab === 'text') {
        this.$refs.lyricsViewer.scrollTop = 0
      } else {
        this.$refs.lyricsViewerTranslation.scrollTop = 0
      }
    },
    submitSong () {
      this.$emit('update:title', this.selected[0]?.title)
      this.$emit('update:collection', this.selected[0]?.collection ? this.selected[0]?.collection : '')
      this.$emit('update:number', this.selected[0]?.number ? this.selected[0]?.number : '')
      this.$emit('update:text', this.selected[0]?.lyrics)
      this.$emit('update:translation', this.selected[0]?.lyricstranslate)
      if (this.userName) localStorage.setItem('database.userName', this.userName || '')
      this.hide()
    },
    async removeLocalSong (id) {
      if (!this.backupLocalSongDatabase) this.backupLocalSongDatabase = cloneDeep(this.$fsdb.localSongDatabase)
      let result = await this.$fsdb.removeFromDatabase(id)
      if (!result) { return }
      // save database
      result = await this.$fsdb.saveSongDatabase() // true = gelukt, false = niet gelukt
      if (!result) {
        this.$fsdb.localSongDatabase = cloneDeep(this.backupLocalSongDatabase)
        return
      }
      this.searchResults()
    },
    async undoremoveLocalSong () {
      if (this.backupLocalSongDatabase) {
        const reduSongDatabase = cloneDeep(this.$fsdb.localSongDatabase)
        this.$fsdb.localSongDatabase = cloneDeep(this.backupLocalSongDatabase)
        const result = await this.$fsdb.saveSongDatabase()
        if (!result) {
          this.$fsdb.localSongDatabase = cloneDeep(reduSongDatabase)
        }
        this.searchResults()
      }
    },
    startEditSong (props) {
      if (!this.backupLocalSongDatabase) this.backupLocalSongDatabase = cloneDeep(this.$fsdb.localSongDatabase)
      if (!this.userName) {
        return Notify.create({ type: 'negative', message: 'Vul eerst gebruikersnaam in voor bewerken database!', position: 'top' })
      }
      localStorage.setItem('database.userName', this.userName || '')
      if (props?.id) {
        // convert db --> presentation
        if (!this.editPresentation) {
          const type = presentationTypes.find(t => t.id === 'song')
          this.editPresentation = {
            type: 'song',
            from: 'database',
            settings: cloneDeep(type.settings)
          }
        }
        this.editPresentation.id = props.id || ''
        this.editPresentation.settings.title = props.title || ''
        this.editPresentation.settings.collection = props.collection || ''
        this.editPresentation.settings.number = props.number || ''
        this.editPresentation.settings.text = props.lyrics || ''
        this.editPresentation.settings.translation = props.lyricstranslate || ''
        // edit presentation
        this.$refs.presentationSettingsDialog.edit(this.editPresentation)
        // Return with emit save --> saveEditSong
      }
    },
    async saveEditSong () {
      let result = await this.$fsdb.addToDatabase(this.editPresentation.settings, this.userName, this.editPresentation.id)
      if (!result) return Notify.create({ type: 'negative', message: 'Wijzingen in database maken is mislukt!', position: 'top' })
      // save database
      result = await this.$fsdb.saveSongDatabase() // true = gelukt, false = niet gelukt
      if (!result) return Notify.create({ type: 'negative', message: 'Opslaan wijzingen database mislukt!', position: 'top' })
      this.searchResults()
    }
  }
}

</script>

<style scoped lang="scss">
.q-card {
  min-width: max(75vw, min(1440px, 95vw));
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
.table-actions {
  opacity: 0;
  transition: opacity 0.2s;
}
tr:hover .table-actions {
  opacity: 1;
}
</style>
