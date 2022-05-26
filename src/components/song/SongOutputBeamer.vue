<template>
  <svg class="song-output-beamer">
    <text>
      <tspan v-for="(line, i) in lines" :key="i" x="50%" :y="`${(i * 4.4) + 11}rem`">{{ line }}</tspan>
    </text>

    <text v-if="settings.translation" class="translation">
      <tspan v-for="(line, i) in translatedLines" :key="i" x="50%" :y="`${(i * 4.1) + 28}rem`">{{ line }}</tspan>
    </text>
  </svg>
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

<style scoped lang="scss">
@function shadow($opacity) {
  @return drop-shadow(0.3rem 0.3rem 0.3rem rgba(0, 0, 0, $opacity));
}

.song-output-beamer {
  position: fixed;
  width: 100%;
  height: 100%;

  text {
    font-size: 3.8rem;
    letter-spacing: 0.01rem;

    fill: #fff;
    stroke: #000;
    stroke-width: 0.5rem;
    stroke-linejoin: round;
    paint-order: stroke;

    text-anchor: middle;
    dominant-baseline: middle;

    filter: shadow(0.8);
  }

  text.translation {
    fill: #bbb;
    font-style: italic;
    stroke-width: 0.4rem;
    font-size: 3.4rem;
    filter: shadow(0.6);
  }
}
</style>
