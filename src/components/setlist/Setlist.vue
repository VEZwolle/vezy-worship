<template>
  <q-layout view="lHh lpr lFf" container class="full-height">
    <q-header>
      <q-toolbar class="bg-grey-3 text-dark">
        <q-toolbar-title class="text-subtitle2">
          Setlist - {{ $date(store.service.date) }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page>
        <q-list class="q-pt-sm">
          <Draggable v-model="store.service.presentations" item-key="id">
            <template #item="{ element: presentation }">
              <SetlistItem
                :presentation="presentation"
                :active="store.previewPresentation?.id === presentation.id"
                @click="store.preview(presentation)"
                @dblclick="store.goLive(presentation)"
                @edit="edit(presentation)"
                @remove="store.removePresentation(presentation)"
              />
            </template>
          </Draggable>
        </q-list>

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
      </q-page>
    </q-page-container>
  </q-layout>

  <PresentationSettingsDialog ref="presentationSettingsDialog" />
</template>

<script>
import useServiceStore from 'stores/service'
import SetlistItem from './SetlistItem.vue'
import presentationTypes from '../presentation-types'
import PresentationSettingsDialog from '../presentation/PresentationSettingsDialog.vue'
import Draggable from 'vuedraggable'

export default {
  components: { SetlistItem, PresentationSettingsDialog, Draggable },
  setup () {
    const store = useServiceStore()
    return { store, presentationTypes }
  },
  methods: {
    add (typeId) {
      this.$refs.presentationSettingsDialog.new(typeId)
    },
    edit (presentation) {
      this.$refs.presentationSettingsDialog.edit(presentation)
    }
  }
}
</script>
