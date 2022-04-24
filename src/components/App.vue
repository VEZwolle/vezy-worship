<template>
  <h1 class="text-blue-500">
    {{ store.counter }}
  </h1>

  <button @click="store.increment">
    Increment
  </button>
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
