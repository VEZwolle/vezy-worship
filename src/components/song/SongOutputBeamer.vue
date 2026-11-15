<template>
  <div class="bg-output song-output-beamer" :style="styleBgBeamer">
    <Transition name="q-transition--fade">
      <div v-show="!clear" v-if="control" :style="offsetServiceType">
        <svg :style="styleOpacityBeamer" :class="{ alpha }">
          <text y="6.6vw">
            <tspan v-for="(line, i) in lines" :key="i" x="50%" :dy="dyLine" :style="styleTspan">{{ line }}</tspan>
            <tspan x="50%" dy="3vw" :style="styleTspan">&nbsp;</tspan>
            <tspan v-for="(line, i) in translatedLines" :key="i" x="50%" :dy="dyLineTranslation" class="translation" :style="styleTspanTranslation">{{ line }}</tspan>
          </text>
        </svg>
      </div>
    </Transition>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import BaseOutput from '../output/BaseOutput.vue'

export default defineComponent({
  name: 'SongOutputBeamer',
  extends: BaseOutput,
  computed: {
    lines () {
      if (!this.control) return []
      const section = this.control.sections?.[this.control.selectedSectionIndex]
      return section?.slides.flat() || []
    },
    translatedLines () {
      if (!this.control) return []
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
            style.marginTop = `calc(50vh - ${this.lines.length * 4.4 + 9.7}vw)` // 4.4vw*2/2 = 4.4vw & 6.6vw+3vw/2-4.4/2vw+3.8vw=8.2vw
          } else {
            style.marginTop = `calc(50vh - ${this.lines.length * 2.2 + 8.2}vw)` // 4.4vw/2 = 2.2vw & 6.6vw-4.4/2vw+3.8vw=8.2vw
          }
          break
        default:
      }
      return style
    },
    dyLine () {
      return `${ this.control.lineHeigth || 4.4}vw`
    },
    dyLineTranslation () {
      return `${this.control.translationLineHeigth || 4.4}vw`
    },
    styleTspan () {
      const style = {}
        style.fontFamily = this.control.fontFamily || '\'Alan Sans\', sans-serif'
        style.fontSize = `${this.control.fontSize || 3.8}vw`
        style.letterSpacing =  `${this.control.letterSpacing || 0.01}vw`
        style.fontStyle = this.control.fontStyle || 'normal'
        style.fontWeight = this.control.fontWeight  || 400

        style.fill = this.control.fill || '#fff'
        if (this.control.strokeWidth) {
          style.stroke = this.control.stroke || '#000'
          style.strokeWidth = `${this.control.strokeWidth || 0.5}vw`
          style.strokeLinejoin = this.control.strokeLinejoin || 'round'
        }
        style.paintOrder = this.control.paintOrder || 'stroke'
        
        style.textAnchor = this.control.textAnchor || 'middle'
        style.dominantBaseline = this.control.dominantBaseline || 'middle'
        
        if (this.control.filterlength && this.control.filter) {
          style.filter = `drop-shadow(${this.control.filterlength || 0.3}vw ${this.control.filterlength || 0.3}vw ${this.control.filterlength || 0.3}vw rgba(0, 0, 0, ${this.control.filter || 0.8}))` // 'shadow(#000, 0.8)'
        }
      return style
    },
    styleTspanTranslation () {
      const style = {}
        style.fontFamily = this.control.fontFamily || '\'Alan Sans\', sans-serif'
        style.fontSize = `${this.control.translationFontSize || 3.4}vw`
        style.letterSpacing =  `${this.control.letterSpacing || 0.01}vw`
        style.fontStyle = this.control.translationFontStyle || 'italic'
        style.fontWeight = this.control.translationFontWeight || 400

        style.fill = this.control.translationFill || '#bbb'
        if (this.control.translationStrokeWidth) {
          style.stroke = this.control.stroke || '#000'
          style.strokeWidth = `${this.control.translationStrokeWidth || 0.4}vw`
          style.strokeLinejoin = 'round'
        }
        style.paintOrder = 'stroke'
        
        style.textAnchor = 'middle'
        style.dominantBaseline = 'middle'
        
        if (this.control.translationFilterlength && this.control.translationFilter) {
          style.filter = `drop-shadow(${this.control.translationFilterlength || 0.3}vw ${this.control.translationFilterlength || 0.3}vw ${this.control.translationFilterlength || 0.3}vw rgba(0, 0, 0, ${this.control.translationFilter || 0.6}))` // 'shadow(#000, 0.6)'
        }
      return style
    }
  }
})
</script>

<style scoped lang="scss">
@function shadow($color, $opacity) {
  @return drop-shadow(0.3vw 0.3vw 0.3vw rgba($color, $opacity));
}

.song-output-beamer {

  svg {
    position: fixed;
    width: 100%;
    height: 120%;

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
