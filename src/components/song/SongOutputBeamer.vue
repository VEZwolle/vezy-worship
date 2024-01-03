<template>
  <div class="bg-output-beamer song-output-beamer" :style="style">
    <Transition name="q-transition--fade">
      <svg v-show="!clear" :style="styleOpacity">
        <text y="6.6vw">
          <tspan v-for="(line, i) in lines" :key="i" x="50%" dy="4.4vw">{{ line }}</tspan>
          <tspan x="50%" dy="3vw">&nbsp;</tspan>
          <tspan v-for="(line, i) in translatedLines" :key="i" x="50%" dy="4.4vw" class="translation">{{ line }}</tspan>
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
    control () {
      return this.presentation.control
    },
    lines () {
      const section = this.control.sections?.[this.control.selectedSectionIndex]
      return section?.slides.flat() || []
    },
    translatedLines () {
      const section = this.control.translationSections?.[this.control.selectedSectionIndex]
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
