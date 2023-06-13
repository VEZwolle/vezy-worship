<template>
  <div class="bg-output-beamer song-output-beamer" :style="style">
    <Transition name="q-transition--fade">
      <svg v-if="!clear" :style="styleOpacity">
        <text y="6.6vw">
          <tspan v-for="(line, i) in wrapLines" :key="i" x="50%" dy="4.4vw">{{ line }}</tspan>
          <tspan x="50%" dy="3vw">&nbsp;</tspan>
          <tspan v-for="(line, i) in wrapTranslatedLines" :key="i" x="50%" dy="4.4vw" class="translation">{{ line }}</tspan>
        </text>
      </svg>
    </Transition>
  </div>
</template>

<script>
import BaseOutput from '../output/BaseOutput.vue'
import { wrapTextLines } from '../common/WrapText'

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
    },
    wrapLines () {
      return wrapTextLines(this.lines, 0.97 * window.innerWidth, '3.8vw Ubuntu, "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif', '0.1vw')
    },
    wrapTranslatedLines () {
      return wrapTextLines(this.translatedLines, 0.97 * window.innerWidth, 'italic 3.4vw Ubuntu, "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif', '0')
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
      font-size: 3.8vw;
      letter-spacing: 0.01vw;

      fill: #fff;
      stroke: #000;
      stroke-width: 0.5vw;
      stroke-linejoin: round;
      paint-order: stroke;

      text-anchor: middle;
      dominant-baseline: middle;

      filter: shadow(0.8);
    }

    tspan.translation {
      fill: #bbb;
      font-style: italic;
      stroke-width: 0.4vw;
      font-size: 3.4vw;
      filter: shadow(0.6);
    }
  }
}
</style>
