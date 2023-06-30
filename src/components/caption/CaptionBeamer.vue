<template>
  <div class="caption">
    <div v-if="format === 'Thema'" class="theme">
      <svg>
        <text x="0" y="0">
          <tspan x="0" dy="2.6vw">Thema:</tspan>
        </text>
      </svg>
    </div>

    <div v-if="format !== 'Bijbeltekst'" class="title" :style="titleStyle">
      <svg>
        <text x="0" y="0" :class="formatTextClass">
          <tspan
            v-for="(titleLine, i) in titleLines"
            :key="-i"
            :x="titleLine.newLine ? titleTspanX : null"
            :dy="titleLine.newLine ? titleTspanDy : null"
            :class="titleLine.class"
          >
            {{ titleLine.text.replace(/  /g, '&nbsp;&nbsp;') }}
          </tspan>
        </text>
      </svg>
    </div>

    <div class="text" :style="textStyle">
      <svg>
        <text x="0" y="0" :class="formatTextClass">
          <tspan
            v-for="(line, i) in textLines"
            :key="i"
            :x="line.newLine ? '0' : null"
            :dy="line.newLine ? textTspanDy : null"
            :class="line.class"
          >
            {{ line.text.replace(/  /g, '&nbsp;&nbsp;') }}
          </tspan>
        </text>
      </svg>
    </div>

    <div v-if="format === 'Bijbeltekst'" class="title" :style="titleStyle">
      <svg>
        <text x="0" y="0" :class="formatTextClass">
          <tspan
            v-for="(titleLine, i) in titleLines"
            :key="-i"
            :x="titleLine.newLine ? titleTspanX : null"
            :dy="titleLine.newLine ? titleTspanDy : null"
            :class="titleLine.class"
          >
            {{ titleLine.text.replace(/  /g, '&nbsp;&nbsp;') }}
          </tspan>
        </text>
      </svg>
    </div>
  </div>
</template>

<script>
import { wrapTextLinesFormat } from '../common/WrapText'

export default {
  props: {
    title: String,
    text: String,
    format: String
  },
  data () {
    return {
      font: 'Ubuntu, "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif'
    }
  },
  computed: {
    textLines () {
      // split text to main lines
      const lines = this.text
        .replace(/<\/?span(.*?)>/gi, '') // remove drag-drop style text-size
        .replace(/ style="(.*?);">/gi, '>') // remove drag-drop style text-size
        .replace(/([^>])((<\/?([briuspmal]*?)>)*?)<br>((<\/([biuspmal]*?)>)*?)<\/div><div>/g, '$1$2$5</div><div>') // drag-drop to empy line
        .replace(/([^>])((<\/?([briuspmal]*?)>)*?)<br>((<\/([biuspmal]*?)>)*?)<div>/g, '$1$2$5<div>') // drag-drop to empy line
        .replace(/<div>((<([biuspmal]*?)>)*?)<br>((<\/([biuspmal]*?)>)*?)<\/div>/g, '<br>') // lege regel tussenregel met alinea einden en eventuele opmaak
        .replace(/^<div>/, '') // remove 1e div wanneer opmaak niet standaard
        .replace(/<div>/g, '<br>') // overige alinea regeleinden
        .replace(/<\/div>/g, '') // icm bovenstaand
        .split('<br>')

      // for measurement text wrap (same as css)
      let maxWidth = window.innerWidth
      const letterSpacing = '0'
      let fontSize = 3.4 // vw
      const fontBold = ''

      switch (this.format) {
        case 'Thema':
          fontSize = 2.5 // vw
          maxWidth *= 0.90
          break
        default:
          maxWidth *= 0.92
      }

      return wrapTextLinesFormat(lines, maxWidth, this.font, `${fontSize}vw`, `${0.7 * fontSize}vw`, `${0.7 * fontSize}vw`, fontBold, letterSpacing)
    },
    titleLines () {
      // for measurement text wrap (same as css)
      let maxWidth = window.innerWidth
      const letterSpacing = '0.01vw'
      let fontSize = 4.6 // vw
      let fontBold = '700'

      switch (this.format) {
        case 'Thema':
          fontSize = 5.8 // vw
          maxWidth *= 0.90
          break
        case 'Bijbeltekst':
          fontBold = '300'
          break
        case 'Alleen tekst':
          return []
        default:
          maxWidth *= 0.92
      }

      return wrapTextLinesFormat([this.title], maxWidth, this.font, `${fontSize}vw`, `${0.7 * fontSize}vw`, `${0.7 * fontSize}vw`, fontBold, letterSpacing)
    },
    textStyle () {
      const style = {}
      style.position = 'relative'
      style.padding = '0 0 0 0'
      style.width = '92vw'
      style.height = '100%'
      if (this.format === 'Thema') {
        style.position = 'fixed'
        style.top = '28.5vw'
        style.padding = '0 0 0 2vw'
      }
      return style
    },
    titleStyle () {
      const style = {}
      style.padding = '0'
      style.top = '0'
      style.width = '92vw'
      style.height = `${this.titleLines.length * 5 + 1}vw`
      switch (this.format) {
        case 'Thema':
          style.position = 'fixed'
          style.top = '13vw'
          style.height = '14.6vw'
          style.padding = '0 0 0 2vw'
          break
        case 'Bijbeltekst':
          style.position = 'fixed'
          style.top = '65vh'
          style.right = '4vw'
          break
        case 'Alleen tekst':
          style.display = 'none'
          break
        default:
      }
      return style
    },
    titleTspanX () {
      return this.format === 'Bijbeltekst' ? '100%' : '0'
    },
    titleTspanDy () {
      return this.format === 'Thema' ? '6.6vw' : '5.0vw'
    },
    textTspanDy () {
      return this.format === 'Thema' ? '3.1vw' : '4.4vw'
    },
    formatTextClass () {
      switch (this.format) {
        case 'Thema': return 'textTheme'
        case 'Bijbeltekst': return 'textScripture'
        case 'Alleen tekst':
        default: return ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
@function shadow($opacity) {
  @return drop-shadow(0.3vw 0.3vw 0.3vw rgba(0, 0, 0, $opacity));
}
.caption {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 100%;

  .theme {
    padding: 6vw 0 0 2vw;

    svg {
      position: relative;
      // background-color: rgba(0, 255, 55, 0.5);
      width: 100%;
      height: 3.5vw;

      text {
        font-size: 2.6vw;
        letter-spacing: 0.01vw;
        font-style: italic;

        fill: #fff;
        stroke: #000;
        stroke-width: 0.3vw;
        stroke-linejoin: round;
        paint-order: stroke;

        text-anchor: left;
        dominant-baseline: Auto;

        filter: shadow(0.8);
      }
    }
  }
  .title {
    svg {
      position: relative;
      // background-color: rgba(0, 255, 157, 0.5);
      width: 100%;
      height: 100%;

      text {
        font-size: 4.6vw;
        letter-spacing: 0.01vw;
        font-weight: 700;

        fill: #fff;
        stroke: #000;
        stroke-width: 0.5vw;
        stroke-linejoin: round;
        paint-order: stroke;

        text-anchor: left;
        dominant-baseline: Auto;

        filter: shadow(0.8);
      }
    }
    .textTheme {
      font-size: 5.8vw;
    }
    .textScripture{
      text-anchor: end;
      font-weight: 300;
      fill: rgba(255, 255, 255, 0.6);
      stroke: rgba(0, 0, 0, 0.6);
    }
    .bold {
      font-weight: bold;
    }
    .italic {
      font-style: italic;
    }
    .underline {
      text-decoration: underline;
    }
    .sup {
      stroke-width: 0.3vw;
      font-size: 0.7em;
      baseline-shift: 3;
    }
    .small {
      stroke-width: 0.3vw;
      font-size: 0.7em;
    }
  }

  .text {

    svg {
      position: relative;
      // background-color: rgba(76, 0, 255, 0.5);
      width: 100%;
      height: 100%;

      text {
        font-size: 3.4vw;
        letter-spacing: 0.00vw;

        fill: #fff;
        stroke: #000;
        stroke-width: 0.5vw;
        stroke-linejoin: round;
        paint-order: stroke;

        text-anchor: left;
        dominant-baseline: Auto;

        filter: shadow(0.8);
      }
    }
    .textTheme {
      font-size: 2.5vw;
    }
    .bold {
      font-weight: bold;
    }
    .italic {
      font-style: italic;
    }
    .underline {
      text-decoration: underline;
    }
    .sup {
      fill: gray;
      stroke-width: 0.3vw;
      font-size: 0.7em;
      baseline-shift: 3;
    }
    .small {
      stroke-width: 0.3vw;
      font-size: 0.7em;
    }
  }
}

</style>
