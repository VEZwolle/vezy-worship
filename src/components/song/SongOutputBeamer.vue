<template>
  <div class="bg-output-beamer song-output-beamer" :style="style">
    <Transition name="q-transition--fade">
      <div v-show="!clear" :style="offsetServiceType">
        <svg :style="styleOpacity" :class="{ alpha }">
          <text y="6.6vw">
            <tspan v-for="(line, i) in lines" :key="i" x="50%" dy="4.4vw" :style="styleServiceType">{{ line }}</tspan>
            <tspan x="50%" dy="3vw">&nbsp;</tspan>
            <tspan v-for="(line, i) in translatedLines" :key="i" x="50%" dy="4.4vw" class="translation" :style="styleServiceType">{{ line }}</tspan>
          </text>
        </svg>
      </div>
    </Transition>
  </div>
</template>

<script>
import BaseOutput from '../output/BaseOutput.vue'

export default {
  extends: BaseOutput,
  computed: {
    lines () {
      const section = this.control.sections?.[this.control.selectedSectionIndex]
      return section?.slides.flat() || []
    },
    translatedLines () {
      const section = this.control.translationSections?.[this.control.selectedSectionIndex]
      return section?.slides.flat() || []
    },
    styleServiceType () {
      if (!this.$store.serviceType || this.$store.serviceType === 'standaard') return ''
      const style = {}
      switch (this.$store.serviceType) {
        case 'glow':
          style.fontFamily = 'CMG Sans'
          break
        default:
      }
      return style
    },
    offsetServiceType () {
      if (!this.$store.serviceType || this.$store.serviceType === 'standaard') return ''
      const style = {}
      switch (this.$store.serviceType) {
        case 'glow':
          if (this.translatedLines.length) {
            style.marginTop = `calc(50vh - ${this.lines.length * 4.4 + 7.5}vw)`
          } else {
            style.marginTop = `calc(50vh - ${this.lines.length * 2.2 + 6.0}vw)` // 4.4vw/2 = 2.2vw & 6.6vw-4.4vw+3.8vw=6.0vw
          }
          break
        default:
      }
      return style
    }
  }
}
</script>

<style scoped lang="scss">
@function shadow($color, $opacity) {
  @return drop-shadow(0.3vw 0.3vw 0.3vw rgba($color, $opacity));
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

      filter: shadow(#000, 0.8);
    }

    tspan.translation {
      fill: #bbb;
      font-style: italic;
      stroke-width: 0.4vw;
      font-size: 3.4vw;
      filter: shadow(#000, 0.6);
    }

    &.alpha {
      tspan {
        fill: #fff;
        stroke: #fff;
        filter: shadow(#fff, 0.8);
      }

      tspan.translation {
        filter: shadow(#fff, 0.6);
      }
    }

  }
}
</style>
