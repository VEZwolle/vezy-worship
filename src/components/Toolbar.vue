<template>
  <q-toolbar>
    <q-btn flat icon="add" label="Nieuw" @click="showEditServiceDialog">
      <q-tooltip>Nieuwe dienst aanmaken</q-tooltip>
    </q-btn>
    <q-btn flat icon="folder_open" label="Open" @click="showSelectServiceDialog">
      <q-tooltip>Dienst openen</q-tooltip>
    </q-btn>
    <q-btn flat icon="save" label="Opslaan" :disable="!store.service">
      <q-tooltip>Dienst opslaan</q-tooltip>
    </q-btn>
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
  methods: {
    showEditServiceDialog () {
      this.$refs.editServiceDialog.show()
    },
    showSelectServiceDialog () {
      this.$refs.selectServiceDialog.show()
    }
  }
}
</script>
