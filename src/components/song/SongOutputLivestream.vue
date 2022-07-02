<template>
  <svg v-if="!clear" class="song-output-livestream" :class="{ alpha }">
    <text :y="(1.6 * outputvw) + 'px'">
      <tspan v-for="(line, i) in lines" :key="i" x="50%" :dy="(4.4 * outputvw) + 'px'">{{ line }}</tspan>
      <tspan v-for="(line, i) in translatedLines" :key="i" x="50%" :dy="(4.2 * outputvw) + 'px'" class="translation">{{ line }}</tspan>
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
      return section?.slides?.[this.presentation.selectedSlideIndex] || []
    },
    translatedLines () {
      const section = this.presentation.translationSections?.[this.presentation.selectedSectionIndex]
      return section?.slides?.[this.presentation.selectedSlideIndex] || []
    },
    cssdropshadow () { // drop-shadow(0.3vw 0.3vw 0.3vw rgba($color, $opacity))
      return {
        live0_8: 'drop-shadow(' + (0.3 * this.outputvw) + 'px ' + (0.3 * this.outputvw) + 'px ' + (0.3 * this.outputvw) + 'px rgba(#000, 0.8))',
        live0_5: 'drop-shadow(' + (0.3 * this.outputvw) + 'px ' + (0.3 * this.outputvw) + 'px ' + (0.3 * this.outputvw) + 'px rgba(#000, 0.5))',
        alpha0_8: 'drop-shadow(' + (0.3 * this.outputvw) + 'px ' + (0.3 * this.outputvw) + 'px ' + (0.3 * this.outputvw) + 'px rgba(#fff, 0.8))',
        alpha0_5: 'drop-shadow(' + (0.3 * this.outputvw) + 'px ' + (0.3 * this.outputvw) + 'px ' + (0.3 * this.outputvw) + 'px rgba(#fff, 0.5))'
      }
    },
    csssongoutputlivestream () {
      return {
        tspan: {
          fontsize: (3.8 * this.outputvw) + 'px',
          letterspacing: (0.01 * this.outputvw) + 'px',
          strokewidth: (0.5 * this.outputvw) + 'px'
        },
        tspantranslation: {
          strokewidth: (0.4 * this.outputvw) + 'px',
          fontsize: (3 * this.outputvw) + 'px'
        }
      }
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
    font-size: v-bind('csssongoutputlivestream.tspan.fontsize');
    letter-spacing: v-bind('csssongoutputlivestream.tspan.letterspacing');

    fill: #fff;
    stroke: #000;
    stroke-width: v-bind('csssongoutputlivestream.tspan.strokewidth');
    stroke-linejoin: round;
    paint-order: stroke;

    text-anchor: middle;
    dominant-baseline: middle;

    filter: v-bind('cssdropshadow.live0_8');
  }

  tspan.translation {
    fill: #bbb;
    font-style: italic;
    stroke-width: v-bind('csssongoutputlivestream.tspantranslation.strokewidth');
    font-size: v-bind('csssongoutputlivestream.tspantranslation.fontsize');
    filter: v-bind('cssdropshadow.live0_5');
  }

  &.alpha {
    tspan {
      fill: #fff;
      stroke: #fff;
      filter: v-bind('cssdropshadow.alpha0_8');
    }

    tspan.translation {
      filter: v-bind('cssdropshadow.alpha0_5');
    }
  }
}
</style>
