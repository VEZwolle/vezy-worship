<template>
  <q-toolbar class="app-toolbar">
    <q-icon :name="`img:${icon}`" size="md" />

    <q-btn
      v-shortkey="['ctrl', 'n']"
      flat
      icon="add"
      label="Nieuwe dienst"
      @click="create"
      @shortkey="create"
    />

    <q-btn-dropdown
      v-shortkey="['ctrl', 'o']"
      split
      flat
      icon="folder_open"
      label="Open dienst"
      :loading="isLoading"
      @click="open(false)"
      @shortkey="open(false)"
    >
      <q-list>
        <q-item v-close-popup clickable :disable="!$store.service" @click="open(true)">
          <q-item-section>
            <q-item-label>Toevoegen aan...</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <q-btn-dropdown
      v-shortkey="['ctrl', 's']"
      split
      flat
      icon="save"
      label="Dienst opslaan"
      :disable="!$store.service"
      :loading="isSaving"
      @click="save(false)"
      @shortkey="save(false)"
    >
      <q-list>
        <q-item v-close-popup clickable @click="save(true)">
          <q-item-section>
            <q-item-label>Opslaan als</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-close-popup clickable @click="compareSongData(true)">
          <q-item-section>
            <q-item-label>
              Toevoegen aan lokale database
              <q-tooltip>
                Liederen uit de setlist vergelijken en toevoegen aan de lokale database
              </q-tooltip>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="apiKeyEditExist" v-close-popup clickable @click="compareSongData(false)">
          <q-item-section>
            <q-item-label>
              Toevoegen aan cloud database
              <q-tooltip>
                Liederen uit de setlist vergelijken en toevoegen aan de cloud (algolia) gegevens
              </q-tooltip>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <q-space />
    <MessageControl />
    <q-space />

    <div v-if="!$q.platform.is.electron">
      Open output:

      <q-btn
        flat
        icon="videocam"
        dense
        class="q-mr-sm"
        @click="openOutput('beamer')"
      >
        <q-tooltip>
          Beamer
        </q-tooltip>
      </q-btn>

      <q-btn
        flat
        icon="smart_display"
        dense
        class="q-mr-sm"
        @click="openOutput('livestream')"
      >
        <q-tooltip>
          Livestream
        </q-tooltip>
      </q-btn>

      <q-btn
        flat
        icon="dvr"
        dense
        @click="openOutput('stage')"
      >
        <q-tooltip>
          Stage
        </q-tooltip>
      </q-btn>
      <span class="q-px-md">|</span>
    </div>

    <div>
      VezyWorship v{{ version }}
      <q-tooltip v-if="autoupdate.message">
        {{ autoupdate.message }}
      </q-tooltip>
    </div>
    <q-circular-progress
      v-if="autoupdate.percent"
      :indeterminate="autoupdate.indeterminateProgress"
      :show-value="!autoupdate.indeterminateProgress"
      :value="autoupdate.percent"
      size="md"
      class="q-ml-sm"
    >
      {{ autoupdate.percent }}%
      <q-tooltip>
        {{ autoupdate.message }}
      </q-tooltip>
    </q-circular-progress>

    <q-btn
      flat
      icon="settings"
      dense
      class="q-ml-sm"
      @click="openAppSettings"
    >
      <q-tooltip>Instellingen</q-tooltip>
    </q-btn>

    <q-btn
      flat
      icon="list"
      dense
      class="q-ml-sm"
      :disable="!$store.service"
      @click="openPcoLive(false)"
    >
      <q-tooltip>
        Open PCO live {{ $store.service?.pcoId ? 'van huidige dienst' : 'met dienst id' }}
      </q-tooltip>
      <q-menu context-menu no-focus>
        <q-list v-show="$store.service" dense style="min-width: 100px">
          <q-item v-close-popup clickable @click.stop="openPcoLiveWindow(true)">
            <q-item-section>leeg pco live scherm</q-item-section>
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white" size="28px" flat round icon="clear" />
            </q-item-section>
          </q-item>
          <q-item v-close-popup clickable @click.stop="openPcoLive(true)">
            <q-item-section>Open Pco live met nieuw ID</q-item-section>
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white" size="28px" flat round icon="list" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>

    <q-btn
      flat
      icon="help"
      dense
      class="q-ml-sm"
      @click="openHelp"
    >
      <q-tooltip>Helpinformatie</q-tooltip>
    </q-btn>
  </q-toolbar>

  <ServiceSettingsDialog ref="serviceSettingsDialog" />
  <AppSettingsDialog ref="appSettingsDialog" />
  <SetlistDatabaseCompareDialog ref="SetlistDatabaseCompareDialog" />
</template>

<script>
import ServiceSettingsDialog from '../service/ServiceSettingsDialog'
import AppSettingsDialog from './AppSettingsDialog'
import SetlistDatabaseCompareDialog from '../song/database/SetlistDatabaseCompareDialog.vue'
import icon from 'assets/icon.svg'
import PACKAGE from '../../../package.json'
import MessageControl from '../message/MessageControl'
import { ApiKeyEdit } from '../song/database/algolia.js'

export default {
  components: { ServiceSettingsDialog, AppSettingsDialog, MessageControl, SetlistDatabaseCompareDialog },
  setup () {
    return { icon, version: PACKAGE.version }
  },
  data () {
    return {
      isSaving: false,
      isLoading: false,
      autoupdate: {
        message: '',
        percent: 0,
        indeterminateProgress: false
      }
    }
  },
  computed: {
    saved () {
      return (JSON.stringify(this.$store.service) === this.$store.serviceSaved) || !this.$store.service
    },
    apiKeyEditExist () {
      return ApiKeyEdit(this.$store.algoliaIndexId)
    }
  },
  created () {
    if (this.$q.platform.is.electron) {
      window.electron.onAppClose((event, key) => {
        if (this.saved || confirm('Aangebrachte wijzigingen worden niet opgeslagen.')) {
          this.$electron.closeApp()
        }
      })
      const autoupdateCheck = this.$electron.getConfig('autoupdate')
      if (autoupdateCheck === undefined || autoupdateCheck) {
        window.electron.onAutoUpdate((event, status, percent, message) => {
          switch (status) {
            case -1:
              this.autoupdate.percent = percent
              // eslint-disable-next-line
            case 0:
            case 1:
              this.autoupdate.message = message
              break
            case 2:
              this.autoupdate.indeterminateProgress = true
              this.autoupdate.percent = percent
              this.autoupdate.message = message
              this.$q.notify({ type: 'positive', message: this.autoupdate.message })
              break
            case 3:
              this.autoupdate.indeterminateProgress = false
              this.autoupdate.percent = Math.round(percent)
              break
            case 4:
              this.autoupdate.indeterminateProgress = false
              this.autoupdate.message = message
              this.autoupdate.percent = percent
              this.$q.notify({ type: 'positive', message: this.autoupdate.message })
              break
            default:
          }
        })
      }
    } else {
      // not working on electron -> blijft open.... en geen vraag.
      window.onbeforeunload = (event) => {
        if (this.saved) {
          event.preventDefault()
        } else {
          event.returnValue = 'false'
        }
      }
    }
  },
  methods: {
    create () {
      if (this.saved || confirm('Aangebrachte wijzigingen worden niet opgeslagen.')) this.$refs.serviceSettingsDialog.show()
    },
    open (add) {
      if (this.saved || confirm('Aangebrachte wijzigingen worden niet opgeslagen.')) {
        this.isLoading = true
        this.$fs.open(add)
          .finally(() => {
            this.isLoading = false
          })
      }
    },
    save (showPicker) {
      this.isSaving = true
      this.$fs.save(showPicker)
        .finally(() => {
          this.isSaving = false
        })
    },
    compareSongData (local = true) {
      this.$store.searchBaseIsLocal = local
      this.$refs.SetlistDatabaseCompareDialog.show()
    },
    openOutput (id) {
      window.open(`/#/output/${id}`, `output${id}`, 'popup,width=960,height=540')
    },
    openAppSettings () {
      this.$refs.appSettingsDialog.show()
    },
    openHelp () {
      window.open('/#/help', 'vezyWorshipHelp', 'popup,width=1000,height=800')
    },
    openPcoLive (newId = false) {
      if (!newId && this.$store.service?.pcoId) {
        return this.openPcoLiveWindow()
      }
      this.$q.dialog({
        title: 'Geef PCO dienst id:',
        message: 'zie einde url pco service: \nbijv. https://services.planningcenteronline.com/plans/55984013',
        prompt: {
          model: '55984013',
          isValid: val => val.length > 5,
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        this.$store.service.pcoId = `0-${data}` // add check/remove error input??
        this.openPcoLiveWindow()
      })
    },
    openPcoLiveWindow (blank = false) {
      if (blank) return window.open('about:blank', 'pcoLive', 'popup,width=960,height=540')
      const url = this.pcoLiveUrl()
      window.open(url, 'pcoLive', 'popup,width=960,height=540')
    },
    pcoLiveUrl () {
      if (this.$store.service?.pcoId) {
        const service = this.splitPcoId(this.$store.service?.pcoId)
        // live of plan
        if (service.planId) return `https://services.planningcenteronline.com/live/${service.planId}`
        // next comming plan of serviceType
        if (service.serviceTypeId) return `https://services.planningcenteronline.com/service_types/${service.serviceTypeId}/plans/after/today/live`
      }
      return ''
    },
    // pcoId = serviceTypeId-planId
    splitPcoId (pcoId) {
      let serviceTypeId = ''
      let planId = ''
      if (pcoId) {
        const i = pcoId.search('-')
        // console.log(i)
        if (i >= 1 && pcoId.length > i) {
          serviceTypeId = pcoId.substring(0, i)
          if (pcoId.length > i) {
            planId = pcoId.substring(i + 1)
          }
        } else {
          serviceTypeId = ''
          planId = pcoId
        }
      }
      return { serviceTypeId, planId }
    }
  }
}
</script>

<style lang="scss">
.app-toolbar {
  @media (max-width: 1550px) {
    .q-btn .q-btn__content {
      :nth-child(1) {
        margin-right: 0;
      }

      :nth-child(2) {
        display: none !important;
      }
    }
  }
}
</style>
