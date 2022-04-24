<template>
  <div class="p-3">
    <h1 class="text-blue-500">
      Setlist
    </h1>
  </div>
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
