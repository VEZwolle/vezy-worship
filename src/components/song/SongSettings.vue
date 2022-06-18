<template>
  <div>
    <q-tabs v-model="tab" class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator :breakpoint="0">
      <q-tab name="text" label="Liedtekst" />
      <q-tab name="background" label="Achtergrond" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="text">
        <q-input v-model="settings.title" outlined label="Titel" :rules="['required']" />

        <div class="row q-gutter-md">
          <div class="col">
            <q-input v-model="settings.text" outlined label="Tekst" type="textarea" class="input-songtext" />
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

        <img :src="backgroundUrl" class="full-width">
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import BaseSettings from '../presentation/BaseSettings.vue'
import useServiceStore from 'stores/service'

export default {
  extends: BaseSettings,
  setup () {
    const store = useServiceStore()
    return { store }
  },
  data () {
    return {
      tab: 'text',
      isTranslating: false,
      background: null
    }
  },
  computed: {
    backgroundUrl () {
      return this.settings.fileUrl || this.store.service.backgroundImageUrl
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
      this.settings.fileId = this.$fs.createFileId(file)
      this.settings.fileUrl = URL.createObjectURL(file)
    },
    resetBackground () {
      this.settings.fileId = null
      this.settings.fileUrl = null
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
