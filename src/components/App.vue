<template>
  <q-layout>
    <q-header elevated>
      <Toolbar />
    </q-header>

    <q-page-container>
      <q-page class="row">
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
import Setlist from './Setlist.vue'
import Preview from './Preview.vue'
import Live from './Live.vue'

export default {
  components: { Toolbar, Setlist, Preview, Live }
}
</script>

<style scoped lang="scss">
.col {
  border-right: $layout-border;
}
</style>
