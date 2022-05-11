<template>
  <div class="text" :class="{ alpha }">
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
      return this.presentation.sections?.[this.presentation.selectedSectionIndex]
    },
    lines () {
      return this.section?.slides?.[this.presentation.selectedSlideIndex] || []
    }
  }
}
</script>

<style scoped>
.text {
  position: absolute;
  bottom: 5%;
  width: 100%;
  text-align: center;

  color: white;
  font-size: 3em;
  font-weight: bold;
  -webkit-text-stroke: 0.05em black;
  line-height: 1.1em;
}

.text.alpha {
  -webkit-text-stroke-color: white;
}
</style>
