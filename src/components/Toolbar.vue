<template>
  <q-toolbar>
    <q-icon :name="`img:${icon}`" size="md" />

    <q-btn
      v-shortkey="['ctrl', 'n']"
      flat
      icon="add"
      label="Nieuwe dienst"
      @click="showEditServiceDialog"
      @shortkey="showEditServiceDialog"
    />

    <q-btn
      v-shortkey="['ctrl', 'o']"
      flat
      icon="folder_open"
      label="Open dienst"
      @click="showSelectServiceDialog"
      @shortkey="showSelectServiceDialog"
    />

    <q-btn
      v-shortkey="['ctrl', 's']"
      flat
      icon="save"
      label="Dienst opslaan"
      :disable="!store.service"
      :loading="isSaving"
      @click="saveService"
      @shortkey="saveService"
    />
  </q-toolbar>

  <EditServiceDialog ref="editServiceDialog" />
  <SelectServiceDialog ref="selectServiceDialog" />
</template>

<script>
import useServiceStore from 'stores/service'
import EditServiceDialog from './service/EditServiceDialog'
import SelectServiceDialog from './service/SelectServiceDialog'
import icon from '../assets/icon.svg'

export default {
  components: { EditServiceDialog, SelectServiceDialog },
  setup () {
    const store = useServiceStore()

    return { store, icon }
  },
  data () {
    return {
      isSaving: false
    }
  },
  methods: {
    showEditServiceDialog () {
      this.$refs.editServiceDialog.show()
    },
    showSelectServiceDialog () {
      this.$refs.selectServiceDialog.show()
    },
    saveService () {
      this.isSaving = true

      this.store.saveService()
        .then(() => this.$q.notify({ position: 'bottom-right', type: 'positive', message: 'De dienst is succesvol opgeslagen' }))
        .finally(() => {
          this.isSaving = false
        })
    }
  }
}
</script>
