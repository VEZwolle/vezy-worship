<template>
  <div class="bg-output-beamer" :style="style">
    <div v-if="!clear" class="scripture-output">
      <div class="scripture-text">
        <span v-for="(line, i) in lines" :key="i" v-html="line" />
      </div>

      <div class="scripture-title" v-html="title" />
    </div>
  </div>
</template>

<script>
import BaseOutput from '../output/BaseOutput.vue'

export default {
  extends: BaseOutput,
  computed: {
    title () {
      return this.presentationType.title(this.settings)
    },
    lines () {
      const section = this.presentation.sections?.[this.presentation.selectedSectionIndex]
      const lines = section?.slides.flat() || []
      // console.log(lines)
      return lines
    }
  }
}
</script>

<style scoped>
.scripture-output {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 5.4vw 4vw 4vw 4vw;
  background: rgba(0, 0, 0, 0.5);
}

.scripture-text {
  text-align: left;
  font-size: 3.4vw;
  line-height: 4.4vw;
  color: #fff;
}

.scripture-title {
  position: fixed;
  top:65vh;
  right: 4vw;
  text-align: right;
  font-size: 4.6vw;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.6)
}
</style>
