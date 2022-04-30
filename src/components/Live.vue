<template>
  <q-layout view="lHh lpr lFf" container class="full-height">
    <q-header>
      <q-toolbar class="bg-grey-3 text-dark">
        <q-toolbar-title class="text-subtitle2">
          <q-badge rounded color="red" />
          Live
          <span v-if="song">- {{ song.title }}</span>
        </q-toolbar-title>

        <q-checkbox
          v-model="store.isClear"
          v-shortkey="['ctrl', 'c']"
          left-label
          label="Clear"
          color="red"
          @shortkey="store.toggleClear"
        >
          <q-tooltip>
            Vink aan om het scherm leeg te maken<br>(ctrl + c)
          </q-tooltip>
        </q-checkbox>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page>
        <SongSectionSelect
          :sections="store.liveSongSections"
          :selected-section-index="store.selectedSectionIndex"
          :selected-slide-index="store.selectedSlideIndex"
          @select="store.selectSlide"
          @dblclick="store.unclear"
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
  }
}
</script>
