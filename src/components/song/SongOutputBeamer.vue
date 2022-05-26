<template>
  <svg class="song-output-beamer">
    <text y="6.6rem">
      <tspan v-for="(line, i) in lines" :key="i" x="50%" dy="4.4rem">{{ line }}</tspan>
      <tspan x="50%" dy="4rem">&nbsp;</tspan>
      <tspan v-for="(line, i) in translatedLines" :key="i" x="50%" dy="4.4rem" class="translation">{{ line }}</tspan>
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

  tspan {
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

  tspan.translation {
    fill: #bbb;
    font-style: italic;
    stroke-width: 0.4rem;
    font-size: 3.4rem;
    filter: shadow(0.6);
  }
}
</style>
