<template>
  <Transition name="q-transition--fade">
    <svg v-if="control" v-show="!clear && !control.isFinished" class="countdown-output" :class="{ alpha }">
      <text y="2.5vw" x="5vw">{{ control.remaining }}</text>
    </svg>
  </Transition>
</template>

<script>
import BaseOutput from '../output/BaseOutput.vue'

export default {
  extends: BaseOutput
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
