<template>
  <q-card flat square class="full-height">
    <q-toolbar class="bg-grey-3">
      <q-toolbar-title class="text-subtitle2">
        Live <q-badge rounded color="red" />
      </q-toolbar-title>

      <q-btn label="Clear" icon="cancel_presentation" :disabled="!song">
        <q-tooltip>
          Maak het scherm leeg (Ctrl + c)
        </q-tooltip>
      </q-btn>
    </q-toolbar>

    <q-card-section>
      {{ song }}
    </q-card-section>
  </q-card>
</template>

<script>
import useServiceStore from 'stores/service'

export default {
  setup () {
    const store = useServiceStore()
    return { store }
  },
  computed: {
    song () {
      return this.store.liveSong
    }
  }
}
</script>
