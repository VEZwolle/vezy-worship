<template>
  <q-dialog ref="dialog" square>
    <q-card v-if="presentation">
      <q-toolbar class="bg-secondary text-white">
        <q-btn flat round dense :icon="presentationType.icon" />
        <q-toolbar-title>
          <span v-if="presentation.id">{{ presentationType.name }} aanpassen</span>
          <span v-else>{{ presentationType.name }} toevoegen</span>
        </q-toolbar-title>
        <q-btn v-close-popup flat round dense icon="close" />
      </q-toolbar>

      <q-card-section>
        <component :is="settingsComponent" v-if="settingsComponent" :presentation="presentation" />
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn color="secondary" label="Opslaan" icon="save" @click="save" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import useServiceStore from 'stores/service'
import presentationTypes from '../presentation-types'

export default {
  setup () {
    const store = useServiceStore()
    return { store }
  },
  data () {
    return {
      presentation: null
    }
  },
  computed: {
    presentationType () {
      return presentationTypes.find(t => t.id === this.presentation?.type)
    },
    settingsComponent () {
      return this.presentationType?.components?.settings
    }
  },
  methods: {
    show () {
      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    },
    new (typeId) {
      const type = presentationTypes.find(t => t.id === typeId)

      this.presentation = {
        type: typeId,
        settings: { ...type.settings }
      }

      this.show()
    },
    edit (presentation) {
      this.presentation = presentation
      this.show()
    },
    save () {
      if (!this.presentation.id) {
        this.store.addPresentation(this.presentation)
      }

      this.hide()
    }
  }
}
</script>

<style scoped>
.q-card {
  min-width: 60vw;
  min-height: 80vh;
}
</style>
