<template>
  <div>
    <q-tabs v-model="presentation.tab" class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator :breakpoint="0">
      <q-tab name="both" label="Beamer & Livestream" />
      <q-tab name="beamer" label="Beamer" />
      <q-tab name="livestream" label="Livestream" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="presentation.tab">
      <q-tab-panel name="both">
        <div class="row q-gutter-md">
          <div class="col">
            Beamer:<br>
            <OutputPreview :component="ImageOutputBeamer" :presentation="presentation" />
          </div>
          <div class="col">
            Livestream:<br>
            <OutputPreview :component="ImageOutputLivestream" :presentation="presentation" />
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="beamer">
        <OutputPreview :component="ImageOutputBeamer" :presentation="presentation" />
      </q-tab-panel>

      <q-tab-panel name="livestream">
        <OutputPreview :component="ImageOutputLivestream" :presentation="presentation" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import BaseControl from '../presentation/BaseControl.vue'
import OutputPreview from '../output/OutputPreview.vue'
import ImageOutputBeamer from './ImageOutputBeamer.vue'
import ImageOutputLivestream from './ImageOutputLivestream.vue'

export default {
  components: { OutputPreview },
  extends: BaseControl,
  setup () {
    return { ImageOutputBeamer, ImageOutputLivestream }
  },
  created () {
    if (this.presentation.tab) {
      return
    }
    if (this.$store.noLivestream) {
      this.presentation.tab = 'beamer'
    } else {
      this.presentation.tab = 'both'
    }
  }
}
</script>
