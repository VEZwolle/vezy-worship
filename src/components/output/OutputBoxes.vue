<template>
  <div class="bg-grey-3">
    <div v-if="activeViews.length" class="output-boxes">
      <template v-for="view in views" :key="view.id">
        <Transition v-if="view.isActive" name="q-transition--fade">
          <OutputPreview
            :id="view.id"
            :component="Output"
            muted
            :preview="preview"
            :alpha="view.alpha"
            :show-background="view.showBackground"
            :show-messages="view.showMessages"
          />
        </Transition>
      </template>
    </div>

    <q-toolbar class="text-dark">
      <q-toolbar-title class="text-subtitle2">
        Voorbeeld:
        <q-checkbox
          v-for="view in views"
          :key="view.id"
          v-model="view.isActive"
          right-label
          :label="view.name"
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
    preview: Boolean,
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
          id: 'beamer',
          name: 'Beamer',
          alpha: false,
          showBackground: true,
          showMessages: true,
          isActive: this.beamer
        },
        {
          id: 'livestream',
          name: 'Livestream',
          alpha: false,
          showBackground: false,
          showMessages: false,
          isActive: this.livestream
        },
        {
          id: 'livestream',
          name: 'Alpha channel',
          alpha: true,
          showBackground: false,
          showMessages: false,
          isActive: this.alpha
        }
      ]
    }
  },
  computed: {
    activeViews () {
      return this.views.filter(v => v.isActive)
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
  padding: 5px;
  padding-bottom: 0;
}
</style>
