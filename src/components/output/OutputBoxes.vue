<template>
  <div class="bg-subtoolbar output-boxes-container">
    <div v-if="activeViews.length" class="output-boxes">
      <template v-for="view in views" :key="view.id">
        <div v-if="view.isActive" class="col output-box">
          <Transition name="q-transition--fade">
            <OutputPreview
              :id="view.id"
              :component="Output"
              muted
              :preview="preview"
              :alpha="view.alpha"
              :show-background="view.showBackground"
              :show-messages="view.showMessages"
              :visual-view="visualViewBeamer ? view.id : ''"
            />
          </Transition>
        </div>
      </template>
    </div>

    <div class="output-boxes-selection text-caption text-subtolbar">
      <q-checkbox
        v-model="visualViewBeamer"
        right-label
        size="xs"
        label="check zichtbaarheid"
      >
        <q-tooltip>Toon zichtbaar gebied vanuit zaal op beamer & voor livestream bij tv randen</q-tooltip>
      </q-checkbox>
      <q-space />
      <template v-for="(view, index) in views" :key="view.id">
        <q-checkbox
          v-if="!view.alpha"
          v-model="view.isActive"
          right-label
          size="xs"
          :label="view.name"
        >
          <q-tooltip>Toon miniatuurweergave van {{ view.name }}</q-tooltip>
          <q-menu v-if="index + 1 < views.length" context-menu no-focus>
            <q-list dense style="min-width: 210px">
              <q-item v-close-popup clickable>
                <q-item-section>
                  <q-checkbox
                    v-model="views[index+1].isActive"
                    right-label
                    size="xs"
                    :label="views[index+1].name"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-checkbox>
      </template>
    </div>
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
    livestream: Boolean
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
          id: 'beamer',
          name: 'Beamer Alpha channel',
          alpha: true,
          showBackground: true,
          showMessages: true,
          isActive: false
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
          name: 'Livestream Alpha channel',
          alpha: true,
          showBackground: false,
          showMessages: false,
          isActive: false
        }
      ],
      visualViewBeamer: false
    }
  },
  computed: {
    activeViews () {
      return this.views.filter(v => v.isActive)
    }
  }
}
</script>

<style scoped lang="scss">
.output-boxes-container {
  padding: 5px 3px;
  border-top: $layout-border;
}

.output-boxes {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.output-box {
  padding: 0 2px;
  padding-bottom: 0;
  max-width: 60%;
}

.output-boxes-selection {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
