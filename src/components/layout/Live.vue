<template>
  <div class="layout-column">
    <q-toolbar class="bg-subtoolbar text-subtoolbar">
      <q-toolbar-title class="text-subtitle2">
        <q-badge rounded color="red" class="q-mr-sm" />
        Live
        <span v-if="presentation" v-html="`- ${title}`" />
      </q-toolbar-title>

      <q-checkbox
        v-model="$store.isClear"
        v-shortkey="shortkeysClear"
        left-label
        label="Clear"
        color="red"
        @shortkey="$store.toggleClear"
      >
        <q-tooltip>
          Vink aan om scherm leeg te maken<br>
          Bij beamer & livestream<br>
          (Ctrl + C of F6 of Spatie)
        </q-tooltip>
      </q-checkbox>
      <q-toggle
        v-model="$store.isOnlyLivestreamClear"
        checked-icon="tv_off"
        unchecked-icon="tv"
        color="red"
        dense
      >
        <q-tooltip>
          <b>Aan maakt livestream alvast leeg.</b><br>
          wordt uitgezet bij nieuw item.
        </q-tooltip>
      </q-toggle>
    </q-toolbar>

    <div class="layout-column-content arrowKey" :class="classArrowKeyActive">
      <component :is="controlComponent" v-if="controlComponent" :key="presentation" :presentation="presentation" />
    </div>

    <OutputBoxes :beamer="true" :livestream="true" />
  </div>
</template>

<script>
import presentationTypes from '../presentation-types'
import OutputBoxes from '../output/OutputBoxes'

export default {
  components: { OutputBoxes },
  computed: {
    presentation () {
      return this.$store.livePresentation
    },
    presentationType () {
      return presentationTypes.find(t => t.id === this.presentation?.type)
    },
    controlComponent () {
      return this.presentationType?.components?.control
    },
    title () {
      if (this.presentation.settings.title) {
        return this.presentation.settings.title
      }

      if (this.presentationType.title) {
        return this.presentationType.title(this.presentation.settings)
      }

      return this.presentationType.name
    },
    shortkeysClear () {
      return this.$store.shortkeysClear()
    },
    arrowKeyActive () {
      return !this.$store.arrowKeyLocation
    },
    classArrowKeyActive () {
      return this.arrowKeyActive ? 'arrowKeyActive' : ''
    }
  }
}
</script>
