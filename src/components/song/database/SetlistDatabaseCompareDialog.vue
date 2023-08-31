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
            <q-tooltip v-if="userName">
              Geselecteerde liederen toevoegen, vervangen & opslaan in database
            </q-tooltip>
            <q-tooltip v-else>
              Let op: Gebruikersnaam invullen voor je kan opslaan!
            </q-tooltip>
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
import BaseSongDatabaseCompare from './BaseSongDatabaseCompare.vue'
import { Notify } from 'quasar'
import cloneDeep from 'lodash/cloneDeep'

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
      SongItemDatabaseWidth: 500
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
      if (!this.$fsdb.localSongDatabase) {
        if (!(await this.$fsdb.openSongDatabase())) {
          // geen database geselecteerd of error bij opgeslagen versie
          // nieuwe maken
          await this.$fsdb.newEmptyDatabase()
          // return
          Notify.create({ type: 'negative', message: 'geen database gevonden, er is een lege database aangemaakt' })
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
    async save (newFile = false) {
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
    edit (song) {
      this.$refs.presentationSettingsDialog.edit(song)
      // geen update vergelijking database in lijst; wel in voorbeeld markering.
    },
    setListDiffWidth () {
      this.SongItemDatabaseWidth = this.$refs.listDiff?.clientWidth * 0.5 || 400
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
