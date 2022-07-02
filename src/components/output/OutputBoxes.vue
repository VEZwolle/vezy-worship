<template>
  <div>
    <div v-if="countViewsOutput > 0" class="output-boxes bg-grey-3">
      <template v-for="view in views" :key="view.id">
        <template v-if="view.output">
          <Transition name="q-transition--fade">
            <OutputBox :outputid="view.outputid" :show-background="view.showbackground" :alpha="view.alpha" :preview-presentation="previewPresentation" :boxwidth="( elwidth * zoom )" />
          </Transition>
        </template>
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
import OutputBox from '../output/OutputBox.vue'

export default {
  components: { OutputBox },
  props: {
    previewPresentation: Boolean,
    beamer: Boolean,
    livestream: Boolean,
    alpha: Boolean
  },
  data () {
    return {
      elwidth: 0,
      maxzoom: 0.5,
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
      }
      return this.maxzoom
    }
  },
  mounted () {
    this.elwidth = this.$el.offsetWidth - 30
  },
  updated () {
    this.elwidth = this.$el.offsetWidth - 30
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
}
</style>
