<template>
  <q-layout>
    <q-header>
      <Toolbar />
    </q-header>

    <q-page-container>
      <q-page v-if="store.service" class="row">
        <div class="col">
          <Setlist />
        </div>
        <div class="col">
          <Preview />
        </div>
        <div class="col">
          <Live />
        </div>
      </q-page>

      <q-page v-else class="flex items-center justify-center text-grey-5">
        Open linksboven een dienst om verder te gaan.
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import Toolbar from './layout/Toolbar.vue'
import Setlist from './setlist/Setlist.vue'
import Preview from './layout/Preview.vue'
import Live from './layout/Live.vue'
import useServiceStore from 'stores/service'

export default {
  components: { Toolbar, Setlist, Preview, Live },
  setup () {
    const store = useServiceStore()
    return { store }
  }
}
</script>

<style scoped lang="scss">
.col {
  border-right: $layout-border;
  border-width: 3px;
}
</style>
