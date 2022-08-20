<template>
  <div>
    <q-tabs v-model="tab" class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator :breakpoint="0">
      <q-tab name="beamer" label="Beamer" />
      <q-tab name="livestream" label="Livestream" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab">
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
  data () {
    return {
      tab: 'beamer'
    }
  }
}
</script>
