<template>
  <q-dialog ref="dialog" persistent square>
    <q-card>
      <q-toolbar class="bg-secondary text-white">
        <q-toolbar-title>Instellingen</q-toolbar-title>
        <q-btn v-close-popup flat round dense icon="close" />
      </q-toolbar>

      <q-tabs v-model="tab" class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator :breakpoint="0">
        <q-tab name="settings" label="Opmaak" />
        <q-tab name="api" label="api-key's" />
        <q-tab name="database" label="Zoeken/database" />
        <q-tab v-if="$q.platform.is.electron" name="displays" label="Output monitoren" />
        <q-tab v-if="$q.platform.is.electron" name="autoupdate" label="Update" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="displays">
          <q-select v-model="displays.beamer" :options="availableDisplayOptions" emit-value map-options clearable label="Beamer" class="q-mb-sm" />
          <q-select v-model="displays.livestream" :options="availableDisplayOptions" emit-value map-options clearable label="Livestream" class="q-mb-sm" />
          <q-select v-model="displays.livestreamAlpha" :options="availableDisplayOptions" emit-value map-options clearable label="Livestream alpha channel" class="q-mb-sm" />
          <q-select v-model="displays.pcolive" :options="availableDisplayOptions" emit-value map-options clearable label="PCO Live" />
        </q-tab-panel>

        <q-tab-panel name="settings">
          <div class="text-h6">
            Lied opdelen
          </div>
          <q-input
            v-model.number="$store.splitSongLines"
            type="number"
            outlined
            stack-label
            min="0"
            label="Splitsen aantal regels lied op beamer"
            :rules="[min0]"
          >
            <q-tooltip>
              Aantal regels zichtbaar op beamer<br>
              0 = niet opslplitsen.
            </q-tooltip>
          </q-input>

          <q-separator color="secondary" class="q-my-md" />

          <div class="text-h6">
            Achtergrond
          </div>
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

        <q-tab-panel name="api">
          <div class="text">
            Voor het gebruik van onderstaande functies is een api - key nodig.
            <q-list dense>
              <q-item v-for="(apiFunction, index) in apiFunctions" :key="`api${index}`">
                <q-item-section avatar>
                  <q-icon color="primary" :name="apiFunction.icon" />
                </q-item-section>
                <q-item-section>{{ apiFunction.name }}</q-item-section>
              </q-item>
            </q-list>
          </div>
          <q-input v-model="vezyWorshipApiToken" dense outlined class="q-pt-md" label="Api key: gebruik online functies">
            <q-tooltip>Api key voor gebruik online functies</q-tooltip>
            <template #append>
              <q-icon v-if="vezyWorshipApiToken" name="cancel" class="cursor-pointer" @click="vezyWorshipApiToken = ''" />
            </template>
          </q-input>
          <q-separator color="secondary" class="q-my-md" />
          <div class="text">
            Voor het bewerken van de cloud liederen database is extra api - key nodig:
          </div>
          <img src="../../assets/algolia-logo.svg" height="16">
          <q-input v-model="apiKeyEdit" dense outlined label="Api key: bewerken online gegevens algolia">
            <q-tooltip>Api key voor bewerken database algolia</q-tooltip>
            <template #append>
              <q-icon v-if="apiKeyEdit" name="cancel" class="cursor-pointer" @click="apiKeyEdit = ''" />
            </template>
          </q-input>
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
          <div class="row q-mt-sm">
            <q-btn label="Downloaden voor offline gebruik" :loading="isLoading" color="primary" @click="saveAlgoliaDatabase" />
            <template v-if="apiKeyEdit === 'is ingesteld'">
              <q-space />
              <q-input v-model="userName" dense outlined class="q-mr-md" label="Gebruikersnaam bewerken">
                <q-tooltip>Naam waaronder wijzigingen in de database worden opgeslagen</q-tooltip>
              </q-input>
              <q-btn :disable="apiKeyEdit !== 'is ingesteld'" label="bewerken" color="primary" @click="editSongAlgoliaDatabase" />
            </template>
          </div>
          <q-separator color="secondary" class="q-my-md" />
          <div class="text-h6">
            Lokale database:
          </div>
          <div class="row">
            <q-btn label="Instellen" color="primary" @click="loadSongDatabase" />
            <q-btn label="Aanmaken" color="primary" class="col-auto q-ml-md" @click="newSongDatabase" />
            <q-space />
            <q-input v-model="userName" dense outlined class="q-mr-md" label="Gebruikersnaam bewerken">
              <q-tooltip>Naam waaronder wijzigingen in de database worden opgeslagen</q-tooltip>
            </q-input>
            <q-btn label="bewerken" color="primary" @click="editSongLocalDatabase" />
          </div>
          (wordt direct ingesteld bij geldige database)
          <q-badge v-if="songDatabase" class="q-mb-sm">
            {{ songDatabase }}
          </q-badge>
        </q-tab-panel>

        <q-tab-panel name="autoupdate">
          <q-checkbox v-model="autoupdate" label="Automatisch download & update Vezyworship" />
          <div>Wanneer er een update beschikbaar is wordt deze gedownload en na afsluiten van Vezyworship geinstalleerd.</div>
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
import { GetAlgoliaDatabase, getAlgoliaCollections } from '../song/database/algolia.js'

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
      apiKeyEdit: '',
      vezyWorshipApiToken: '',
      isLoading: false,
      tab: 'settings',
      apiFunctions: [
        {
          name: 'Inladen versen uit de bijbel vertalingen',
          icon: 'menu_book'
        },
        {
          name: 'Inladen planning / liederen uit planning center online (PCO)',
          icon: 'list'
        },
        {
          name: 'Vertaling & taal splitsen via DeepL',
          icon: 'translate'
        },
        {
          name: 'Zoeken & downloaden liederen via cloud (Algolia)',
          icon: 'img:images/algolia-mark.svg'
        }
      ]
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
      this.apiKeyEdit = localStorage.getItem('database.apiKeyEdit') ? 'is ingesteld' : ''
      this.searchBaseIsLocal = !(localStorage.getItem('database.searchBase') === 'cloud' || false)
      this.vezyWorshipApiToken = localStorage.getItem('VezyWorshipApiToken') ? 'is ingesteld' : ''
      this.$store.splitSongLines = localStorage.getItem('splitSongLines') ? parseInt(localStorage.getItem('splitSongLines')) : 4
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
      if (this.apiKeyEdit !== 'is ingesteld') localStorage.setItem('database.apiKeyEdit', this.apiKeyEdit || '')
      localStorage.setItem('database.searchBase', this.searchBaseIsLocal ? 'local' : 'cloud')
      if (this.vezyWorshipApiToken !== 'is ingesteld') localStorage.setItem('VezyWorshipApiToken', this.vezyWorshipApiToken || '')
      localStorage.setItem('splitSongLines', this.$store.splitSongLines || 4)

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
      this.dbCollections = await getAlgoliaCollections()
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
    editSongAlgoliaDatabase () {
      this.$store.searchBaseIsLocal = false
      this.$refs.SearchDatabaseDialog.show(true)
    },
    async saveAlgoliaDatabase () {
      this.isLoading = true
      await GetAlgoliaDatabase()
      this.isLoading = false
    },
    min0 (val) {
      if (typeof val !== 'number') {
        return
      }
      return val >= 0 || 'Minimaal 0'
    }
  }
}
</script>

<style scoped>
.q-card {
  min-width: 700px;
}
</style>
