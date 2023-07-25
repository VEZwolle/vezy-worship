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
      </q-list>
    </q-btn-dropdown>

    <q-space />
    <MessageControl />
    <q-space />

    <div v-if="!$q.platform.is.electron">
      Open output:

      <q-btn
        flat
        label="Beamer"
        icon="videocam"
        dense
        class="q-mr-sm"
        @click="openOutput('beamer')"
      />

      <q-btn
        flat
        label="Livestream"
        icon="smart_display"
        dense
        @click="openOutput('livestream')"
      />

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
</template>

<script>
import ServiceSettingsDialog from '../service/ServiceSettingsDialog'
import AppSettingsDialog from './AppSettingsDialog'
import icon from 'assets/icon.svg'
import PACKAGE from '../../../package.json'
import MessageControl from '../message/MessageControl'
import { Notify } from 'quasar'

export default {
  components: { ServiceSettingsDialog, AppSettingsDialog, MessageControl },
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
  created () {
    if (this.$q.platform.is.electron) {
      window.electron.onAutoUpdate((event, status, percent, message) => {
        switch (status) {
          case -1:
          case 0:
          case 1:
            this.autoupdate.message = message
            break
          case 2:
            this.autoupdate.indeterminateProgress = true
            this.autoupdate.percent = percent
            this.autoupdate.message = message
            Notify.create({ type: 'positive', message: this.autoupdate.message })
            break
          case 3:
            this.autoupdate.indeterminateProgress = false
            this.autoupdate.percent = Math.round(percent)
            break
          case 4:
            this.autoupdate.indeterminateProgress = false
            this.autoupdate.message = message
            this.autoupdate.percent = percent
            Notify.create({ type: 'positive', message: this.autoupdate.message })
            break
          default:
        }
      })
    }
    window.addEventListener('beforeunload', (event) => {
      if (JSON.stringify(this.$store.service) === this.$store.serviceSaved) {
        event.preventDefault()
      } else {
        event.returnValue = ''
      }
    })
  },
  methods: {
    create () {
      this.$refs.serviceSettingsDialog.show()
    },
    open (add) {
      this.isLoading = true
      this.$fs.open(add)
        .finally(() => {
          this.isLoading = false
        })
    },
    save (showPicker) {
      this.isSaving = true
      this.$fs.save(showPicker)
        .finally(() => {
          this.isSaving = false
        })
    },
    openOutput (id) {
      window.open(`/#/output/${id}`, '_blank', 'popup,width=640,height=360')
    },
    openAppSettings () {
      this.$refs.appSettingsDialog.show()
    },
    openHelp () {
      window.open('/#/help', 'vezyWorshipHelp', 'popup,width=1000,height=800')
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
