<template>
  <pre>{{ store.previewSong }}</pre>
</template>

<script>
import useServiceStore from 'stores/service'

export default {
  setup () {
    const store = useServiceStore()
    return { store }
  }
}
</script>
