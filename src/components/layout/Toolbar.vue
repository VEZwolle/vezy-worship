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
      :disable="!store.service"
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

    <div>VezyWorship v{{ version }}</div>
  </q-toolbar>

  <EditServiceDialog ref="editServiceDialog" />
</template>

<script>
import useServiceStore from 'stores/service'
import EditServiceDialog from '../service/EditServiceDialog'
import icon from 'assets/icon.svg'
import PACKAGE from '../../../package.json'

export default {
  components: { EditServiceDialog },
  setup () {
    const store = useServiceStore()

    return { store, icon, version: PACKAGE.version }
  },
  data () {
    return {
      isSaving: false,
      isLoading: false
    }
  },
  methods: {
    create () {
      this.$refs.editServiceDialog.show()
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
    }
  }
}
</script>
