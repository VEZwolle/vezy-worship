<template>
  <q-dialog ref="dialog" square>
    <q-card>
      <q-toolbar class="bg-secondary text-white">
        <q-btn flat round dense icon="help" />
        <q-toolbar-title>
          <span>VezyWorship Help</span>
        </q-toolbar-title>
        <q-btn v-close-popup flat round dense icon="close" />
      </q-toolbar>

      <q-card-section>
        <div>
          <q-splitter
            v-model="splitterModel"
            unit="px"
            style="height: 70vh"
          >
            <template #before>
              <q-tabs
                v-model="tab"
                vertical
                class="text-teal"
              >
                <q-tab name="main" icon="home" label="Basis" />
                <q-tab name="shortcut" icon="key" label="Snelkoppelingen" />
                <q-tab name="about" icon="build" label="Over" />
              </q-tabs>
            </template>

            <template #after>
              <q-tab-panels
                v-model="tab"
                animated
                swipeable
                vertical
                transition-prev="jump-up"
                transition-next="jump-up"
              >
                <q-tab-panel name="main">
                  <HelpMain />
                </q-tab-panel>
                <q-tab-panel name="shortcut">
                  <HelpShortcut />
                </q-tab-panel>
                <q-tab-panel name="about">
                  <HelpAbout />
                </q-tab-panel>
              </q-tab-panels>
            </template>
          </q-splitter>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn color="secondary" label="Sluiten" icon="close" @click="hide" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import HelpMain from './HelpMain.vue'
import HelpShortcut from './HelpShortcut.vue'
import HelpAbout from './HelpAbout.vue'

export default {
  components: { HelpMain, HelpShortcut, HelpAbout },
  data () {
    return {
      tab: 'main',
      splitterModel: 150
    }
  },
  methods: {
    show () {
      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    }
  }
}
</script>

<style scoped>
.q-card {
  min-width: 60vw;
  min-height: 80vh;
}
</style>
