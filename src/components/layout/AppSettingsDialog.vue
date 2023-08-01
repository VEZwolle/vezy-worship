<template>
  <q-dialog ref="dialog" square>
    <q-card>
      <q-toolbar class="bg-secondary text-white">
        <q-toolbar-title>Instellingen</q-toolbar-title>
        <q-btn v-close-popup flat round dense icon="close" />
      </q-toolbar>

      <q-tabs v-model="tab" class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator :breakpoint="0">
        <q-tab name="background" label="Achtergrond" />
        <q-tab name="database" label="Database" />
        <q-tab v-if="$q.platform.is.electron" name="displays" label="Output monitoren" />
        <q-tab v-if="$q.platform.is.electron" name="autoupdate" label="Update" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="displays">
          <q-select v-model="displays.beamer" :options="availableDisplayOptions" emit-value map-options clearable label="Beamer" class="q-mb-sm" />
          <q-select v-model="displays.livestream" :options="availableDisplayOptions" emit-value map-options clearable label="Livestream" class="q-mb-sm" />
          <q-select v-model="displays.livestreamAlpha" :options="availableDisplayOptions" emit-value map-options clearable label="Livestream alpha channel" />
        </q-tab-panel>
        <q-tab-panel name="database">
          <q-btn label="Liederen Database openen/veranderen" color="secondary" @click="loadSongDatabase" />
          <br>(wordt direct ingesteld bij geldige database)
          <br>{{ songDatabase }}
        </q-tab-panel>
        <q-tab-panel name="autoupdate">
          <q-checkbox v-model="autoupdate" label="Automatisch download & update Vezyworship" />
          <div>Wanneer er een update beschikbaar is wordt deze gedownload en na afsluiten van Vezyworship geinstalleerd.</div>
        </q-tab-panel>
        <q-tab-panel name="background">
          <q-input v-model="backgroundColor.beamer" clearable :rules="['anyColor']" label="Beamer achtergrond kleur (Leeg voor foto)" class="q-mb-sm">
            <template #append>
              <q-icon name="colorize" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-color v-model="backgroundColor.beamer" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input v-model="backgroundColor.livestream" clearable :rules="['anyColor']" label="Livestream achtergrond kleur (leeg voor zwart)" class="q-mb-sm">
            <template #append>
              <q-icon name="colorize" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-color v-model="backgroundColor.livestream" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-tab-panel>
      </q-tab-panels>

      <q-card-actions align="right">
        <q-btn color="secondary" label="Opslaan" icon="save" @click="save" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  data () {
    return {
      availableDisplays: [],
      displays: {},
      backgroundColor: {
        beamer: '',
        livestream: ''
      },
      autoupdate: true,
      songDatabase: '',
      tab: 'background'
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
      if (this.$q.platform.is.electron) {
        this.availableDisplays = await this.$electron.getAllDisplays()
        this.displays = await this.$electron.getConfig('displays') || {}
        this.autoupdate = await this.$electron.getConfig('autoupdate')
        if (this.autoupdate === undefined) this.autoupdate = true
      }
      this.backgroundColor.beamer = localStorage.getItem('backgroundColor.beamer') || ''
      this.backgroundColor.livestream = localStorage.getItem('backgroundColor.livestream') || ''
    },
    async save () {
      if (this.$q.platform.is.electron) {
        await this.$electron.setConfig('displays', { ...this.displays })
        await this.$electron.setConfig('autoupdate', this.autoupdate)
      }
      localStorage.setItem('backgroundColor.beamer', this.backgroundColor.beamer || '')
      localStorage.setItem('backgroundColor.livestream', this.backgroundColor.livestream || '')

      this.$q.dialog({
        title: '✅ Wijzigingen opgeslagen',
        message: 'De wijzigingen worden van kracht zodra je de applicatie opnieuw opstart.'
      })
    },
    async loadSongDatabase () {
      await this.$fsdb.openSongDatabase(true)
      this.songDatabase = await this.$fsdb.getSongDatabaseSettings()
    }
  }
}
</script>

<style scoped>
.q-card {
  min-width: 500px;
}
</style>
