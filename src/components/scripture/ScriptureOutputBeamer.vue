<template>
  <div class="bg-output-beamer" :style="style">
    <div v-if="!clear" class="full" :style="styleOpacity">
      <div class="scripture-output">
        <CaptionBeamer :title="title" :text="lines" format="Bijbeltekst" />
      </div>
    </div>
  </div>
</template>

<script>
import BaseOutput from '../output/BaseOutput.vue'
import CaptionBeamer from '../caption/CaptionBeamer.vue'

export default {
  components: { CaptionBeamer },
  extends: BaseOutput,
  computed: {
    title () {
      return this.settings.title ? this.settings.title : this.presentationType.title(this.settings)
    },
    lines () {
      const section = this.presentation.sections?.[this.presentation.selectedSectionIndex]
      const lines = section?.slides.flat() || []
      let totalSection = ''
      lines.forEach(line => {
        totalSection = [totalSection, line].filter(Boolean).join('')
      })
      return totalSection.replace(/<br>/g, '<div></div>')
    }
  }
}
</script>

<style scoped>
.scripture-output {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  padding: 5.4vw 4vw 4vw 4vw;
}

.full {
  position: absolute;
  width: 100vw;
  height: 100vh;
}
</style>
