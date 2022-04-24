<template>
  <h1 class="text-blue-500">
    Beamer {{ store.counter }}
  </h1>
</template>

<script>
import useStore from '@/store'

export default {
  setup () {
    const store = useStore()
    return { store }
  }
}
</script>
