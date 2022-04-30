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
        <q-list separator>
          <q-item v-for="hans in [1, 2, 3, 5, 6, 7, 8, 7, 7, 7, 7, 7]" :key="hans" clickable>
            <q-item-section>
              Single line item<br>
              Single line item
            </q-item-section>
          </q-item>
        </q-list>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import useServiceStore from 'stores/service'

export default {
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
    goLive () {
      this.store.liveSong = this.song
    }
  }
}
</script>
