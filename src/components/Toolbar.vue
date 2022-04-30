<template>
  <q-toolbar>
    <q-btn flat icon="add" label="Nieuwe dienst" @click="showEditServiceDialog" />
    <q-btn flat icon="folder_open" label="Open dienst" @click="showSelectServiceDialog" />
    <q-btn flat icon="save" label="Dienst opslaan" :disable="!store.service" :loading="isSaving" @click="saveService" />
  </q-toolbar>

  <EditServiceDialog ref="editServiceDialog" />
  <SelectServiceDialog ref="selectServiceDialog" />
</template>

<script>
import useServiceStore from 'stores/service'
import EditServiceDialog from './service/EditServiceDialog'
import SelectServiceDialog from './service/SelectServiceDialog'

export default {
  components: { EditServiceDialog, SelectServiceDialog },
  setup () {
    const store = useServiceStore()
    return { store }
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
