<template>
  <div class="bg-output-beamer song-output-beamer" :style="style">
    <Transition name="q-transition--fade">
      <svg v-show="!clear" :style="styleOpacity">
        <text :y="`${christmasPadding}vw`">
          <tspan v-for="(line, i) in lines" :key="i" x="50%" dy="3.2vw">{{ line }}</tspan>
          <tspan v-for="(line, i) in translatedLines" :key="i" x="50%" dy="3.2vw" class="translation">{{ line }}</tspan>
        </text>
      </svg>
    </Transition>
  </div>
</template>

<script>
import BaseOutput from '../output/BaseOutput.vue'

export default {
  extends: BaseOutput,
  computed: {
    christmasPadding () {
      if (this.translatedLines.length) {
        return 23.5
      }

      if (this.lines.length === 1) {
        return 25
      }

      return 24
    },
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
  @return drop-shadow(0.3vw 0.3vw 0.3vw rgba(0, 0, 0, $opacity));
}

.song-output-beamer {

  svg {
    position: fixed;
    width: 100%;
    height: 100%;

    tspan {
      font-family: 'CMG Sans';
      font-size: 2.5vw;
      letter-spacing: 0.1vw;

      fill: #fff;
      stroke: #000;
      stroke-width: 0.5vw;
      stroke-linejoin: round;
      paint-order: stroke;

      text-anchor: middle;
      dominant-baseline: middle;
    }

    tspan.translation {
      fill: #bbb;
      font-style: italic;
      stroke-width: 0.4vw;
    }
  }
}
</style>
