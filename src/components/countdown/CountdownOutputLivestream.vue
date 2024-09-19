<template>
  <div class="bg-output">
    <Transition name="q-transition--fade">
      <svg v-if="control" v-show="!clear && !control.isFinished" class="countdown-output" :class="{ alpha }" :style="positionstyle">
        <text y="2.5vw" x="5vw" :style="positionstyle">{{ control.remaining }}</text>
      </svg>
    </Transition>
  </div>
</template>

<script>
import BaseOutput from '../output/BaseOutput.vue'

export default {
  extends: BaseOutput,

  computed: {
    positionstyle () {
      const style = {}

      if (this.settings.position) {
        console.log(this.settings.position)
        switch (this.settings.position) {
          case 'RO': // RO
            style.transform = 'scale(-1, -1)'
            break
          case 'LO': // LO
            style.transform = 'scale(1, -1)'
            break
          case 'LB': // LB
            style.transform = 'scale(1, 1)'
            break
          case 'RB': // RB
            style.transform = 'scale(-1, 1)'
            break
          default:
        }
      }

      return style
    }
  }
}
</script>

<style scoped lang="scss">
.countdown-output {
  position: fixed;
  width: 100%;
  height: 100%;
  transform: scale(-1, -1); // Flip coordinate system (to align items from bottom)

  text {
    transform: scale(-1, -1); // Re-flip to avoid displaying text upside down
    transform-origin: center;
    transform-box: fill-box;

    font-size: 3.4vw;
    letter-spacing: 0.01vw;

    fill: #fff;
    stroke: #000;
    stroke-width: 0.5vw;
    stroke-linejoin: round;
    paint-order: stroke;

    text-anchor: start;
    dominant-baseline: hanging;
  }

  &.alpha {
    text {
      stroke: #fff;
    }
  }
}
</style>
