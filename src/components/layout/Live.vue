<template>
  <q-layout view="lHh lpr lFf" container class="full-height">
    <q-header>
      <q-toolbar class="bg-grey-3 text-dark">
        <q-toolbar-title class="text-subtitle2">
          <q-badge rounded color="red" class="q-mr-sm" />
          Live
          <span v-if="presentation" v-html="`- ${title}`" />
        </q-toolbar-title>

        <q-checkbox
          v-model="$store.isClear"
          v-shortkey="{ctrlc: ['ctrl', 'c'], f6: ['f6']}"
          left-label
          label="Clear"
          color="red"
          @shortkey="$store.toggleClear"
        >
          <q-tooltip>
            Vink aan om het scherm leeg te maken<br>(ctrl + c) of (F6)
          </q-tooltip>
        </q-checkbox>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page>
        <component :is="controlComponent" v-if="controlComponent" :key="presentation" :presentation="presentation" />
      </q-page>
    </q-page-container>

    <q-footer>
      <OutputBoxes :beamer="true" :livestream="true" :alpha="false" />
    </q-footer>
  </q-layout>
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
    }
  }
}
</script>
