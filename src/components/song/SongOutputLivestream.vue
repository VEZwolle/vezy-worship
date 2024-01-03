<template>
  <Transition name="q-transition--fade">
    <svg v-show="!clear" class="song-output-livestream" :class="{ alpha }">
      <text y="1.6vw">
        <tspan v-for="(line, i) in lines" :key="i" x="50%" dy="4.4vw">{{ line }}</tspan>
        <tspan v-for="(line, i) in translatedLines" :key="i" x="50%" dy="4.2vw" class="translation">{{ line }}</tspan>
      </text>
    </svg>
  </Transition>
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
      return section?.slides?.[this.control.selectedSlideIndex] || []
    },
    translatedLines () {
      const section = this.control.translationSections?.[this.control.selectedSectionIndex]
      return section?.slides?.[this.control.selectedSlideIndex] || []
    }
  }
}
</script>

<style scoped lang="scss">
@function shadow($color, $opacity) {
  @return drop-shadow(0.3vw 0.3vw 0.3vw rgba($color, $opacity));
}

.song-output-livestream {
  position: fixed;
  width: 100%;
  height: 100%;
  transform: scaleY(-1); // Flip coordinate system (to align items from bottom)

  text {
    transform: scaleY(-1); // Re-flip to avoid displaying text upside down
    transform-origin: center;
    transform-box: fill-box;
  }

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

    filter: shadow(#000, 0.8);
  }

  tspan.translation {
    fill: #bbb;
    font-style: italic;
    stroke-width: 0.4vw;
    font-size: 3vw;
    filter: shadow(#000, 0.5);
  }

  &.alpha {
    tspan {
      fill: #fff;
      stroke: #fff;
      filter: shadow(#fff, 0.8);
    }

    tspan.translation {
      filter: shadow(#fff, 0.5);
    }
  }
}
</style>
