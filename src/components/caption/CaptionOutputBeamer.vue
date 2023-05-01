<template>
  <div class="caption-output" :style="style">
    <Transition name="q-transition--fade">
      <div v-if="!clear && settings.formatBeamer !== 'Geen' && settings.formatBeamer !== undefined">
        <CaptionBeamer :title="settings.title" :text="settings.text" :format="settings.formatBeamer" />
      </div>
    </Transition>
  </div>
</template>

<script>
import BaseOutput from '../output/BaseOutput.vue'
import CaptionBeamer from './CaptionBeamer.vue'

export default {
  components: { CaptionBeamer },
  extends: BaseOutput,
  computed: {
    backgroundImageUrl () {
      return this.$store.media[this.$store.service?.backgroundImageId]
    },
    style () {
      const style = {}
      const image = this.backgroundImageUrl || require('../../assets/bg.png')
      style.backgroundImage = `url(${image})`
      return style
    }
  }
}
</script>

<style scoped lang="scss">
.caption-output {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  padding: 5.4vw 4vw 4vw 4vw;
  background-size: cover;
}
</style>
