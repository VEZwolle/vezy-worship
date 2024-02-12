<template>
  <div class="caption">
    <div v-if="format === 'Thema'" class="theme">
      <svg :class="{ alpha }">
        <text x="0" y="0">
          <tspan x="4vw" dy="2.6vw">Thema:</tspan>
        </text>
      </svg>
    </div>

    <div v-if="format !== 'Bijbeltekst'" class="title" :style="titleStyle">
      <svg :class="{ alpha }">
        <text x="0" y="0" :class="formatTextClass">
          <tspan
            v-for="(titleLine, i) in titleLines"
            :key="-i"
            :x="titleLine.newLine ? titleTspanX : null"
            :dy="titleLine.newLine ? titleTspanDy : null"
            :class="titleLine.class"
          >
            {{ titleLine.text ? titleLine.text.replace(/  /g, '&nbsp;&nbsp;') : '' }}
          </tspan>
        </text>
      </svg>
    </div>

    <div class="text" :style="textStyle">
      <svg :class="{ alpha }">
        <text x="0" y="0" :class="formatTextClass">
          <tspan
            v-for="(line, i) in textLines"
            :key="i"
            :x="line.newLine ? textTspanX : null"
            :dy="line.newLine ? textTspanDy : null"
            :class="line.class"
          >
            {{ line.text ? line.text.replace(/  /g, '&nbsp;&nbsp;') : '' }}
          </tspan>
        </text>
      </svg>
    </div>

    <div v-if="format === 'Bijbeltekst'" class="title" :style="titleStyle">
      <svg :class="{ alpha }">
        <text x="0" y="0" :class="formatTextClass">
          <tspan
            v-for="(titleLine, i) in titleLines"
            :key="-i"
            :x="titleLine.newLine ? titleTspanX : null"
            :dy="titleLine.newLine ? titleTspanDy : null"
            :class="titleLine.class"
          >
            {{ titleLine.text ? titleLine.text.replace(/  /g, '&nbsp;&nbsp;') : '' }}
          </tspan>
        </text>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    titleLines: Object,
    textLines: Object,
    format: String,
    alpha: Boolean
  },
  computed: {
    textStyle () {
      const style = {}
      style.position = 'relative'
      style.padding = '0 0 0 0'
      style.width = '100vw'
      style.height = '100%'
      switch (this.format) {
        case 'Thema':
          style.position = 'fixed'
          style.top = '28.5vw'
          style.padding = '0 0 0 2vw'
          break
        case 'Titel':
          style.marginTop = '-1vw'
          style.textAnchor = 'middle'
          style.dominantBaseline = 'middle'
          break
        case 'Standaard':
          style.marginTop = '-1vw'
          break
        default:
      }
      return style
    },
    titleNewLines () {
      let i = 0
      for (const titleLine of this.titleLines) {
        if (titleLine.newLine) i++
      }
      return i
    },
    titleStyle () {
      const style = {}
      style.padding = '0'
      style.top = '0'
      style.width = '100vw'
      style.height = `${(this.titleNewLines || 0) * 5 + 2}vw`
      switch (this.format) {
        case 'Thema':
          style.position = 'fixed'
          style.top = '13vw'
          style.height = '14.6vw'
          style.padding = '0 0 0 2vw'
          break
        case 'Titel':
          style.marginTop = this.titleNewLines !== 1 ? '2.1vw' : '6vw'
          style.height = `${(this.titleNewLines || 0) * 6.6 + 3}vw`
          style.textAnchor = 'middle'
          style.dominantBaseline = 'middle'
          break
        case 'Bijbeltekst':
          style.position = 'fixed'
          style.top = '65vh'
          style.right = '0'
          break
        case 'Alleen tekst':
          style.display = 'none'
          break
        default:
      }
      return style
    },
    titleTspanX () {
      switch (this.format) {
        case 'Titel': return '50%'
        case 'Bijbeltekst': return '96vw'
        default: return '4vw'
      }
    },
    titleTspanDy () {
      switch (this.format) {
        case 'Titel': return '6.6vw'
        case 'Thema': return '6.6vw'
        default: return '5vw'
      }
    },
    textTspanX () {
      return this.format === 'Titel' ? '50%' : '4vw'
    },
    textTspanDy () {
      switch (this.format) {
        case 'Titel': return '6vw'
        case 'Thema': return '3.1vw'
        default: return '4.4vw'
      }
    },
    formatTextClass () {
      switch (this.format) {
        case 'Thema': return 'textTheme'
        case 'Bijbeltekst': return 'textScripture'
        case 'Titel': return 'textTitle'
        case 'Alleen tekst':
        default: return ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
@function shadow($color, $opacity) {
  @return drop-shadow(0.3vw 0.3vw 0.3vw rgba($color, $opacity));
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

        filter: shadow(#000, 0.8);
      }
      &.alpha {
        text {
          fill: #fff;
          stroke: #fff;
          filter: shadow(#fff, 0.8);
        }
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

        filter: shadow(#000, 0.8);
      }

      &.alpha {
        text {
          fill: #fff;
          stroke: #fff;
          filter: shadow(#fff, 0.8);
        }
      }
    }
    .textTheme {
      font-size: 5.8vw;
    }
    .textTitle {
      font-size: 6vw;
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
    .alpha {
      .textScripture{
        fill: #fff;
        stroke: #fff;
      }
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

        filter: shadow(#000, 0.8);
      }

      &.alpha {
        text {
          fill: #fff;
          stroke: #fff;
          filter: shadow(#fff, 0.8);
        }
      }
    }
    .textTheme {
      font-size: 2.5vw;
    }
    .textTitle {
      font-size: 5vw;
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
    .alpha {
      .sup {
        fill: #fff;
      }
    }
  }
}

</style>
