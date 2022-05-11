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
          :readonly="!settings.useTranslation"
          outlined
          label="Vertaling"
          stack-label
          type="textarea"
          class="input-songtext"
        >
          <q-toggle v-model="settings.useTranslation" checked-icon="check" label="Gebruik vertaling" class="translation-toggle" />
        </q-input>
      </div>
    </div>
  </div>
</template>

<script>
import BaseSettings from '../presentation/BaseSettings.vue'

export default {
  extends: BaseSettings
}
</script>

<style scoped>
.input-songtext::v-deep(textarea) {
  height: 60vh;
}

.input-songtext::v-deep(textarea:read-only) {
  color: #ccc;
}

.translation-toggle {
  position: absolute;
  top: 0.3rem;
  right: 0.2rem;
}
</style>
