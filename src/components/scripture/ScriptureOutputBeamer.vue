<template>
  <div v-if="!clear" class="scripture-output">
    <div class="scripture-text">
      <span v-for="(line, i) in lines" :key="i" v-html="line" />
    </div>

    <div class="scripture-title" v-html="title" />
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

      console.log(lines)

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
  padding: 10vh;
  background: rgba(0, 0, 0, 0.5);
}

.scripture-text {
  text-align: justify;
  font-size: 2.4vw;
  line-height: 3.6vw;
  color: #fff;
}

.scripture-title {
  text-align: right;
  font-size: 2.2vw;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.6)
}
</style>
