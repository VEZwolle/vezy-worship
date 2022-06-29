<template>
  <q-layout view="lHh lpr lFf" container class="full-height">
    <q-header>
      <q-toolbar class="bg-grey-3 text-dark">
        <q-toolbar-title class="text-subtitle2">
          <q-badge rounded color="red" class="q-mr-sm" />
          Live
          <span v-if="presentation">- {{ presentation.settings.title || presentationType.name }}</span>
        </q-toolbar-title>

        <q-checkbox
          v-model="$store.isClear"
          v-shortkey="['ctrl', 'c']"
          left-label
          label="Clear"
          color="red"
          @shortkey="$store.toggleClear"
        >
          <q-tooltip>
            Vink aan om het scherm leeg te maken<br>(ctrl + c)
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
      <OutputBox :beamer="false" :livestream="true" :alpha="false" />
    </q-footer>
  </q-layout>
</template>

<script>
import presentationTypes from '../presentation-types'
import OutputBox from '../output/OutputBox.vue'

export default {
  components: { OutputBox },
  computed: {
    presentation () {
      return this.$store.livePresentation
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
