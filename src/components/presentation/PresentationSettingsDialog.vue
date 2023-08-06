<template>
  <q-dialog ref="dialog" persistent square>
    <q-card v-if="presentation">
      <q-toolbar class="bg-secondary text-white">
        <q-btn flat round dense :icon="presentationType.icon" />
        <q-toolbar-title>
          <span v-if="presentation.id">{{ presentationType.name }} aanpassen</span>
          <span v-else>{{ presentationType.name }} toevoegen</span>
        </q-toolbar-title>
        <q-btn v-close-popup flat round dense icon="close" />
      </q-toolbar>

      <component :is="settingsComponent" v-if="settingsComponent" :presentation="presentation" />

      <q-separator />

      <q-card-actions align="right">
        <q-btn color="secondary" :label="btnLabel" :icon="btnIcon" @click="save" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import presentationTypes from '../presentation-types'
import cloneDeep from 'lodash/cloneDeep'

export default {
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
    },
    btnLabel () {
      if (!this.presentation.id) {
        return 'Opslaan'
      }
      return 'Sluiten'
    },
    btnIcon () {
      if (!this.presentation.id) {
        return 'save'
      }
      return 'done'
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
        settings: cloneDeep(type.settings)
      }

      this.show()
    },
    edit (presentation) {
      this.presentation = presentation
      this.show()
    },
    save () {
      if (!this.presentation.id) {
        this.$store.addPresentation(this.presentation)
      }

      this.$store.preview(this.presentation)
      this.hide()
    }
  }
}
</script>

<style scoped>
.q-card {
  min-width: max(60vw, min(1152px, 95vw));
  min-height: 80vh;
}
</style>
