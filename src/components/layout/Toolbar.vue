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

    <q-btn
      v-shortkey="['ctrl', 's']"
      flat
      icon="save"
      label="Dienst opslaan"
      :disable="!store.service"
      :loading="isSaving"
      @click="save"
      @shortkey="save"
    />

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
    save () {
      this.isSaving = true
      this.$fs.save()
        .then(() => this.$q.notify({ type: 'positive', message: 'De dienst is succesvol opgeslagen' }))
        .finally(() => {
          this.isSaving = false
        })
    }
  }
}
</script>
