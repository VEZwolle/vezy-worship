<template>
  <div class="layout-column">
    <q-toolbar class="bg-subtoolbar text-subtoolbar">
      <q-toolbar-title class="text-subtitle2">
        <q-badge rounded color="green" class="q-mr-sm" />
        Preview
        <span v-if="presentation" v-html="`- ${title}`" />
      </q-toolbar-title>

      <q-btn
        v-shortkey="['ctrl', 'arrowright']"
        label="Go live"
        icon-right="arrow_forward"
        :disabled="!presentation"
        @click="$store.goLive(presentation)"
        @shortkey="$store.goLive(presentation)"
      >
        <q-menu context-menu no-focus>
          <q-list dense>
            <q-item-label header>
              QUICK LIVE:
            </q-item-label>

            <q-item v-for="preset in presentationPresets" :key="preset.id" v-close-popup clickable @click="$store.goLive(preset, false)">
              <q-item-section>{{ preset.settings.title }}</q-item-section>
              <q-item-section avatar>
                <q-icon name="arrow_forward" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>

    <div class="layout-column-content">
      <component :is="controlComponent" v-if="controlComponent" :key="presentation" preview :presentation="presentation" />
    </div>

    <OutputBoxes preview :beamer="true" :livestream="true" />
  </div>
</template>

<script>
import presentationTypes from '../presentation-types'
import presentationPresets from '../presentation-presets'
import OutputBoxes from '../output/OutputBoxes'

export default {
  components: { OutputBoxes },
  setup () {
    return { presentationPresets }
  },
  computed: {
    presentation () {
      return this.$store.previewPresentation
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

<style scoped>
.q-item__label--header {
  padding-top: 12px;
  padding-bottom: 8px;
}
</style>
