<template>
  <div>
    <q-tabs v-model="tab" class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator :breakpoint="0">
      <q-tab name="beamer" label="Beamer" />
      <q-tab name="livestream" label="Livestream" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="beamer">
        <img :src="fileUrl" class="full-width">
      </q-tab-panel>

      <q-tab-panel name="livestream">
        <img :src="fileLivestreamUrl" class="full-width">
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import BaseControl from '../presentation/BaseControl.vue'

export default {
  extends: BaseControl,
  data () {
    return {
      tab: 'beamer'
    }
  },
  computed: {
    fileUrl () {
      return this.$store.media[this.settings.fileId]
    },
    fileLivestreamUrl () {
      return this.$store.media[this.settings.fileLivestreamId] || this.fileUrl
    }
  }
}
</script>
