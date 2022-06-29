<template>
  <svg v-if="!clear && !isFinished" class="countdown-output" :class="{ alpha }">
    <text y="2.5vw" x="5vw">{{ remaining }}</text>
  </svg>
</template>

<script>
import BaseOutput from '../output/BaseOutput.vue'

export default {
  extends: BaseOutput,
  computed: {
    remaining () {
      if (this.settings.type === 1) {
        return this.settings.now.format('H:mm:ss')
      } else {
        const hours = this.settings.hours.toString()
        const minutes = this.settings.minutes.toString().padStart(2, '0')
        const seconds = this.settings.seconds.toString().padStart(2, '0')
        if (this.settings.hours > 0) {
          return `${hours}:${minutes}:${seconds}`
        } else {
          return `${minutes}:${seconds}`
        }
      }
    },
    isFinished () {
      return this.settings.hours < 0
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
