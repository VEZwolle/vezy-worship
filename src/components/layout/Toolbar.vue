<template>
  <q-toolbar>
    <q-icon :name="`img:${icon}`" size="md" />

    <q-btn
      v-shortkey="['ctrl', 'n']"
      flat
      icon="add"
      label="Nieuwe dienst"
      @click="create"
      @shortkey="create"
    />

    <q-btn
      v-shortkey="['ctrl', 'o']"
      flat
      icon="folder_open"
      label="Open dienst"
      :loading="isLoading"
      @click="open"
      @shortkey="open"
    />

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

    <div>VezyWorship v{{ version }}</div>

    <q-btn
      v-if="$q.platform.is.electron"
      flat
      icon="settings"
      dense
      class="q-ml-sm"
      @click="openAppSettings"
    />
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

export default {
  components: { ServiceSettingsDialog, AppSettingsDialog, MessageControl },
  setup () {
    return { icon, version: PACKAGE.version }
  },
  data () {
    return {
      isSaving: false,
      isLoading: false
    }
  },
  methods: {
    create () {
      this.$refs.serviceSettingsDialog.show()
    },
    open () {
      this.isLoading = true
      this.$fs.open()
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
    }
  }
}
</script>
