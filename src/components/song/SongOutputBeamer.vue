<template>
  <div class="song-output-beamer" :style="style">
    <Transition name="q-transition--fade">
      <svg v-if="!clear">
        <text :y="(6.6 * outputvw) + 'px'">
          <tspan v-for="(line, i) in lines" :key="i" x="50%" :dy="(4.4 * outputvw) + 'px'">{{ line }}</tspan>
          <tspan x="50%" :dy="(3 * outputvw) + 'px'">&nbsp;</tspan>
          <tspan v-for="(line, i) in translatedLines" :key="i" x="50%" :dy="(4.4 * outputvw) + 'px'" class="translation">{{ line }}</tspan>
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
    lines () {
      const section = this.presentation.sections?.[this.presentation.selectedSectionIndex]
      return section?.slides.flat() || []
    },
    translatedLines () {
      const section = this.presentation.translationSections?.[this.presentation.selectedSectionIndex]
      return section?.slides.flat() || []
    },
    style () {
      const style = {}

      if (this.settings.fileUrl) {
        style.backgroundImage = `url(${this.settings.fileUrl})`
      }

      return style
    },
    cssdropshadow () { // drop-shadow(0.3vw 0.3vw 0.3vw rgba(0, 0, 0, $opacity))
      return {
        beamer0_8: 'drop-shadow(' + (0.3 * this.outputvw) + 'px ' + (0.3 * this.outputvw) + 'px ' + (0.3 * this.outputvw) + 'px rgba(0, 0, 0, 0.8))',
        beamer0_6: 'drop-shadow(' + (0.3 * this.outputvw) + 'px ' + (0.3 * this.outputvw) + 'px ' + (0.3 * this.outputvw) + 'px rgba(0, 0, 0, 0.6))'
      }
    },
    csssongoutputbeamer () {
      return {
        svg: {
          tspan: {
            fontsize: (3.8 * this.outputvw) + 'px',
            letterspacing: (0.01 * this.outputvw) + 'px',
            strokewidth: (0.5 * this.outputvw) + 'px'
          },
          tspantranslation: {
            strokewidth: (0.4 * this.outputvw) + 'px',
            fontsize: (3.4 * this.outputvw) + 'px'
          }
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
@function shadow($opacity) {
  @return drop-shadow(0.3vw 0.3vw 0.3vw rgba(0, 0, 0, $opacity));
}

.song-output-beamer {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;

  svg {
    position: fixed;
    width: 100%;
    height: 100%;

    tspan {
      font-size: v-bind('csssongoutputbeamer.svg.tspan.fontsize');
      letter-spacing: v-bind('csssongoutputbeamer.svg.tspan.letterspacing');

      fill: #fff;
      stroke: #000;
      stroke-width: v-bind('csssongoutputbeamer.svg.tspan.strokewidth');
      stroke-linejoin: round;
      paint-order: stroke;

      text-anchor: middle;
      dominant-baseline: middle;

      filter: v-bind('cssdropshadow.beamer0_8');
    }

    tspan.translation {
      fill: #bbb;
      font-style: italic;
      stroke-width: v-bind('csssongoutputbeamer.svg.tspantranslation.strokewidth');
      font-size: v-bind('csssongoutputbeamer.svg.tspantranslation.fontsize');
      filter: v-bind('cssdropshadow.beamer0_6');
    }
  }
}
</style>
