<template>
  <q-dialog ref="dialogAddDatabase" persistent square>
    <q-card>
      <q-toolbar class="bg-secondary text-white">
        <q-toolbar-title>
          <span>Liedtekst vergelijken/toevoegen met {{ $store.searchBaseIsLocal ? 'lokale' : 'cloud' }} database</span>
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

          <div v-if="noNewSongs && !isLoading" class="row q-pa-md text-h6">
            Geen nieuwe liederen gevonden om aan database toe te voegen
          </div>

          <div v-show="!noNewSongs" ref="listDiff" class="row q-gutter-md">
            <q-list class="col q-pt-sm songlist">
              <div v-for="(song, index) in songs" :key="song.id" class="row">
                <template v-if="songsTodoIndex[index] > -3">
                  <div class="col">
                    <SongItem
                      :new-song="song"
                      :song-todo-index="songsTodoIndex[index]"
                      :active="selectedId === song.id"
                      actions
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
                  text: {{ countDifftext }}
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
            <SongLyricsViews
              :new-title="newTitle"
              :new-collection-number="newCollectionNumber"
              :new-lyrics="newLyrics"
              :new-lyrics-translation="newLyricsTranslation"
              :compare-title="compareTitle"
              :compare-collection-number="compareCollectionNumber"
              :compare-lyrics="compareLyrics"
              :compare-lyrics-translation="compareLyricsTranslation"
              :database-title="databaseTitle"
              :database-collection-number="databaseCollectionNumber"
              :database-lyrics="databaseLyrics"
              :database-lyrics-translation="databaseLyricsTranslation"
              :tabs="tabs"
              tab="diff"
              lyrics-height="56"
            />
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

        <q-input
          v-model="userName"
          outlined
          dense
          :label-color="userName ? '' : 'red'"
          label="Gebruikersnaam"
        >
          <q-tooltip>Naam waaronder wijzigingen in de database worden opgeslagen</q-tooltip>
        </q-input>

        <q-space />
        <q-btn-dropdown
          v-if="$store.searchBaseIsLocal"
          color="secondary"
          split
          icon="save"
          label="Opslaan in database"
          :disable="!changesDatabase"
          :loading="isSaving"
          @click.stop="saveLocal(false)"
        >
          <template #label>
            <q-tooltip v-if="userName">
              Geselecteerde liederen toevoegen, vervangen & opslaan in database
            </q-tooltip>
            <q-tooltip v-else>
              Let op: Gebruikersnaam invullen voor je kan opslaan!
            </q-tooltip>
          </template>
          <q-list>
            <q-item v-close-popup clickable @click.stop="saveLocal(true)">
              <q-item-section>
                <q-item-label>Opslaan als</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <template v-else-if="apiKeyEditExist">
          <q-btn
            color="secondary"
            icon="download"
            label="Download cloud database"
            :loading="isSavingDatabase"
            @click.stop="getAlgoliaDatabase()"
          >
            <q-tooltip>
              Download de cloud database en opslaan aan bestand
            </q-tooltip>
          </q-btn>
          <q-btn
            color="secondary"
            icon="save"
            label="Opslaan in cloud database"
            :disable="!changesDatabase"
            :loading="isSaving"
            @click.stop="saveAlgolia()"
          >
            <q-tooltip v-if="userName">
              Geselecteerde liederen toevoegen, vervangen & opslaan in database
            </q-tooltip>
            <q-tooltip v-else>
              Let op: Gebruikersnaam invullen voor je kan opslaan!
            </q-tooltip>
          </q-btn>
          <q-btn color="secondary" label="Sluiten" @click.stop="hide">
            <q-tooltip>Wijzigingen niet toepassen</q-tooltip>
          </q-btn>
        </template>
      </q-card-actions>
    </q-card>
  </q-dialog>
  <PresentationSettingsDialog ref="presentationSettingsDialog" />
</template>

<script>
import BaseSongDatabaseCompare from './BaseSongDatabaseCompare.vue'
import { Notify } from 'quasar'
import cloneDeep from 'lodash/cloneDeep'
import { GetAlgoliaDatabase } from './algolia.js'

export default {
  extends: BaseSongDatabaseCompare,
  data () {
    return {
      tabs: [
        { name: 'new', label: 'Nieuw' },
        { name: 'newDiff', label: 'N + V' },
        { name: 'diff', label: 'Verschil' },
        { name: 'diffDb', label: 'V + D' },
        { name: 'db', label: 'Database' }
      ],
      splitterModel: 70,
      SongItemDatabaseWidth: 500,
      isSavingDatabase: false
    }
  },
  computed: {
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
      this.userName = localStorage.getItem('database.userName') || ''

      // get songs setlist
      this.songs = this.$store.service.presentations.filter(t => t.type === 'song')
      if (this.songs.length < 1) {
        this.hide()
        return Notify.create({ type: 'negative', message: 'geen liederen in setlist gevonden', position: 'top' })
      }
      this.$nextTick(() => { this.setListDiffWidth() })
      // open database
      if (this.$store.searchBaseIsLocal && !this.$fsdb.localSongDatabase) {
        if (!(await this.$fsdb.openSongDatabase())) {
          // no database selected or error on saved version
          // make new
          await this.$fsdb.newEmptyDatabase()
          // return
          Notify.create({ type: 'negative', message: 'geen database gevonden, er is een lege database aangemaakt' })
        }
      }
      // database is made open or empty
      // search songs in database most similar to setlist songs or not found
      if (!(await this.searchSongs())) return this.hide()
      this.isLoading = false
    },
    hide () {
      this.$refs.dialogAddDatabase.hide()
    },
    async saveLocal (newFile = false) {
      this.isSaving = true
      localStorage.setItem('database.userName', this.userName || '')
      // backup this.$fsdb.localSongDatabase
      const backupSongDatabase = cloneDeep(this.$fsdb.localSongDatabase)
      let result = this.addToDatabase()
      if (!result) {
        this.$fsdb.localSongDatabase = cloneDeep(backupSongDatabase)
        Notify.create({ type: 'negative', message: 'fout bij toevoegen liederen aan database', position: 'top' })
        this.isSaving = false
        return
      }
      // save database
      result = await this.$fsdb.saveSongDatabase(newFile) // true = gelukt, false = niet gelukt
      if (!result) {
        this.$fsdb.localSongDatabase = cloneDeep(backupSongDatabase)
        Notify.create({ type: 'negative', message: 'fout bij toevoegen liederen aan database', position: 'top' })
        this.isSaving = false
        return
      }
      this.isSaving = false
      this.hide()
    },
    async saveAlgolia () {
      this.isSaving = true
      localStorage.setItem('database.userName', this.userName || '')
      const result = this.addToDatabase()
      if (!result) {
        Notify.create({ type: 'negative', message: 'fout bij toevoegen liederen aan cloud database', position: 'top' })
        this.isSaving = false
        return
      }
      this.isSaving = false
      this.hide()
    },
    edit (song) {
      this.$refs.presentationSettingsDialog.edit(song)
      // no update comparison database in list; does in example highlighting.
    },
    setListDiffWidth () {
      this.SongItemDatabaseWidth = this.$refs.listDiff?.clientWidth * 0.5 || 400
    },
    async getAlgoliaDatabase () {
      this.isSavingDatabase = true
      await GetAlgoliaDatabase(this.$api, this.$fsdb)
      this.isSavingDatabase = false
    }
  }
}
</script>

<style scoped lang="scss">
.q-card {
  min-width: max(75vw, min(1440px, 95vw));
  height: 90vh;

  .q-splitter {
    height: 78vh;

    .songlist {
      height: 72vh;
      overflow-y: scroll;
      overflow-x: hidden;
    }
  }
}
</style>
