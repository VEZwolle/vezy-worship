<template>
  <q-layout view="lHh lpr lFf" container class="full-height">
    <q-header>
      <q-toolbar class="bg-grey-3 text-dark">
        <q-toolbar-title class="text-subtitle2">
          <q-badge rounded color="red" />
          Live
          <span v-if="song">- {{ song.title }}</span>
        </q-toolbar-title>

        <q-toggle
          v-model="store.isClear"
          v-shortkey="['ctrl', 'c']"
          checked-icon="check"
          unchecked-icon="clear"
          color="positive"
          label="Clear"
          @shortkey="store.isClear = !store.isClear"
        >
          <q-tooltip>
            Met clear maak je het scherm leeg<br>(ctrl + c)
          </q-tooltip>
        </q-toggle>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page>
        <SongSectionSelect
          :sections="store.liveSongSections"
          @select-section="selectSection"
          @select-lines="selectLines"
        />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import useServiceStore from 'stores/service'
import SongSectionSelect from './song/SongSectionSelect.vue'

export default {
  components: { SongSectionSelect },
  setup () {
    const store = useServiceStore()
    return { store }
  },
  data () {
    return {
      isClear: false
    }
  },
  computed: {
    song () {
      return this.store.liveSong
    }
  },
  methods: {
    selectSection (section) {
      this.store.selectedSection = section
    },
    selectLines (lines) {
      this.store.selectedLines = lines
    }
  }
}
</script>
