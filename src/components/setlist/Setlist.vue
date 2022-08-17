<template>
  <q-layout view="lHh lpr lFf" container class="full-height">
    <q-header>
      <q-toolbar class="bg-grey-3 text-dark">
        <q-toolbar-title class="text-subtitle2">
          Dienst - {{ $date($store.service.date) }}

          <q-btn class="gt-xs text-grey-8" size="12px" flat dense round icon="edit" @click="openServiceSettings">
            <q-tooltip>Dienst bewerken</q-tooltip>
          </q-btn>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page>
        <q-list class="q-pt-sm">
          <Draggable v-model="$store.service.presentations" item-key="id">
            <template #item="{ element: presentation }">
              <SetlistItem
                :presentation="presentation"
                :active="$store.previewPresentation?.id === presentation.id"
                @click="$store.preview(presentation)"
                @preview="$store.preview(presentation)"
                @dblclick="$store.goLive(presentation)"
                @go-live="$store.goLive(presentation)"
                @edit="edit(presentation)"
                @remove="$store.removePresentation(presentation)"
              />
            </template>
          </Draggable>
        </q-list>
      </q-page>
    </q-page-container>

    <q-footer>
      <q-fab color="primary" icon="add" direction="up" class="absolute" style="bottom: 20px; right: 20px;">
        <q-fab-action
          v-for="presentationType in presentationTypes"
          :key="presentationType.id"
          :color="presentationType.color"
          :icon="presentationType.icon"
          external-label
          label-position="left"
          :label="`${presentationType.name} toevoegen`"
          @click="add(presentationType.id)"
        />
      </q-fab>
    </q-footer>
  </q-layout>

  <PresentationSettingsDialog ref="presentationSettingsDialog" />
  <ServiceSettingsDialog ref="serviceSettingsDialog" />
</template>

<script>
import SetlistItem from './SetlistItem.vue'
import presentationTypes from '../presentation-types'
import PresentationSettingsDialog from '../presentation/PresentationSettingsDialog.vue'
import ServiceSettingsDialog from '../service/ServiceSettingsDialog.vue'
import Draggable from 'vuedraggable'

export default {
  components: { SetlistItem, PresentationSettingsDialog, ServiceSettingsDialog, Draggable },
  setup () {
    return {
      presentationTypes: presentationTypes.reverse()
    }
  },
  methods: {
    add (typeId) {
      this.$refs.presentationSettingsDialog.new(typeId)
    },
    edit (presentation) {
      this.$refs.presentationSettingsDialog.edit(presentation)
    },
    openServiceSettings () {
      this.$refs.serviceSettingsDialog.show(this.$store.service)
    }
  }
}
</script>
