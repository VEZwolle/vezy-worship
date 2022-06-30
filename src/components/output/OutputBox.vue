<template>
  <div v-if="countViewsOutput > 0" id="output-box" class="output-box bg-grey-3">
    <template v-for="view in views" :key="view.id">
      <template v-if="view.output">
        <div class="output-box-view" :style="rootStyle">
          <div class="output-container" :style="containerStyle">
            <Transition name="q-transition--fade">
              <Output :id="view.outputid" :show-background="view.showbackground" :alpha="view.alpha" :preview-presentation="previewPresentation" />
            </Transition>
          </div>
        </div>
      </template>
    </template>
  </div>
  <!--
  <q-slider
    v-if="countViewsOutput > 0"
    v-model="maxzoom"
    :min="0"
    :max="1"
    :step="0.1"
    color="red"
  />
  -->
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

export default {
  components: { Output },
  props: {
    previewPresentation: Boolean,
    beamer: Boolean,
    livestream: Boolean,
    alpha: Boolean
  },
  data () {
    return {
      scale: 0.3, // nog bekijken hoe dit uit te rekenen is (breedte-kolom/1920)
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
    },
    rootStyle () {
      const height = (1080 * this.scale) * this.zoom
      const width = (1920 * this.scale) * this.zoom
      return {
        height: `${height}px`,
        width: `${width}px`
      }
    },
    containerStyle () {
      return {
        width: '1920px',
        height: '1080px',
        transform: `scale(${this.scale * this.zoom})`,
        transformOrigin: 'top left'
      }
    }
  }
}
</script>

<style scoped>
.output-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0px auto 0px auto;
}
.output-box-view {
  margin: 5px 5px 5px 5px;
  pointer-events: none;
}
</style>
