<template>
  <q-dialog ref="dialog" square>
    <q-card>
      <q-toolbar class="bg-secondary text-white">
        <q-toolbar-title>Instellingen</q-toolbar-title>
        <q-btn v-close-popup flat round dense icon="close" />
      </q-toolbar>

      <q-tabs v-model="tab" class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator :breakpoint="0">
        <q-tab name="displays" label="Output monitoren" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="displays">
          <q-select v-model="displays.beamer" :options="availableDisplayOptions" emit-value map-options clearable label="Beamer" stack-label class="q-mb-sm" />
          <q-select v-model="displays.livestream" :options="availableDisplayOptions" emit-value map-options clearable label="Livestream" stack-label class="q-mb-sm" />
          <q-select v-model="displays.livestreamAlpha" :options="availableDisplayOptions" emit-value map-options clearable label="Livestream alpha channel" stack-label />
        </q-tab-panel>
      </q-tab-panels>

      <q-card-section align="right">
        <q-btn color="secondary" label="Opslaan" icon="save" @click="save" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  data () {
    return {
      availableDisplays: [],
      displays: {},
      tab: 'displays'
    }
  },
  computed: {
    availableDisplayOptions () {
      return this.availableDisplays.map((display, i) => ({
        value: i,
        label: `Monitor ${i + 1}`
      }))
    }
  },
  methods: {
    async show () {
      await this.load()
      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    },
    async load () {
      this.availableDisplays = await this.$electron.getAllDisplays()
      this.displays = await this.$electron.getConfig('displays')
    },
    async save () {
      await this.$electron.setConfig('displays', { ...this.displays })

      this.$q.dialog({
        title: '✅ Wijzigingen opgeslagen',
        message: 'De wijzigingen worden van kracht zodra je de applicatie opnieuw opstart.'
      })
    }
  }
}
</script>

<style scoped>
.q-card {
  min-width: 500px;
}
</style>
