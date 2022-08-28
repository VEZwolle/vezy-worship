<template>
  <div class="caption">
    <Transition name="q-transition--fade">
      <div>
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

  .title {
    padding: 0.5vw 0 0.5vw 0;
    width: 100%;

    text-align: left;
    line-height: 4.4vw;
    font-size: 3.0vw;
    letter-spacing: 0.01vw;
    color: $primary;
    // text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
    filter: shadow(0.8);
  }

  .text {
    padding: 0vw;
    width: 100%;

    text-align: justify;
    line-height: 4.0vw;
    font-size: 3.4vw;
    letter-spacing: 0.01vw;
    color: #fff;
    // text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
    filter: shadow(0.8);
  }
}
</style>
