<template>
  <div>
    <div v-if="countViewsOutput > 0" class="output-boxes bg-grey-3">
      <template v-for="view in views" :key="view.id">
        <Transition v-if="view.output" name="q-transition--fade">
          <OutputPreview :id="view.outputid" :component="Output" :preview="previewPresentation" :alpha="view.alpha" :show-background="view.showbackground" />
        </Transition>
      </template>
    </div>
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
  </div>
</template>

<script>
import Output from './Output.vue'
import OutputPreview from './OutputPreview.vue'

export default {
  components: { OutputPreview },
  props: {
    previewPresentation: Boolean,
    beamer: Boolean,
    livestream: Boolean,
    alpha: Boolean
  },
  setup () {
    return { Output }
  },
  data () {
    return {
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
    }
  }
}
</script>

<style scoped>
.output-boxes {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0px auto 0px auto;
  padding: 5px;
  padding-bottom: 0;
}
</style>
