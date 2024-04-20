<template>
  <div class="layout-column">
    <q-toolbar class="bg-subtoolbar text-subtoolbar">
      <q-toolbar-title class="text-subtitle2">
        Dienst - {{ $date($store.service.date) }}

        <q-btn class="gt-xs text-grey-8" size="12px" flat dense round icon="edit" @click="openServiceSettings">
          <q-tooltip>Dienst bewerken</q-tooltip>
        </q-btn>
      </q-toolbar-title>

      <q-checkbox
        v-model="$store.noLivestream"
        left-label
        label="Alleen beamer"
        color="red"
        @shortkey="$store.toggleNoLivestream"
      >
        <q-tooltip>
          Vink aan om teksten niet op te splitsen voor de livestream<br>
          (wordt alleen toegepast op nieuw geselecteerde Preview of GoLive)
        </q-tooltip>
      </q-checkbox>
      <q-toggle
        v-model="$store.arrowKeyContinueRemoteSetlist"
        toggle-indeterminate
        :false-value="0"
        :indeterminate-value="1"
        :true-value="2"
        unchecked-icon="swap_vert"
        indeterminate-icon="sync_alt"
        checked-icon="settings_remote"
        color="primary"
        dense
      >
        <q-tooltip>
          Uit: Ga via "GoLive" naar nieuwe live onderdeel<br>
          Midden: Gaat direct door naar volgend of vorige onderdeel in de setlist dmv de pijltoetsen<br>
          Aan: midden + gebruik van afstandsbediening mogelijk. (toetsen: Page Up/Down werken nu anders.)
        </q-tooltip>
      </q-toggle>
    </q-toolbar>

    <div class="layout-column-content">
      <div style="flex:1;">
        <q-list class="q-pt-sm">
          <Draggable v-model="$store.service.presentations" item-key="id">
            <template #item="{ element: presentation }">
              <SetlistItem
                :ref="`setlistItem_${presentation.id}`"
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
      </div>
      <div class="items-bottom">
        <q-fab color="primary" icon="add" direction="up" style="top: -20px; right: 20px;">
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
      </div>
    </div>

    <QuickSearchDatabase />
  </div>

  <PresentationSettingsDialog ref="presentationSettingsDialog" />
  <ServiceSettingsDialog ref="serviceSettingsDialog" />
</template>

<script>
import SetlistItem from './SetlistItem.vue'
import presentationTypes from '../presentation-types'
import ServiceSettingsDialog from '../service/ServiceSettingsDialog.vue'
import Draggable from 'vuedraggable'
import QuickSearchDatabase from '../song/database/QuickSearchDatabase.vue'

export default {
  components: { SetlistItem, ServiceSettingsDialog, Draggable, QuickSearchDatabase },
  setup () {
    return {
      presentationTypes: presentationTypes.reverse()
    }
  },
  computed: {
    setlistScroll () {
      return this.$store.setlistScroll
    }
  },
  watch: {
    'setlistScroll' (val) {
      if (val) this.scrollActive()
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
    },
    scrollActive () {
      this.$refs[`setlistItem_${this.$store.previewPresentation?.id}`].scrollToCenter()
      this.$store.setlistScroll = false
    }
  }
}
</script>

<style scoped>
.items-bottom {
  position: sticky;
  bottom: 0;
  left: 100%;
  width: 56px
}
</style>
