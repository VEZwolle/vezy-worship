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
        <text x="0" y="0">
          <tspan
            v-for="(titleLine, i) in titleLines"
            :key="-i"
            :x="titleLine.newLine ? titleTspanX : null"
            :dy="titleLine.newLine ? titleTspanDy : null"
            :class="[titleTspanClass, titleLine.class].filter(Boolean).join(' ')"
          >
            {{ titleLine.text.replace(/  /g, '&nbsp;&nbsp;') }}
          </tspan>
        </text>
      </svg>
    </div>

    <div class="text" :style="textStyle">
      <svg>
        <text x="0" y="0">
          <tspan
            v-for="(line, i) in textLines"
            :key="i"
            :x="line.newLine ? '0' : null"
            :dy="line.newLine ? '4.4vw' : null"
            :class="line.class"
          >
            {{ line.text.replace(/  /g, '&nbsp;&nbsp;') }}
          </tspan>
        </text>
      </svg>
    </div>

    <div v-if="format === 'Bijbeltekst'" class="title" :style="titleStyle">
      <svg>
        <text x="0" y="0">
          <tspan
            v-for="(titleLine, i) in titleLines"
            :key="-i"
            :x="titleLine.newLine ? titleTspanX : null"
            :dy="titleLine.newLine ? titleTspanDy : null"
            :class="[titleTspanClass, titleLine.class].filter(Boolean).join(' ')"
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
  computed: {
    textLines () {
      // split text to main lines
      const lines = this.text
        .replace(/<\/?span(.*?)>/gi, '')
        .replace(/ style="(.*?);">/gi, '>')
        .replace(/<br>/g, '&nbsp;&nbsp;')
        .replace(/<div>/g, '<br>')
        .replace(/<\/div>/g, '')
        .split('<br>')

      return wrapTextLinesFormat(lines, 0.92 * window.innerWidth, 'Ubuntu, "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif', '3.4vw', '3vw', '3vw', '', '0')
    },
    titleLines () {
      let fontBold = '700'
      let fontSize = '4.6vw'
      switch (this.format) {
        case 'Thema':
          fontSize = '5.8vw'
          break
        case 'Bijbeltekst':
          fontBold = '300'
          break
        case 'Alleen tekst':
          return []
        default:
      }
      const letterSpacing = '0.01vw'
      const maxWidth = 0.92 * window.innerWidth

      return wrapTextLinesFormat([this.title], maxWidth, 'Ubuntu, "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif', fontSize, '3vw', '3vw', fontBold, letterSpacing)
    },
    textStyle () {
      const style = {}
      if (this.format === 'Thema') style.padding = '0 0 0 2vw'
      return style
    },
    titleStyle () {
      const style = {}
      style.padding = '0.0vw 0 1.0vw 0'
      style.height = `${this.titleLines.length * 5 + 2}vw`
      switch (this.format) {
        case 'Thema':
          style.position = 'relative'
          style.top = '-1vh'
          style.height = '26vh'
          style.padding = '0 0 0 2vw'
          break
        case 'Bijbeltekst':
          style.position = 'fixed'
          style.top = '67vh'
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
    titleTspanClass () {
      switch (this.format) {
        case 'Thema': return 'thema'
        case 'Bijbeltekst': return 'scripture'
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
    padding: 9vh 0 0 2vw;

    svg {
      position: relative;
      // background-color: rgb(0, 255, 55);
      width: 100%;
      height: 4vw;

      tspan {
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
    width: 92vw;

    svg {
      position: relative;
      // background-color: rgb(0, 255, 157);
      width: 100%;

      tspan {
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
    .thema {
      font-size: 5.8vw;
    }
    .scripture{
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
      fill: gray;
      font-size: 3vw;
      baseline-shift: 3;
    }
    .small {
      font-size: 3vw;
    }
  }

  .text {

    svg {
      position: relative;
      // background-color: blue;
      width: 100%;
      height: 100vh;

      tspan {
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
      font-size: 3vw;
      baseline-shift: 3;
    }
    .small {
      fill: gray;
      font-size: 3vw;
    }
  }
}

</style>
