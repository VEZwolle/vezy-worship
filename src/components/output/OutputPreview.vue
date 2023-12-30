<template>
  <q-responsive :ratio="$store.outputRatio" class="output-preview" :style="style">
    <iframe v-show="show" ref="iframe" />
    <img v-if="visualView" :src="require(`../../assets/view${visualView}.png`)" class="overlay">
  </q-responsive>
</template>

<script>
import { createApp } from 'vue'
import { debounce } from 'quasar'

export default {
  props: {
    component: Object,
    visualView: {
      type: String,
      default: ''
    },
    bgStyle: Object
  },
  data () {
    return {
      show: false
    }
  },
  computed: {
    style () {
      if (this.bgStyle) return this.bgStyle
      const style = {}
      style.backgroundImage = 'repeating-linear-gradient(#eee 0 8px, transparent 0 16px), repeating-linear-gradient(90deg, #eee 0 8px, transparent 0 16px)'
      style.backgroundBlendMode = 'screen'
      return style
    }
  },
  created () {
    this.showDebounce = debounce(this.showDebounce, 100)
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

    // delay show ifarme: ivm eerst volledig geladen moet zijn voor weergave, anders zie je scrollbars
    this.showDebounce()
  },
  methods: {
    showDebounce () {
      this.show = true
    }
  }
}
</script>

<style scoped>
.output-preview {
  overflow: hidden;
  width: 100%;
  pointer-events: none;
}

iframe {
  border: none;
}

.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 999;
  opacity: 0.4;
}
</style>
