<template>
  <div class="output-preview" :style="rootStyle">
    <div class="output-container bg-grey" :style="containerStyle">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    zoom: { type: Number, default: 1 }
  },
  data () {
    return {
      scale: 0
    }
  },
  computed: {
    rootStyle () {
      const height = (1080 * this.scale) * this.zoom

      return {
        height: `${height}px`,
        transform: `scale(${this.zoom})`,
        transformOrigin: 'top left'
      }
    },
    containerStyle () {
      return {
        width: '1920px',
        height: '1080px',
        transform: `scale(${this.scale})`,
        transformOrigin: 'top left'
      }
    }
  },
  mounted () {
    this.scale = this.$el.offsetWidth / 1920
  }
}
</script>

<style scoped>
.output-preview {
  pointer-events: none;
}
</style>
