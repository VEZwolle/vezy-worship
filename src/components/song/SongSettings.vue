<template>
  <div>
    <q-tabs v-model="tab" class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator :breakpoint="0" @update:model-value="tabSwitch">
      <q-tab name="text" label="Liedtekst" />
      <q-tab v-if="!editEmit" name="settings" label="Instellingen" />
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
                      popup-content-style="height: 30vh;"
                      options-dense
                      :options="$store.dbCollections"
                      @click="loadCollectionDatabase"
                      @popup-show="loadCollectionDatabase"
                    />
                  </template>
                </q-input>
              </div>
              <div class="col-2">
                <q-input v-model="settings.number" outlined label="Nr" />
              </div>
              <div v-if="!editEmit" class="col-auto">
                <q-toggle
                  v-model="$store.searchBaseIsLocal"
                  checked-icon="lyrics"
                  unchecked-icon="cloud"
                  color="primary"
                  dense
                  @update:model-value="$store.dbCollections = ['']"
                >
                  <q-tooltip>cloud of locale database</q-tooltip>
                </q-toggle>
                <q-btn-dropdown
                  split
                  color="primary"
                  label="Uit database"
                  icon="lyrics"
                  class="q-mt-sm"
                  @click.stop="importSongDb"
                >
                  <template #label>
                    <q-tooltip>Songtekst uit locale database opzoeken</q-tooltip>
                  </template>
                  <q-list>
                    <q-item v-close-popup clickable @click="CompareWithDb">
                      <q-item-section>
                        <q-item-label>
                          Vergelijk met database versie
                          <q-tooltip>
                            Lied vergelijken met versie uit de database
                          </q-tooltip>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </div>
            </div>
          </div>
        </div>
        <div class="row q-gutter-md">
          <div class="col">
            <template v-if="textFormat">
              <div>
                <q-avatar icon="text_fields" size="md" />
                Lied tekst
              </div>
              <VezyEditorSong
                id="inputEditorSong"
                ref="inputEditorSong"
                v-model="settings.text"
                v-model:model-backup="backupSettingText"
                height="50vh"
                @scroll="syncInputsEditor('song')"
              />
            </template>
            <q-input
              v-else
              ref="inputSong"
              v-model="settings.text"
              outlined
              label="Tekst"
              type="textarea"
              class="input-songtext"
              @scroll="scroll('song')"
            />
            <q-toolbar class="bg-subtoolbar text-subtoolbar">
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
              <q-space />
              <q-btn flat dense :icon="textFormat ? 'visibility' : 'visibility_off'" @click.stop="toggleTextFormat">
                <q-tooltip>Wissel van editor: Toon verdeling met labels of platte tekst</q-tooltip>
              </q-btn>
            </q-toolbar>
          </div>

          <div class="col">
            <template v-if="textFormat">
              <div>
                <q-avatar icon="translate" size="md" />
                Vertaling
              </div>
              <VezyEditorSong
                id="inputEditorTranslate"
                ref="inputEditorTranslate"
                v-model="settings.translation"
                v-model:model-backup="backupSettingTranslation"
                height="50vh"
                @scroll="syncInputsEditor('translate')"
              />
              <q-toolbar v-if="!settings.translation" class="bg-subtoolbar text-subtoolbar">
                <q-btn
                  flat
                  dense
                  icon="translate"
                  label="Automatisch vertalen"
                  :loading="isTranslating"
                  @click="translate"
                />
              </q-toolbar>
            </template>
            <q-input
              v-else
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
            <q-toolbar v-if="settings.translation" class="bg-subtoolbar text-subtoolbar">
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
              <q-space />
              <q-btn flat dense :icon="textFormat ? 'visibility' : 'visibility_off'" @click.stop="toggleTextFormat">
                <q-tooltip>Wissel van editor: Toon verdeling met labels of  platte tekst</q-tooltip>
              </q-btn>
            </q-toolbar>
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel name="settings">
        <div class="row q-gutter-xs">
          <div class="text">
            Automatisch opsplitsen regels uitzetten
          </div>
          <q-toggle
            v-model="settings.noSplitLines"
            color="primary"
            keep-color
            dense
          />
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
  <SearchDatabaseDialog
    ref="SearchDatabaseDialog"
    v-model:title="settings.title"
    v-model:collection="settings.collection"
    v-model:number="settings.number"
    v-model:text="settings.text"
    v-model:translation="settings.translation"
  />
  <SongDatabaseCompareDialog ref="SongDatabaseCompareDialog" />
</template>

<script>
import SongSettingsTools from './SongSettingsTools.vue'
import SongArrangeDialog from './SongArrangeDialog.vue'
import SongDatabaseCompareDialog from './database/SongDatabaseCompareDialog.vue'
import BackgroundSetting from '../presentation/BackgroundSetting.vue'
import VezyEditorSong from '../common/VezyEditorSong.vue'
import { getAlgoliaCollections } from './database/algolia.js'
import get from 'lodash/get'
import set from 'lodash/set'

export default {
  components: { BackgroundSetting, SongArrangeDialog, SongDatabaseCompareDialog, VezyEditorSong },
  extends: SongSettingsTools,
  data () {
    return {
      tab: 'text',
      isTranslating: false,
      ignoreInput: null,
      ignoreInputEditor: null,
      textFormat: true
    }
  },
  computed: {
    editEmit () {
      return this.presentation?.from === 'database'
    },
    scrollOff () {
      if (this.settings.translation && this.settings.text) return false
      return true
    }
  },
  mounted () {
    this.songObserver = new ResizeObserver(this.resize('song'))
    this.translateObserver = new ResizeObserver(this.resize('translate'))
    this.tabSwitch() // add observe by element exist
  },
  beforeUnmount () {
    this.removeObserveInput()
  },
  methods: {
    toggleTextFormat () {
      if (!this.textFormat) this.removeObserveInput() // remove observe before remove element
      this.textFormat = !this.textFormat
      if (!this.textFormat) this.addObserveInput() // add observe to element
    },
    tabSwitch () {
      if (this.tab === 'text' && !this.textFormat) {
        // add observe only when element exist
        this.addObserveInput()
      } else {
        this.removeObserveInput()
      }
    },
    addObserveInput () {
      this.$nextTick(() => {
        this.songObserver.observe(this.$refs.inputSong.nativeEl)
        this.translateObserver.observe(this.$refs.inputTranslate.nativeEl)
      })
    },
    removeObserveInput () {
      // remove observe, element not exist
      this.songObserver.disconnect()
      this.translateObserver.disconnect()
    },
    importSongDb () {
      this.$refs.SearchDatabaseDialog.show()
    },
    async translate () {
      this.isTranslating = true

      try {
        const result = await this.$api.post('/translate', { text: this.settings.text })
        this.settings.translation = result.translation
      } catch {
        this.$q.notify({ type: 'negative', message: 'Er is iets fout gegaan met het vertalen. Probeer het later opnieuw.' })
      } finally {
        this.isTranslating = false
      }
    },
    syncInputsEditor (input) {
      if (this.scrollOff) return
      if (this.ignoreInputEditor === input) {
        this.ignoreInputEditor = null
        return
      }
      if (input === 'song') {
        this.ignoreInputEditor = 'translate'
        this.$refs.inputEditorTranslate.setScrollPosition(this.$refs.inputEditorSong.getScrollPosition())
      } else {
        this.ignoreInputEditor = 'song'
        this.$refs.inputEditorSong.setScrollPosition(this.$refs.inputEditorTranslate.getScrollPosition())
      }
    },
    syncInputs (input, prop) {
      if (this.scrollOff) return
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
    async loadCollectionDatabase () {
      if (this.$store.searchBaseIsLocal) {
        this.$store.dbCollections = await this.$fsdb.getCollections(true)
        this.songDatabase = await this.$fsdb.getSongDatabaseSettings()
        return
      }
      this.$store.dbCollections = await getAlgoliaCollections(this.$store.algoliaIndexId)
    },
    CompareWithDb () {
      this.$refs.SongDatabaseCompareDialog.show(this.presentation)
    }
  }
}
</script>

<style scoped lang="scss">
.input-songtext :deep(textarea) {
  height: 50vh;
}

.input-songtext :deep(textarea:read-only) {
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

.q-input {
  :deep(.q-select) {
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
