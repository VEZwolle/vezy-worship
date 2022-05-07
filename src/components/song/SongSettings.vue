<template>
  <div>
    <q-input v-model="settings.name" outlined label="Titel" stack-label :rules="['required']" />

    <div class="row">
      <div class="col">
        <q-input v-model="settings.text" outlined label="Tekst" stack-label type="textarea" class="input-songtext" />
      </div>
      <div class="col" />
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
</style>
