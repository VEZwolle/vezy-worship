<template>
  <div>
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
  </div>
</template>

<script>
import BaseSettings from '../presentation/BaseSettings.vue'

export default {
  extends: BaseSettings,
  data () {
    return {
      isTranslating: false
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
