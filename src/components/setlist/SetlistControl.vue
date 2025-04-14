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

    <div class="layout-column-content arrowKey">
      <div style="flex:1;">
        <q-list class="q-pt-sm">
          <SortableList v-model="$store.service.presentations" item-key="id" :options="sortableOptions">
            <template #item="{ element: presentation }">
              <SetlistItem
                :ref="`setlistItem_${presentation.id}`"
                :presentation="presentation"
                :active="$store.previewPresentationId === presentation.id"
                @click="itemClick(presentation)"
                @preview="$store.preview(presentation)"
                @go-live="$store.goLive(presentation)"
                @edit="edit(presentation)"
                @remove="$store.removePresentation(presentation)"
              />
            </template>
          </SortableList>
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
import { defineComponent } from 'vue'
import SetlistItem from './SetlistItem.vue'
import presentationTypes from '../presentation-types.js'
import ServiceSettingsDialog from '../service/ServiceSettingsDialog.vue'
import SortableList from '../common/SortableList.vue'
import QuickSearchDatabase from '../song/database/QuickSearchDatabase.vue'
import { debounce } from 'quasar'

export default defineComponent({
  name: 'SetlistControl',
  components: { SetlistItem, ServiceSettingsDialog, SortableList, QuickSearchDatabase },
  setup () {
    return {
      presentationTypes: presentationTypes.reverse()
    }
  },
  data () {
    return {
      lastClickItem: ''
    }
  },
  computed: {
    setlistScroll () {
      return this.$store.setlistScroll
    },
    sortableOptions () {
      return {
        /* default options */
        group: {
          name:'setlist', // name: "..."
          pull: true, // [true, false, 'clone', array]
          put: true // [true, false, array]
        },
        // sort: true,  // sorting inside list
        // delay: 0, // time in milliseconds to define when the sorting should start
        // delayOnTouchOnly: false, // only delay if user is using touch
        // touchStartThreshold: 0, // px, how many pixels the point should move before cancelling a delayed drag event
        // disabled: false, // Disables the sortable if set to true.
        // store: null,  // get/set
        animation: 150,  // ms, animation speed moving items when sorting, `0` — without animation
        // easing: "cubic-bezier(1, 0, 0, 1)", // Easing for animation. Defaults to null. See https://easings.net/ for examples.
        // handle: ".my-handle",  // Drag handle selector within list items
        // filter: ".ignore-elements",  // Selectors that do not lead to dragging (String or Function)
        // preventOnFilter: true, // Call `event.preventDefault()` when triggered `filter`
        draggable: ".q-item",  // Specifies which items inside the element should be draggable
        // dataIdAttr: 'data-id', // HTML attribute that is used by the `toArray()` method
        ghostClass: "sortable-ghost",  // Class name for the drop placeholder
        chosenClass: "sortable-chosen",  // Class name for the chosen item
        dragClass: "sortable-drag",  // Class name for the dragging item
        // swapThreshold: 1, // Threshold of the swap zone
        // invertSwap: false, // Will always use inverted swap zone if set to true
        // invertedSwapThreshold: 1, // Threshold of the inverted swap zone (will be set to swapThreshold value by default)
        // direction: 'horizontal', // Direction of Sortable (will be detected automatically if not given)
        // forceFallback: false,  // ignore the HTML5 DnD behaviour and force the fallback to kick in
        // fallbackClass: "sortable-fallback",  // Class name for the cloned DOM Element when using forceFallback
        // fallbackOnBody: false,  // Appends the cloned DOM Element into the Document's Body
        // fallbackTolerance: 0, // Specify in pixels how far the mouse should move before it's considered as a drag.
        // dragoverBubble: false,
        // removeCloneOnHide: true, // Remove the clone element when it is not showing, rather than just hiding it
        // emptyInsertThreshold: 5, // px, distance mouse must be from empty sortable to insert drag element into it
        /* MultiDrag Options */
        multiDrag: true, // Enable the plugin
        selectedClass: "sortable-selected", // Class name for selected item
        multiDragKey: 'CTRL', // Key that must be down for items to be selected vb: 'CTRL' or null
        // avoidImplicitDeselect: false, // true - if you don't want to deselect items on outside click
      }
    }
  },
  watch: {
    'setlistScroll' (val) {
      if (val) this.scrollActive()
    }
  },
  created () {
    this.resetLastClickItem = debounce(this.resetLastClickItem, 500)
  },
  methods: {
    itemClick(presentation) {
      // 2nd click apply double-click instead of click + double-click
      if (!presentation) return
      // 1x click effent, 2x dbl click
      if (this.lastClickItem === presentation?.id) {
        // run @dblclick
        this.$store.goLive(presentation)
        this.lastClickItem = ''
        return
      }
      this.lastClickItem = presentation?.id
      // run @click
      this.$store.preview(presentation)
      this.resetLastClickItem()
    },
    resetLastClickItem () {
      this.lastClickItem = ''
    },
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
      if (this.$store.previewPresentationId) this.$refs[`setlistItem_${this.$store.previewPresentationId}`].scrollToCenter()
      this.$store.setlistScroll = false
    }
  }
})
</script>

<style scoped>
.items-bottom {
  position: sticky;
  bottom: 0;
  left: 100%;
  width: 56px
}
</style>
