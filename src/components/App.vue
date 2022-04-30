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
    </q-page-container>
  </q-layout>
</template>

<script>
import Toolbar from './Toolbar.vue'
import Setlist from './setlist/Setlist.vue'
import Preview from './Preview.vue'
import Live from './Live.vue'
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
}
</style>
