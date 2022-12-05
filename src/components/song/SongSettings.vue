<template>
  <div>
    <q-tabs v-model="tab" class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator :breakpoint="0">
      <q-tab name="text" label="Liedtekst" />
      <q-tab name="background" label="Achtergrond" />
      <q-tab name="arrange" label="Opdelen" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="text">
        <q-input v-model="settings.title" outlined label="Titel" :rules="['required']" />

        <div class="row q-gutter-md">
          <div class="col">
            <q-input v-model="settings.text" outlined label="Tekst" type="textarea" class="input-songtext" />
            <q-menu context-menu no-focus>
              <q-list dense style="min-width: 100px">
                <q-item v-close-popup clickable @click.stop="replaceDubbeleNewline(input='text')">
                  <q-item-section avatar>
                    <q-avatar color="primary" text-color="white" size="28px" flat round icon="unfold_less" />
                  </q-item-section>
                  <q-item-section>Vervang 2 regeleinden door 1</q-item-section>
                </q-item>
                <q-item v-close-popup clickable @click.stop="trimLines(input='text')">
                  <q-item-section avatar>
                    <q-avatar color="primary" text-color="white" size="28px" flat round icon="code" />
                  </q-item-section>
                  <q-item-section>Verwijder spaties begin/eind regels</q-item-section>
                </q-item>
                <q-item v-close-popup clickable @click.stop="restorBackup(input='text')">
                  <q-item-section avatar>
                    <q-avatar color="primary" text-color="white" size="28px" flat round icon="settings_backup_restore" />
                  </q-item-section>
                  <q-item-section>Herstel opdracht</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </div>

          <div class="col">
            <q-input
              v-model="settings.translation"
              outlined
              label="Vertaling"
              type="textarea"
              class="input-songtext"
              :class="{ 'q-field--readonly': !settings.translation }"
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
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="background">
        <q-file v-model="background" accept="image/*" label="Selecteer achtergrondafbeelding" outlined @update:model-value="updateBackground">
          <template #prepend>
            <q-icon name="image" />
          </template>

          <template v-if="settings.fileId" #append>
            <q-icon name="cancel" class="cursor-pointer" @click="resetBackground" />
          </template>
        </q-file>

        <img :src="backgroundUrl" class="q-mt-sm full-width">
      </q-tab-panel>

      <q-tab-panel name="arrange">
        <SongArrange :settings="settings" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import SongSettingsTools from './SongSettingsTools.vue'
import SongArrange from './SongArrange.vue'

export default {
  components: { SongArrange },
  extends: SongSettingsTools,
  data () {
    return {
      tab: 'text',
      isTranslating: false,
      background: null
    }
  },
  computed: {
    backgroundUrl () {
      return this.$store.getMediaUrl(this.settings.fileId || this.$store.service.backgroundImageId)
    }
  },
  methods: {
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
    updateBackground (file) {
      this.settings.fileId = this.$store.addMedia(file)
    },
    resetBackground () {
      this.settings.fileId = null
      this.background = null
    }
  }
}
</script>

<style scoped>
.input-songtext::v-deep(textarea) {
  height: 60vh;
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
