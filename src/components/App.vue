<template>
  <div class="h-screen flex flex-col">
    <Toolbar class="border-b" />

    <div class="h-full grid grid-cols-3">
      <Setlist class="border-r" />
      <Preview class="border-r" />
      <Live />
    </div>
  </div>
</template>

<script>
import useStore from '@/store'
import Toolbar from './Toolbar.vue'
import Setlist from './Setlist.vue'
import Preview from './Preview.vue'
import Live from './Live.vue'

export default {
  components: { Toolbar, Setlist, Preview, Live },
  setup () {
    const store = useStore()
    return { store }
  }
}
</script>
