<template>
  <div class="text">
    <div v-for="(line, i) in lines" :key="i">
      {{ line }}
    </div>

    <div v-if="settings.useTranslation" class="translation">
      <div v-for="(line, i) in translatedLines" :key="i">
        {{ line }}
      </div>
    </div>
  </div>
</template>

<script>
import BaseOutput from '../output/BaseOutput.vue'

export default {
  extends: BaseOutput,
  computed: {
    lines () {
      const section = this.presentation.sections?.[this.presentation.selectedSectionIndex]
      return section?.slides.flat() || []
    },
    translatedLines () {
      const section = this.presentation.translationSections?.[this.presentation.selectedSectionIndex]
      return section?.slides.flat() || []
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

.translation {
  margin-top: 2rem;
  font-style: italic;
  color: #777;
}
</style>
