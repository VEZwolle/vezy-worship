<template>
  <div
    v-shortkey="shortkeysNextBack"
    @shortkey="baseHandleArrow"
    @click="setHandleArrowLocation"
  >
    <q-tabs v-model="presentation.control.tab" class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator :breakpoint="0">
      <q-tab name="both" label="Beamer & Livestream" />
      <q-tab name="beamer" label="Beamer" />
      <q-tab name="livestream" label="Livestream" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="presentation.control.tab">
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
import { defineComponent } from 'vue'
import BaseControl from '../presentation/BaseControl.vue'
import OutputPreview from '../output/OutputPreview.vue'
import ImageOutputBeamer from './ImageOutputBeamer.vue'
import ImageOutputLivestream from './ImageOutputLivestream.vue'

export default defineComponent({
  name: 'ImageControl',
  components: { OutputPreview },
  extends: BaseControl,
  setup () {
    return { ImageOutputBeamer, ImageOutputLivestream }
  },
  created () {
    // create .control via store: preview/golive
  }
})
</script>
