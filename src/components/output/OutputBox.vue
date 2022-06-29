<template>
  <div class="output-box">
    <div v-for="view in views" :key="view.id" class="output-box-view">
      <OutputPreview v-if="view.output" :zoom="zoom">
        <Output :id="view.outputid" :show-background="view.showbackground" :alpha="view.alpha" :preview-presentation="previewPresentation" />
      </OutputPreview>
    </div>
  </div>
  <q-slider
    v-if="countViewsOutput > 0"
    v-model="maxzoom"
    :min="0"
    :max="1"
    :step="0.1"
    color="red"
  />
  <q-toolbar class="bg-grey-3 text-dark">
    <q-toolbar-title class="text-subtitle2">
      Voorbeeld:
      <q-checkbox
        v-for="view in views"
        :key="view.id"
        v-model="view.output"
        right-label
        :label="view.name"
        color="red"
      >
        <q-tooltip>
          Vink aan om miniatuur weergave van de {{ view.name }} te zien.
        </q-tooltip>
      </q-checkbox>
    </q-toolbar-title>
  </q-toolbar>
</template>

<script>
import Output from '../output/Output.vue'
import OutputPreview from '../output/OutputPreview.vue'

export default {
  components: { OutputPreview, Output },
  props: {
    previewPresentation: Boolean,
    beamer: Boolean,
    livestream: Boolean,
    alpha: Boolean
  },
  data () {
    return {
      maxzoom: 0.6,
      views: [
        {
          id: 0,
          name: 'Beamer',
          outputid: 'beamer',
          showbackground: true,
          alpha: false,
          output: this.beamer
        },
        {
          id: 1,
          name: 'Livestream',
          outputid: 'livestream',
          showbackground: false,
          alpha: false,
          output: this.livestream
        },
        {
          id: 2,
          name: 'Alpha',
          outputid: 'livestream',
          showbackground: false,
          alpha: true,
          output: this.alpha
        }
      ]
    }
  },
  computed: {
    countViewsOutput () {
      let count = 0
      for (const view in this.views) {
        if (this.views[view].output) {
          count++
        }
      }
      return count
    },
    zoom () {
      if (this.countViewsOutput > 0) {
        return Math.min(this.maxzoom, 1 / this.countViewsOutput)
      } else {
        return this.maxzoom
      }
    }
  }
}
</script>

<style scoped>
.output-box {
  display: inline;
  align-items: center;
}
.output-box-view {
  display: inline;
}
</style>
