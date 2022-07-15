<template>
  <div v-if="!clear" class="scripture-output">
    <div>
      <div>
        <span v-for="(line, i) in lines" :key="i" v-html="line" />
      </div>

      <div v-html="title" />
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

      console.log(lines)

      return lines
    }
  }
}
</script>

<style scoped>
.scripture-output {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.scripture-output>div {
  width: 90vw;
  padding: 9vh;
  font-size: 2vw;
  color: #fff;
  background: rgba(0, 0, 0, 0.4);
}
</style>
