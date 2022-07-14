<template>
  <div>
    <q-tabs v-model="tab" class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator :breakpoint="0">
      <q-tab name="text" label="Bijbeltekst" />
      <q-tab name="background" label="Achtergrond" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="text">
        <div class="row">
          <div class="col-4">
            <q-select
              v-model="settings.bible"
              label="Bijbel"
              emit-value
              map-options
              outlined
              options-dense
              :options="bibleOptions"
            />
          </div>

          <div class="col-3 q-pl-sm">
            <q-select
              v-model="settings.book"
              label="Boek"
              emit-value
              map-options
              outlined
              options-dense
              :options="bookOptions"
            />
          </div>

          <div class="col-1 q-pl-sm">
            <q-input
              v-model.number="settings.chapter"
              type="number"
              outlined
              stack-label
              label="Hoofdstuk"
              :rules="['required']"
            />
          </div>

          <div class="col-1 q-pl-sm">
            <q-input
              v-model.number="settings.verseFrom"
              type="number"
              outlined
              stack-label
              label="Vers van"
              :rules="['required']"
            />
          </div>

          <div class="col-1 q-pl-sm">
            <q-input
              v-model.number="settings.verseTo"
              type="number"
              outlined
              stack-label
              label="Vers tot"
              :rules="['required']"
            />
          </div>

          <div class="col-2 q-pl-sm">
            <q-btn stack label="Tekst inladen" icon="download" class="full-width" />
          </div>
        </div>

        <q-input v-model="settings.text" outlined label="Tekst" type="textarea" class="input-bibletext" />
      </q-tab-panel>

      <q-tab-panel name="background">
        <q-file v-model="background" accept="image/*" label="Selecteer achtergrondafbeelding" outlined @update:model-value="updateBackground">
          <template #prepend>
            <q-icon name="image" />
          </template>

          <template v-if="settings.backgroundImageId" #append>
            <q-icon name="cancel" class="cursor-pointer" @click="resetBackground" />
          </template>
        </q-file>

        <img :src="backgroundUrl" class="q-mt-sm full-width">
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import BaseSettings from '../presentation/BaseSettings.vue'
import bibles from './bibles'
import books from './books'

export default {
  extends: BaseSettings,
  data () {
    return {
      tab: 'text',
      background: null
    }
  },
  computed: {
    bibleOptions () {
      return bibles.map(b => ({
        label: b.name,
        value: b.id
      }))
    },
    bookOptions () {
      return books.map(b => ({
        label: b.name,
        value: b.id
      }))
    },
    backgroundUrl () {
      return this.$store.media[this.settings.backgroundImageId || this.$store.service.backgroundImageId]
    }
  },
  methods: {
    updateBackground (file) {
      this.settings.backgroundImageId = this.$store.addMedia(file)
    },
    resetBackground () {
      this.settings.backgroundImageId = null
      this.background = null
    }
  }
}
</script>

<style scoped>
.input-bibletext::v-deep(textarea) {
  height: 60vh;
}
</style>
