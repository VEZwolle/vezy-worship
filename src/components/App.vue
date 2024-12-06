<template>
  <q-layout>
    <q-header>
      <ToolbarTop />
    </q-header>

    <q-page-container>
      <q-page v-if="$store.service" class="row">
        <div class="col">
          <SetlistControl />
        </div>
        <div class="col">
          <PreviewControl />
        </div>
        <div class="col">
          <LiveControl />
        </div>
      </q-page>

      <q-page v-else class="flex items-center justify-center text-grey-5">
        Open linksboven een dienst om verder te gaan.
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import ToolbarTop from './layout/ToolbarTop.vue'
import SetlistControl from './setlist/SetlistControl.vue'
import PreviewControl from './layout/PreviewControl.vue'
import LiveControl from './layout/LiveControl.vue'

export default {
  components: { ToolbarTop, SetlistControl, PreviewControl, LiveControl },

  mounted () {
    if (localStorage.getItem('darkMode') === 'true') this.$q.dark.set(true)
  }
}
</script>

<style scoped lang="scss">
.col {
  border-right: $layout-border;
  border-width: 3px;

  &:last-child {
    border-right: none;
  }
}

.body--dark {
  .col {
    border-right-color: rgba(255, 255, 255, 0.28);
  }
}
</style>
