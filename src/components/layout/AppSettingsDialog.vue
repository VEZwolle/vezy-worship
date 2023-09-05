<template>
  <q-dialog ref="dialog" persistent square>
    <q-card>
      <q-toolbar class="bg-secondary text-white">
        <q-toolbar-title>Instellingen</q-toolbar-title>
        <q-btn v-close-popup flat round dense icon="close" />
      </q-toolbar>

      <q-tabs v-model="tab" class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator :breakpoint="0">
        <q-tab name="background" label="Achtergrond" />
        <q-tab name="database" label="Database" />
        <q-tab v-if="$q.platform.is.electron" name="displays" label="Output monitoren" />
        <q-tab v-if="$q.platform.is.electron" name="autoupdate" label="Update" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="displays">
          <q-select v-model="displays.beamer" :options="availableDisplayOptions" emit-value map-options clearable label="Beamer" class="q-mb-sm" />
          <q-select v-model="displays.livestream" :options="availableDisplayOptions" emit-value map-options clearable label="Livestream" class="q-mb-sm" />
          <q-select v-model="displays.livestreamAlpha" :options="availableDisplayOptions" emit-value map-options clearable label="Livestream alpha channel" />
        </q-tab-panel>

        <q-tab-panel name="database">
          <div class="text-h6">
            Standaard liederen bestand:
          </div>
          <div class="row q-pt-sm">
            <div class="col-auto q-pt-xs" v-text="'Cloud'" />
            <div class="col-auto q-pt-sm q-px-xs">
              <img src="../../assets/algolia-logo.svg" height="16">
            </div>
            <q-toggle v-model="searchBaseIsLocal" checked-icon="lyrics" unchecked-icon="cloud" color="primary" dense>
              <q-tooltip>cloud of locale database</q-tooltip>
            </q-toggle>
            <div class="col-auto q-pt-xs" v-text="'Lokaal bestand'" />
          </div>
          <q-select
            v-model="dbCollection"
            label="Standaard collectie"
            emit-value
            outlined
            dense
            options-dense
            :options="dbCollections"
            popup-content-style="height: 30vh;"
            class="q-my-sm"
            @click="loadCollectionDatabase"
            @popup-show="loadCollectionDatabase"
          >
            <template #prepend>
              <q-icon name="book" />
            </template>
            <template v-if="dbCollection" #append>
              <q-icon name="cancel" class="cursor-pointer" @click="dbCollection = ''" />
            </template>
          </q-select>
          <q-separator color="secondary" class="q-my-md" />
          <div class="text-h6">
            Cloud algolia:
          </div>
          <q-btn label="Opslaan als database bestand" :loading="isLoading" color="primary" @click="saveAlgoliaDatabase" />
          <q-separator color="secondary" class="q-my-md" />
          <div class="text-h6">
            Lokale database:
          </div>
          <div class="row">
            <q-btn label="Database instellen/openen" color="primary" @click="loadSongDatabase" />
            <q-btn label="Lege database aanmaken" color="primary" class="col-auto q-ml-md" @click="newSongDatabase" />
          </div>
          (wordt direct ingesteld bij geldige database)
          <q-badge v-if="songDatabase" class="q-mb-sm">
            {{ songDatabase }}
          </q-badge>
          <div class="row q-mt-sm">
            <q-btn label="Lokale database bewerken" color="primary" @click="editSongLocalDatabase" />
            <q-input v-model="userName" dense outlined class="q-ml-md" label="Gebruikersnaam">
              <q-tooltip>Naam waaronder wijzigingen in de database worden opgeslagen</q-tooltip>
            </q-input>
          </div>
        </q-tab-panel>

        <q-tab-panel name="autoupdate">
          <q-checkbox v-model="autoupdate" label="Automatisch download & update Vezyworship" />
          <div>Wanneer er een update beschikbaar is wordt deze gedownload en na afsluiten van Vezyworship geinstalleerd.</div>
        </q-tab-panel>

        <q-tab-panel name="background">
          <q-input v-model="backgroundColor.beamer" clearable :rules="['anyColor']" label="Beamer achtergrond kleur (Leeg voor foto)" class="q-mb-sm">
            <template #append>
              <q-icon name="colorize" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-color v-model="backgroundColor.beamer" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input v-model="backgroundColor.livestream" clearable :rules="['anyColor']" label="Livestream achtergrond kleur (leeg voor zwart)" class="q-mb-sm">
            <template #append>
              <q-icon name="colorize" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-color v-model="backgroundColor.livestream" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-tab-panel>
      </q-tab-panels>

      <q-card-actions align="right">
        <q-btn color="secondary" label="Opslaan" icon="save" @click="save" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <SearchDatabaseDialog ref="SearchDatabaseDialog" />
</template>

<script>
import { getAlgoliaDatabase, getAlgoliaCollections } from '../song/database/algolia.js'

export default {
  data () {
    return {
      availableDisplays: [],
      displays: {},
      backgroundColor: {
        beamer: '',
        livestream: ''
      },
      autoupdate: true,
      songDatabase: '',
      dbCollection: '',
      dbCollections: [''],
      userName: '',
      searchBaseIsLocal: true,
      isLoading: false,
      tab: 'background'
    }
  },
  computed: {
    availableDisplayOptions () {
      return this.availableDisplays.map((display, i) => ({
        value: i,
        label: `Monitor ${i + 1}`
      }))
    }
  },
  methods: {
    async show () {
      await this.load()
      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    },
    async load () {
      if (this.$q.platform.is.electron) {
        this.availableDisplays = await this.$electron.getAllDisplays()
        this.displays = await this.$electron.getConfig('displays') || {}
        this.autoupdate = await this.$electron.getConfig('autoupdate')
        if (this.autoupdate === undefined) this.autoupdate = true
      }
      this.backgroundColor.beamer = localStorage.getItem('backgroundColor.beamer') || ''
      this.backgroundColor.livestream = localStorage.getItem('backgroundColor.livestream') || ''
      this.dbCollection = localStorage.getItem('database.collection') || ''
      this.userName = localStorage.getItem('database.userName') || ''
      this.searchBaseIsLocal = !(localStorage.getItem('database.searchBase') === 'cloud' || false)
    },
    async save () {
      if (this.$q.platform.is.electron) {
        await this.$electron.setConfig('displays', { ...this.displays })
        await this.$electron.setConfig('autoupdate', this.autoupdate)
      }
      localStorage.setItem('backgroundColor.beamer', this.backgroundColor.beamer || '')
      localStorage.setItem('backgroundColor.livestream', this.backgroundColor.livestream || '')
      localStorage.setItem('database.collection', this.dbCollection || '')
      localStorage.setItem('database.userName', this.userName || '')
      localStorage.setItem('database.searchBase', this.searchBaseIsLocal ? 'local' : 'cloud')

      this.$q.dialog({
        title: '✅ Wijzigingen opgeslagen',
        message: 'De wijzigingen worden van kracht zodra je de applicatie opnieuw opstart.'
      })
    },
    async loadSongDatabase () {
      await this.$fsdb.openSongDatabase(true)
      this.songDatabase = await this.$fsdb.getSongDatabaseSettings()
    },
    async loadCollectionDatabase () {
      if (this.searchBaseIsLocal) {
        this.dbCollections = await this.$fsdb.getCollections(true)
        this.songDatabase = await this.$fsdb.getSongDatabaseSettings()
        return
      }
      this.dbCollections = await getAlgoliaCollections(this.$api)
    },
    async newSongDatabase () {
      await this.$fsdb.newEmptyDatabase()
      await this.$fsdb.saveSongDatabase(true)
      this.dbCollections = ['']
      this.songDatabase = await this.$fsdb.getSongDatabaseSettings()
    },
    editSongLocalDatabase () {
      this.$store.searchBaseIsLocal = true
      this.$refs.SearchDatabaseDialog.show(true)
    },
    async saveAlgoliaDatabase () {
      this.isLoading = true
      await getAlgoliaDatabase(this.$api, this.$fsdb)
      this.isLoading = false
    }
  }
}
</script>

<style scoped>
.q-card {
  min-width: 500px;
}
</style>
