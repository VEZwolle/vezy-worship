<template>
  <svg v-if="settings.minutes > 0" class="countdown-output" :class="{ alpha }">
    <text y="2.5rem" x="5rem">{{ remaining }}</text>
  </svg>
</template>

<script>
import BaseOutput from '../output/BaseOutput.vue'

export default {
  extends: BaseOutput,
  computed: {
    remaining () {
      const minutes = this.settings.minutes.toString().padStart(2, '0')
      const seconds = this.settings.seconds.toString().padStart(2, '0')

      return `${minutes}:${seconds}`
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

    font-size: 3.4rem;
    letter-spacing: 0.01rem;

    fill: #fff;
    stroke: #000;
    stroke-width: 0.5rem;
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
