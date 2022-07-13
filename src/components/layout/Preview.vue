<template>
  <q-layout view="lHh lpr lFf" container class="full-height">
    <q-header>
      <q-toolbar class="bg-grey-3 text-dark">
        <q-toolbar-title class="text-subtitle2">
          <q-badge rounded color="green" class="q-mr-sm" />
          Preview
          <span v-if="presentation">- {{ presentation.settings.title || presentationType.name }}</span>
        </q-toolbar-title>

        <q-btn
          v-shortkey="['ctrl', 'arrowright']"
          label="Go live"
          icon-right="arrow_forward"
          :disabled="!presentation"
          @click="$store.goLive(presentation)"
          @shortkey="$store.goLive(presentation)"
        >
          <q-tooltip>
            Zet het item in de preview op het scherm
          </q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page>
        <component :is="controlComponent" v-if="controlComponent" :key="presentation" preview :presentation="presentation" />
      </q-page>
    </q-page-container>

    <q-footer>
      <OutputBoxes preview :beamer="true" :livestream="true" :alpha="false" />
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
      return this.$store.previewPresentation
    },
    presentationType () {
      return presentationTypes.find(t => t.id === this.presentation?.type)
    },
    controlComponent () {
      return this.presentationType?.components?.control
    }
  }
}
</script>
