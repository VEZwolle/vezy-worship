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
          <Draggable v-model="$store.service.presentations" item-key="id">
            <template #item="{ element: presentation }">
              <SetlistItem
                :ref="`setlistItem_${presentation.id}`"
                :presentation="presentation"
                :active="$store.previewPresentation?.id === presentation.id"
                @click="itemClickUseDebounce(presentation)"
                @preview="$store.preview(presentation)"
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
import { defineComponent } from 'vue'
import SetlistItem from './SetlistItem.vue'
import presentationTypes from '../presentation-types.js'
import ServiceSettingsDialog from '../service/ServiceSettingsDialog.vue'
import Draggable from 'vuedraggable'
import QuickSearchDatabase from '../song/database/QuickSearchDatabase.vue'
import { debounce } from 'quasar'

export default defineComponent({
  name: 'SetlistControl',
  components: { SetlistItem, ServiceSettingsDialog, Draggable, QuickSearchDatabase },
  setup () {
    return {
      presentationTypes: presentationTypes.reverse()
    }
  },
  data () {
    return {
      // lastClickTimer: null,
      lastClickItem: ''
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
  created () {
    this.resetLastClickItem = debounce(this.resetLastClickItem, 500)
    console.log(this.$store.$state)

    this.$store.$onAction(
      ({
        name, // name of the action
        store, // store instance, same as `someStore`
        args, // array of parameters passed to the action
        after, // hook after the action returns or resolves
        onError, // hook if the action throws or rejects
      }) => {
        // a shared variable for this specific action call
        const startTime = Date.now()
        // this will trigger before an action on `store` is executed
        console.log(`${startTime} | Start "${name}" with params [${args.join(', ')}]. Store: "${store}" `)

        // this will trigger if the action succeeds and after it has fully run.
        // it waits for any returned promised
        after((result) => {
          const endTime = Date.now()
          console.log(
            `${endTime} | Finished "${name}" after ${
              endTime - startTime
            }ms.\nResult: ${result}.`
          )
        })
        // this will trigger if the action throws or returns a promise that rejects
        onError((error) => {
          console.warn(
            `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
          )
        })
      }
    )

    this.$store.$subscribe((mutation, state) => {
      const subTime = Date.now()
      console.log(`${subTime} | MutationType: "${mutation.type}" | Store: ${mutation.storeId}`)
      console.log(state)
    })

  },
  beforeUnmount () {
    // clearTimeout(this.lastClickTimer)
  },
  methods: {
    itemClickUseDebounce(presentation) {
      // bij snel dubbel klikken geen update, bj iets rustiger wel geupdate...
      if (!presentation) return
      // 1x click effent, 2x dbl click
      console.log(`lastClickItem: ${this.lastClickItem}`)
      // do not start by @dblclick voor second click, 
      // because otherwise $store (pinia) does not reactive update in other screen
      if (this.lastClickItem === presentation?.id) {
        console.log('itemClick 2e')
        // run @dblclick
        setTimeout(() => { 
          this.$store.goLive(presentation)
          this.lastClickItem = ''
        }, 10 )
        return
      }
      console.log('itemClick 1e')
      this.lastClickItem = presentation?.id
      // run @click
      this.$store.preview(presentation)
      this.resetLastClickItem()
    },
    // itemClickUseSetTimeout(presentation) {
    // if (!presentation) return
    //  console.log(`lastClickItem: ${this.lastClickItem}`)
    //  // do not start by @dblclick voor second click, 
    //  // because otherwise $store (pinia) does not reactive update in other screen
    //  if (this.lastClickItem === presentation?.id) {
    //    console.log('itemClick 2e')
    //    clearTimeout(this.lastClickTimer)
    //    // run @dblclick
    //    this.$store.goLive(presentation)
    //    this.lastClickItem = ''
    //    return
    //  }
    //  console.log('itemClick 1e')
    //  this.lastClickItem = presentation.id
    //  this.lastClickTimer = setTimeout( () => {
    //    // run @click
    //    this.$store.preview(presentation)
    //    this.lastClickItem = ''
    //  }, 250)
    // },
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
      this.$refs[`setlistItem_${this.$store.previewPresentation?.id}`].scrollToCenter()
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
