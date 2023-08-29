<template>
  <div>
    <q-tabs v-model="tab" class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator :breakpoint="0">
      <q-tab name="text" label="Liedtekst" />
      <q-tab v-if="!editEmit" name="background" label="Achtergrond" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="text">
        <div class="row q-gutter-md">
          <div class="col">
            <q-input v-model="settings.title" outlined label="Titel" :rules="['required']" />
          </div>
          <div class="col">
            <div class="row q-gutter-md">
              <div class="col">
                <q-input v-model="settings.collection" outlined label="Collectie">
                  <template #append>
                    <q-select
                      v-model="settings.collection"
                      borderless
                      hide-selected
                      menu-anchor="bottom right"
                      menu-self="top right"
                      options-dense
                      :options="dbCollections"
                      @filter="loadCollectionDatabase"
                    />
                  </template>
                </q-input>
              </div>
              <div class="col-2">
                <q-input v-model="settings.number" outlined label="Nr" />
              </div>
              <div v-if="!editEmit" class="col-auto">
                <q-btn color="primary" label="Uit database" icon="lyrics" class="q-mt-sm" @click.stop="importSongDb">
                  <q-tooltip>Songtekst uit locale database opzoeken</q-tooltip>
                </q-btn>
              </div>
            </div>
          </div>
        </div>
        <div class="row q-gutter-md">
          <div class="col">
            <q-input
              ref="inputSong"
              v-model="settings.text"
              outlined
              label="Tekst"
              type="textarea"
              class="input-songtext"
              @scroll="scroll('song')"
            />
            <q-toolbar class="bg-grey-3 text-dark">
              <q-btn flat dense label="2 > 1 ⏎" @click.stop="replaceDubbeleNewline(input='text')">
                <q-tooltip>Vervang 2 regeleinden door 1</q-tooltip>
              </q-btn>
              <q-space />
              <q-btn flat dense label="> ... <" @click.stop="trimLines(input='text')">
                <q-tooltip>Verwijder spaties begin/eind regels</q-tooltip>
              </q-btn>
              <q-space />
              <q-btn flat dense label="> ...X <" @click.stop="trimRemovePunctuation(input='text')">
                <q-tooltip>Verwijder spaties begin/eind &<br>verwijder leesteken ( . , ; ) eind regels</q-tooltip>
              </q-btn>
              <q-space />
              <q-btn-dropdown split flat dense @click="insertLabelsLines(input='text', label='vers')">
                <template #label>
                  label
                  <q-tooltip>Plaat label bij ALLE onderdelen zonder label</q-tooltip>
                </template>
                <q-list dense>
                  <q-item v-for="label, index of labels" :key="index" v-close-popup clickable style @click="insertLabelsLines(input='text', label=label.key)">
                    <q-item-section>
                      <q-item-label>{{ label.key }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
              <q-space />
              <q-btn flat dense icon="settings_backup_restore" @click.stop="restorBackup(input='text')">
                <q-tooltip>Herstel opdracht (songtekst)</q-tooltip>
              </q-btn>
              <q-space />
              <q-btn flat dense label="Ordenen" @click.stop="arrange()">
                <q-tooltip>Songtekst ordenen<br>EN/NL splitsen<br>Label toevoegen</q-tooltip>
              </q-btn>
            </q-toolbar>
          </div>

          <div class="col">
            <q-input
              ref="inputTranslate"
              v-model="settings.translation"
              outlined
              label="Vertaling"
              type="textarea"
              class="input-songtext"
              :class="{ 'q-field--readonly': !settings.translation }"
              @scroll="scroll('translate')"
            >
              <q-btn
                v-if="!settings.translation"
                stack
                icon="translate"
                label="Automatisch vertalen"
                class="translation-button"
                :loading="isTranslating"
                @click="translate"
              />
            </q-input>
            <q-toolbar v-if="settings.translation" class="bg-grey-3 text-dark">
              <q-btn flat dense label="2 > 1 ⏎" @click.stop="replaceDubbeleNewline(input='translation')">
                <q-tooltip>Vervang 2 regeleinden door 1</q-tooltip>
              </q-btn>
              <q-space />
              <q-btn flat dense label="> ... <" @click.stop="trimLines(input='translation')">
                <q-tooltip>Verwijder spaties begin/eind regels</q-tooltip>
              </q-btn>
              <q-space />
              <q-btn flat dense label="> ...X <" @click.stop="trimRemovePunctuation(input='translation')">
                <q-tooltip>Verwijder spaties begin/eind &<br>verwijder leesteken ( . , ; ) eind regels</q-tooltip>
              </q-btn>
              <q-space />
              <q-btn-dropdown split flat dense @click="insertLabelsLines(input='translation', label='vers')">
                <template #label>
                  label
                  <q-tooltip>Plaat label bij ALLE onderdelen zonder label</q-tooltip>
                </template>
                <q-list dense>
                  <q-item v-for="label, index of labels" :key="index" v-close-popup clickable style @click="insertLabelsLines(input='translation', label=label.key)">
                    <q-item-section>
                      <q-item-label>{{ label.key }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
              <q-space />
              <q-btn flat dense icon="settings_backup_restore" @click.stop="restorBackup(input='translation')">
                <q-tooltip>Herstel opdracht (vertaling)</q-tooltip>
              </q-btn>
              <q-space />
              <q-btn flat dense label="Ordenen" @click.stop="arrange()">
                <q-tooltip>Songtekst ordenen<br>EN/NL splitsen<br>Label toevoegen</q-tooltip>
              </q-btn>
            </q-toolbar>
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel name="background">
        <BackgroundSetting v-model:bgFileId="settings.bgFileId" v-model:bgOpacity="settings.bgOpacity" />
      </q-tab-panel>
    </q-tab-panels>
  </div>

  <SongArrangeDialog
    ref="SongArrangeDialog"
    v-model:text="settings.text"
    v-model:translation="settings.translation"
  />
  <SongDatabaseDialog
    ref="SongDatabaseDialog"
    v-model:title="settings.title"
    v-model:collection="settings.collection"
    v-model:number="settings.number"
    v-model:text="settings.text"
    v-model:translation="settings.translation"
  />
</template>

<script>
import SongSettingsTools from './SongSettingsTools.vue'
import SongArrangeDialog from './SongArrangeDialog.vue'
import SongDatabaseDialog from './database/SongDatabaseDialog.vue'
import BackgroundSetting from '../presentation/BackgroundSetting.vue'
import get from 'lodash/get'
import set from 'lodash/set'

export default {
  components: { BackgroundSetting, SongArrangeDialog, SongDatabaseDialog },
  extends: SongSettingsTools,
  data () {
    return {
      tab: 'text',
      dbCollections: [],
      isTranslating: false,
      ignoreInput: null
    }
  },
  computed: {
    editEmit () {
      return this.presentation?.from === 'database'
    }
  },
  mounted () {
    this.songObserver = new ResizeObserver(this.resize('song'))
    this.songObserver.observe(this.$refs.inputSong.nativeEl)

    this.translateObserver = new ResizeObserver(this.resize('translate'))
    this.translateObserver.observe(this.$refs.inputTranslate.nativeEl)
  },
  beforeUnmount () {
    this.songObserver.disconnect()
    this.translateObserver.disconnect()
  },
  methods: {
    importSongDb () {
      this.$refs.SongDatabaseDialog.show()
    },
    async translate () {
      this.isTranslating = true

      try {
        const result = await this.$api.post('/translate', { text: this.settings.text })
        this.settings.translation = result.translation
      } catch {
        this.$q.notify({ type: 'negative', message: 'Er is iets fout gegaan met het vertalen. Probeer het later opnieuw.', position: 'top' })
      } finally {
        this.isTranslating = false
      }
    },
    syncInputs (input, prop) {
      if (!this.settings.translation) return
      if (this.ignoreInput === input) {
        this.ignoreInput = null
        return
      }
      if (input === 'song') {
        this.ignoreInput = 'translate'
        set(this.$refs.inputTranslate.nativeEl, prop, get(this.$refs.inputSong.nativeEl, prop))
      } else {
        this.ignoreInput = 'song'
        set(this.$refs.inputSong.nativeEl, prop, get(this.$refs.inputTranslate.nativeEl, prop))
      }
    },
    scroll (input) {
      this.syncInputs(input, 'scrollTop')
    },
    resize (input) {
      return () => this.syncInputs(input, 'style.height')
    },
    loadCollectionDatabase (val, update, abort) {
      if (this.dbCollections.length > 0) { // already loaded
        update()
        return
      }
      update(async () => {
        this.dbCollections = await this.$fsdb.getCollections(true)
      })
    }
  }
}
</script>

<style scoped>
.input-songtext::v-deep(textarea) {
  height: 50vh;
}

.input-songtext::v-deep(textarea:read-only) {
  color: #ccc;
}

.translation-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.q-field--focused .translation-button {
  display: none;
}
</style>

<style lang="scss">
.q-input {
  .q-select {
    margin-right: -12px;

    .q-field__control,
    .q-field__control::before {
      background-color: transparent;
      padding-left: 0;
      padding-right: 0;
    }
    .q-field__append {
      padding-left: 0;
    }
  }
}
</style>
