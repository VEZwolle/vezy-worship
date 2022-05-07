<template>
  <div class="text">
    <div v-for="(line, i) in lines" :key="i">
      {{ line }}
    </div>
  </div>
</template>

<script>
import BaseOutput from '../output/BaseOutput.vue'

export default {
  extends: BaseOutput,
  computed: {
    section () {
      return this.presentation.sections[this.presentation.selectedSectionIndex]
    },
    lines () {
      return this.section?.slides.flat() || []
    }
  }
}
</script>

<style scoped>
.text {
  position: absolute;
  top: 10%;
  width: 100%;
  text-align: center;

  color: white;
  font-size: 3.8em;
  font-weight: bold;
  -webkit-text-stroke: 0.05em black;
  line-height: 1.25em;
  letter-spacing: -0.01em;
}
</style>
