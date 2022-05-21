<template>
  <div>
    <q-input v-model="settings.name" outlined label="Titel" stack-label :rules="['required']" />

    <div class="row q-gutter-md">
      <div class="col">
        <q-input v-model="settings.text" outlined label="Tekst" stack-label type="textarea" class="input-songtext" />
      </div>

      <div class="col">
        <q-input
          v-model="settings.translation"
          outlined
          label="Vertaling"
          stack-label
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

      this.$api.post('/translate', { text: this.settings.text })
        .then((result) => {
          this.settings.translation = result.translation
        })
        .finally(() => {
          this.isTranslating = false
        })
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
