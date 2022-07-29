<template>
  <div class="caption">
    <Transition name="q-transition--fade">
      <div>
        <!--
          <svg>
            <text>
              <tspan x="0%" dy="5vw" class="text">{{ text }}</tspan>
              <tspan x="0%" dy="3vw">&nbsp;</tspan>
              <tspan x="0%" dy="4.4vw" class="title">{{ title }}</tspan>
            </text>
          </svg>
        -->
        <div v-if="format !== 'Standaard omgekeerd'" class="title" v-html="title" />
        <div class="text" v-html="text" />
        <div v-if="format === 'Standaard omgekeerd'" class="title" v-html="title" />
      </div>
    </Transition>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    text: String,
    format: String
  }
}
</script>

<style scoped lang="scss">
@function shadow($opacity) {
  @return drop-shadow(0.3vw 0.3vw 0.3vw rgba(0, 0, 0, $opacity));
}
.caption {
  position: relative;
  width: 100%;
  height: 100%;

  // svg {
  //  position: fixed;
  //  width: 100%;
  //  height: 100%;
  // }

  .title {
    padding: 0;
    width: 100%;

    text-align: left;
    line-height: 4.4vw;
    font-size: 3.8vw;
    letter-spacing: 0.01vw;
    color: $primary;
    // text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
    // filter: shadow(0.8);
  }

  .text {
    padding: 0vw;
    width: 100%;

    text-align: left;
    line-height: 4.4vw;
    font-size: 3.8vw;
    letter-spacing: 0.01vw;
    color: #fff;
    text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
    filter: shadow(0.8);
    // onder copy song, hoort bij svg opmaak
    // fill: #fff;
    // stroke: #000;
    // stroke-width: 0.5vw;
    // stroke-linejoin: round;
    // paint-order: stroke;

    // text-anchor: left;
    // dominant-baseline: left;
  }
}
</style>
