<template>
  <q-responsive :ratio="ratio" class="output-preview">
    <iframe ref="iframe" />
  </q-responsive>
</template>

<script>
import { createApp } from 'vue'

export default {
  props: {
    component: Object,
    ratio: { type: Number, default: 16 / 9 }
  },
  mounted () {
    const iframe = this.$refs.iframe.contentDocument

    // Sync styles
    const styles = document.querySelectorAll('link,style')
    for (const style of styles) {
      iframe.head.append(style.cloneNode(true))
    }

    const app = createApp(this.component, this.$attrs)

    // Sync store
    app.config.globalProperties.$store = this.$store

    app.mount(iframe.body)
  }
}
</script>

<style scoped>
.output-preview {
  background: #000;
  width: 100%;
}

iframe {
  border: none;
}
</style>
