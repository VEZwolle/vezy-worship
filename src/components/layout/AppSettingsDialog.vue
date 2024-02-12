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
          <q-select v-model="displays.beamerAlpha" :options="availableDisplayOptions" emit-value map-options clearable label="Beamer alpha channel" class="q-mb-sm" />
          <q-select v-model="displays.livestream" :options="availableDisplayOptions" emit-value map-options clearable label="Livestream" class="q-mb-sm" />
          <q-select v-model="displays.livestreamAlpha" :options="availableDisplayOptions" emit-value map-options clearable label="Livestream alpha channel" class="q-mb-sm" />
          <q-select v-model="displays.stage" :options="availableDisplayOptions" emit-value map-options clearable label="Stage monitor" class="q-mb-sm" />
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
          <q-input v-model="backgroundColor.beamer" clearable :rules="['anyColor']" label="Beamer achtergrond kleur (Leeg voor foto; of iets voor gebruik alpha channel)" class="q-mb-sm">
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

          <q-separator color="secondary" class="q-my-md" />

          <div class="text-h6">
            Dienst type
          </div>
          <q-select v-model="$store.serviceType" :options="serviceTypes" emit-value map-options label="Dienst type" class="q-mb-sm" />

          <q-separator color="secondary" class="q-my-md" />

          <q-toggle
            v-model="darkMode"
            label="Donkere modes"
            @click.stop="toggleDarkMode"
          />
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
          <div class="row">
            <div class="col">
              <div class="row">
                <div class="col-auto q-pt-xs text-h6" v-text="'Cloud '" />
                <div class="col-auto q-pt-sm q-px-xs">
                  <img src="../../assets/algolia-logo.svg" height="24">
                </div>
                <div class="col-auto q-pt-xs text-h6" v-text="' : '" />
              </div>
            </div>
            <q-select
              v-model="algoliaIndexId"
              label="Standaard Algolia database voor zoeken"
              emit-value
              outlined
              dense
              options-dense
              map-options
              :options="algoliaIndexNames"
              class="q-my-sm col"
              @update:model-value="resetDbCollections"
            />
          </div>
          <q-tabs v-model="algoliaTab" class="text-grey" active-color="primary" indicator-color="primary" align="left" :breakpoint="0">
            <q-tab v-for="algoliaIndexName in algoliaIndexNames" :key="algoliaIndexName.value" :name="algoliaIndexName.value" :label="algoliaIndexName.label" />
          </q-tabs>
          <q-tab-panels v-model="algoliaTab" animated>
            <q-tab-panel v-for="(algoliaIndexName, index) in algoliaIndexNames" :key="algoliaIndexName.value" :name="algoliaIndexName.value">
              <div class="row q-mt-sm">
                <q-btn label="Downloaden voor offline gebruik" :loading="isLoading" color="primary" @click="saveAlgoliaDatabase(algoliaIndexName.value)" />
                <template v-if="apiKeyEdit[index] === 'is ingesteld'">
                  <q-space />
                  <q-input v-model="userName" dense outlined class="q-mr-md" label="Gebruikersnaam bewerken">
                    <q-tooltip>Naam waaronder wijzigingen in de database worden opgeslagen</q-tooltip>
                  </q-input>
                  <q-btn :disable="apiKeyEdit[index] !== 'is ingesteld'" label="bewerken" color="primary" @click="editSongAlgoliaDatabase(algoliaIndexName.value)" />
                </template>
              </div>
              <q-separator color="secondary" class="q-my-md" />
              <div class="text">
                Voor het bewerken van de cloud liederen database is extra api - key nodig:
              </div>
              <q-input v-model="apiKeyEdit[index]" dense outlined label="Api key: bewerken online gegevens algolia">
                <q-tooltip>Api key voor bewerken database algolia</q-tooltip>
                <template #append>
                  <q-icon v-if="apiKeyEdit[index]" name="cancel" class="cursor-pointer" @click="apiKeyEdit[index] = ''" />
                </template>
              </q-input>
            </q-tab-panel>
          </q-tab-panels>
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
import { GetAlgoliaDatabase, getAlgoliaCollections, algoliaIndexNames } from '../song/database/algolia.js'

export default {
  data () {
    return {
      darkMode: false,
      availableDisplays: [],
      displays: {},
      backgroundColor: {
        beamer: '',
        livestream: ''
      },
      serviceTypes: [
        'standaard',
        'glow'
      ],
      autoupdate: true,
      songDatabase: '',
      dbCollection: '',
      dbCollections: [''],
      userName: '',
      searchBaseIsLocal: true,
      apiKeyEdit: [],
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
      ],
      algoliaTab: 0,
      algoliaIndexId: 0
    }
  },
  computed: {
    availableDisplayOptions () {
      return this.availableDisplays.map((display, i) => ({
        value: i,
        label: `Monitor ${i + 1}`
      }))
    },
    algoliaIndexNames () {
      return algoliaIndexNames
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
      for (let i = 0; i < this.algoliaIndexNames.length; i++) {
        this.apiKeyEdit.push(localStorage.getItem(this.algoliaIndexNames[i].apiKeyEdit) ? 'is ingesteld' : '')
      }
      this.algoliaIndexId = localStorage.getItem('database.algoliaIndexId') ? parseInt(localStorage.getItem('database.algoliaIndexId')) : 0
      this.algoliaTab = this.algoliaIndexId
      this.searchBaseIsLocal = !(localStorage.getItem('database.searchBase') === 'cloud' || false)
      this.vezyWorshipApiToken = localStorage.getItem('VezyWorshipApiToken') ? 'is ingesteld' : ''
      this.$store.splitSongLines = localStorage.getItem('splitSongLines') ? parseInt(localStorage.getItem('splitSongLines')) : 4
      this.$store.serviceType = localStorage.getItem('serviceType') || 'standaard'
      this.darkMode = localStorage.getItem('darkMode') === 'true'
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
      for (let i = 0; i < this.algoliaIndexNames.length; i++) {
        if (this.apiKeyEdit[i] !== 'is ingesteld') localStorage.setItem(this.algoliaIndexNames[i].apiKeyEdit, this.apiKeyEdit[i] || '')
      }
      localStorage.setItem('database.algoliaIndexId', this.algoliaIndexId || 0)
      localStorage.setItem('database.searchBase', this.searchBaseIsLocal ? 'local' : 'cloud')
      if (this.vezyWorshipApiToken !== 'is ingesteld') localStorage.setItem('VezyWorshipApiToken', this.vezyWorshipApiToken || '')
      localStorage.setItem('splitSongLines', this.$store.splitSongLines || 4)
      localStorage.setItem('serviceType', this.$store.serviceType || 'standaard')
      localStorage.setItem('darkMode', this.$q.dark.isActive)

      this.$q.dialog({
        title: '✅ Wijzigingen opgeslagen',
        message: 'De wijzigingen worden van kracht zodra je de applicatie opnieuw opstart.'
      })
    },
    async loadSongDatabase () {
      await this.$fsdb.openSongDatabase(true)
      this.songDatabase = await this.$fsdb.getSongDatabaseSettings()
    },
    resetDbCollections () {
      this.dbCollections = ['']
    },
    async loadCollectionDatabase () {
      if (this.searchBaseIsLocal) {
        this.dbCollections = await this.$fsdb.getCollections(true)
        this.songDatabase = await this.$fsdb.getSongDatabaseSettings()
        return
      }
      this.dbCollections = await getAlgoliaCollections(this.algoliaIndexId) // use default choice of algolia database
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
    editSongAlgoliaDatabase (indexId = 0) {
      this.$store.searchBaseIsLocal = false
      this.$store.algoliaIndexId = indexId
      this.$refs.SearchDatabaseDialog.show(true)
    },
    async saveAlgoliaDatabase (indexId = 0) {
      this.isLoading = true
      await GetAlgoliaDatabase(indexId)
      this.isLoading = false
    },
    min0 (val) {
      if (typeof val !== 'number') {
        return
      }
      return val >= 0 || 'Minimaal 0'
    },
    toggleDarkMode () {
      this.$q.dark.toggle()
      this.darkMode = this.$q.dark.isActive
    }
  }
}
</script>

<style scoped>
.q-card {
  min-width: 700px;
}
</style>
