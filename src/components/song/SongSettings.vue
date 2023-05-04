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
            <q-input
              ref="inputSong"
              v-model="settings.text"
              outlined
              label="Tekst"
              type="textarea"
              class="input-songtext"
              @scroll="scroll('song')"
            />
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
    </q-tab-panels>
  </div>
</template>

<script>
import BaseSettings from '../presentation/BaseSettings.vue'
import get from 'lodash/get'
import set from 'lodash/set'

export default {
  extends: BaseSettings,
  data () {
    return {
      tab: 'text',
      isTranslating: false,
      background: null,
      ignoreInput: null
    }
  },
  computed: {
    backgroundUrl () {
      return this.$store.getMediaUrl(this.settings.fileId || this.$store.service.backgroundImageId)
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
    },
    syncInputs (input, prop) {
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
