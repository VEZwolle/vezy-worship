<template>
  <q-dialog ref="dialog" persistent square>
    <q-card>
      <q-toolbar class="bg-secondary text-white">
        <q-toolbar-title>Instellingen</q-toolbar-title>
        <q-btn v-close-popup flat round dense icon="close" @click="hide" />
      </q-toolbar>

      <q-tabs v-model="tab" class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator :breakpoint="0">
        <q-tab name="settings" label="Opmaak" />
        <q-tab name="api" label="api-key's" />
        <q-tab name="database" label="Zoeken/database" />
        <q-tab v-if="$q.platform.is.electron" name="displays" label="Output monitoren" />
        <q-tab v-if="$q.platform.is.electron" name="osc" label="OSC" />
        <q-tab v-if="$q.platform.is.electron" name="images" label="Standaard media" />
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
          <q-toggle v-model="showDisplayNr" checked-icon="check" color="primary" label="Monitor nummer weergeven" unchecked-icon="clear" @click="toggleShowDisplayNr" />
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

        <q-tab-panel name="osc">
          <q-checkbox v-model="osc.enabled" label="Output: OSC (Open Sound Control)" />
          <div>
            De data die via het OSC-protocol wordt verzonden is alleen platte teksten (zonder opmaak).<br>
            Er worden geen plaatjes of films verzonden. (zie de help voor meer infromatie.)
          </div>
          <div class="row">
            <q-input v-model="osc.outAddress" dense outlined class="col" label="OSC ontvanger adres (IP of DNS):">
              <q-tooltip>Bij gelijke computer: localhost<br> v.b.: 192.168.0.10</q-tooltip>
              <template #append>
                <q-icon v-if="osc.outAddress" name="cancel" class="cursor-pointer" @click="osc.outAddress = 'localhost'" />
              </template>
            </q-input>
            <q-input v-model="osc.outPort" dense outlined type="number" class="col2" label="OSC ontvanger poort:">
              <q-tooltip>Bij gelijke computer: localhost<br> v.b.: 192.168.0.10</q-tooltip>
              <template #append>
                <q-icon v-if="osc.outPort" name="cancel" class="cursor-pointer" @click="osc.outPort = 7000" />
              </template>
            </q-input>
          </div>
          <q-separator color="secondary" class="q-my-md" />
          <q-list dense bordered padding>
            <q-item-label header>Standaard bestemmingen</q-item-label>

            <q-item v-for="(value, name) in osc.output" :key="name" clickable v-ripple>
              <q-item-section>
                <q-input v-model="osc.output[name]" :label="name" label-color="secondary" stack-label dense>
                  <template #append>
                    <q-icon v-if="value" name="cancel" class="cursor-pointer" @click="osc.output[name] = ''" />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
          </q-list>
          <q-btn label="Bestemmingen terug naar standaard" @click="oscReset" />
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

        <q-tab-panel name="images">
          <div class="q-mb-sm">
            Stel hier onder eigen plaatjes bestanden in voor de verschillende onderdelen. (1920x1080)
          </div>
          <div v-for="(imageFile, index) in imageFiles" :key="index" class="row q-gutter-sm">
            <div class="col q-gutter-sm">
              <q-btn color="primary" icon="image" :label="`Beamer: ${imageFile.label}`" class="full-width" @click="openPresentationPresetsSettings(imageFile.beamer)" />
              <template v-if="imageFile.beamer.handle">
                <q-btn dence @click="removePresentationPresetsSettings(imageFile.beamer)">
                  <q-img :key="imageFile.beamer" :src="imageFile.beamer.URL" height="9vh" :width="imageWidth" :style="imageBgStyle">
                    <q-tooltip>{{ imageFile.beamer.handle.name }}</q-tooltip>
                  </q-img>
                  <q-icon right name="close" />
                </q-btn>
              </template>
              <q-img v-else :key="imageFile.beamer" :src="imageFile.beamer.baseFileId" height="9vh" :width="imageWidth" :style="imageBgStyle" />
            </div>
            <div v-if="imageFile.name !== 'background'" class="col q-gutter-sm">
              <q-btn dence color="primary" icon="image" :label="`Livestream: ${imageFile.label}`" class="full-width" @click="openPresentationPresetsSettings(imageFile.livestream)" />
              <template v-if="imageFile.livestream.handle">
                <q-img :key="imageFile.livestream" :src="imageFile.livestream.URL" height="9vh" :width="imageWidth" :style="imageBgStyle">
                  <q-tooltip>{{ imageFile.livestream.handle.name }}</q-tooltip>
                </q-img>
                <q-btn icon="close" @click="removePresentationPresetsSettings(imageFile.livestream)" />
              </template>
              <q-img v-else :key="imageFile.livestream" :src="imageFile.livestream.baseFileId" height="9vh" :width="imageWidth" :style="imageBgStyle" />
            </div>
          </div>
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
import { defineComponent } from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import { GetAlgoliaDatabase, getAlgoliaCollections, algoliaIndexNames } from '../song/database/algolia.js'
import { imageFiles, openPresentationPresetsSettings, removePresentationPresetsSettings, setPresentationPresetsSettings } from '../presets-settings.js'
import oscOutput from '../osc-output-settings.js'

export default defineComponent({
  name: 'AppSettingsDialog',
  data () {
    return {
      showDisplayNr: false,
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
      algoliaIndexId: 0,
      imageFiles,
      osc: {
        enabled: true,
        outAddress: 'localhost',
        outPort: 7000,
        output: {}
      }
    }
  },
  computed: {
    availableDisplayOptions () {
      return this.availableDisplays.map((display, i) => ({
        value: i,
        label: `Monitor ${i + 1} (${display.size?.width}x${display.size?.height}) ${display.internal ? 'intern' : display.label}`
      }))
    },
    algoliaIndexNames () {
      return algoliaIndexNames
    },
    imageWidth () {
      return `${9 * this.$store.outputRatio}vh`
    },
    imageBgStyle () {
      const style = {}
      if (this.$q.dark.isActive) {
        style.backgroundImage = 'repeating-conic-gradient(#656565 0% 25%, #595959 0% 50%)'
      } else {
        style.backgroundImage = 'repeating-conic-gradient(#fefefe 0% 25%, #eee 0% 50%)'
      }
      style.backgroundSize = '16px 16px'
      style.backgroundBlendMode = 'screen'
      return style
    }
  },
  methods: {
    async show () {
      await this.load()
      this.$refs.dialog.show()
    },
    hide () {
      if (this.$q.platform.is.electron) {
        if (this.showDisplayNr) {
          // remove display nummer
          this.showDisplayNr = false
          this.toggleShowDisplayNr()
        }
      }
      // this.$refs.dialog.hide() // --> v-close-popup
    },
    async load () {
      if (this.$q.platform.is.electron) {
        this.availableDisplays = await this.$electron.getAllDisplays()
        this.displays = await this.$electron.getConfig('displays') || {}
        this.autoupdate = await this.$electron.getConfig('autoupdate')
        if (this.autoupdate === undefined) this.autoupdate = true
        // image settings load by toolbar on new/open/appsettings start
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
      this.osc.enabled = localStorage.getItem('oscEnabled') === 'true'
      this.osc.outAddress = localStorage.getItem('oscOutAddress') || 'localhost'
      this.osc.outPort = parseInt(localStorage.getItem('oscOutPort')) || 7000
      this.osc.output = JSON.parse(localStorage.getItem('oscOutput')) || cloneDeep(oscOutput)
    },
    async save () {
      if (this.$q.platform.is.electron) {
        await this.$electron.setConfig('displays', { ...this.displays })
        await this.$electron.setConfig('autoupdate', this.autoupdate)
        setPresentationPresetsSettings() // save image handle's or empty
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

      localStorage.setItem('oscEnabled', this.osc.enabled )
      localStorage.setItem('oscOutAddress', this.osc.outAddress)
      localStorage.setItem('oscOutPort', this.osc.outPort)
      localStorage.setItem('oscOutput', JSON.stringify(this.osc.output))
      this.$store.$patch({ osc: this.osc })

      this.$q.dialog({
        title: '✅ Wijzigingen opgeslagen',
        message: 'Een deel van de wijzigingen worden pas van kracht zodra je de applicatie opnieuw opstart.'
      })

      // add ... close dialog
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
    openPresentationPresetsSettings (imageFileOutput) {
      openPresentationPresetsSettings(imageFileOutput)
    },
    removePresentationPresetsSettings (imageFileOutput) {
      removePresentationPresetsSettings(imageFileOutput)
    },
    toggleDarkMode () {
      this.$q.dark.toggle()
      this.darkMode = this.$q.dark.isActive
    },
    async toggleShowDisplayNr () {
      if (this.$q.platform.is.electron) {
        this.showDisplayNr = await this.$electron.showDisplaysNr(this.showDisplayNr)
      }
    },
    oscReset () {
      this.osc.output = cloneDeep(oscOutput)
    }
  }
})
</script>

<style scoped>
.q-card {
  min-width: 700px;
}
</style>
