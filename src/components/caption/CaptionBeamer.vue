<template>
  <div class="caption">
    <Transition name="q-transition--fade">
      <div>
        <div v-if="format === 'Thema'" class="theme">
          Thema:
        </div>
        <div v-if="format !== 'Standaard omgekeerd'" class="title" :style="styleTitle" v-html="title" />
        <div class="text" :style="styleText" v-html="text" />
        <div v-if="format === 'Standaard omgekeerd'" class="title" :style="styleTitle" v-html="title" />
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
  },
  computed: {
    styleTitle () {
      const style = {}
      switch (this.format) {
        case 'Thema':
          style.color = '#fff'
          style.padding = '1vh 0 0.5vw 0'
          style.lineHeight = '6.4vw'
          style.fontSize = '5.0vw'
          style.fontWeight = '700'
          style.height = '28vh'
          break
        default:
          style.color = 'grey'
          style.padding = '0.5vw 0 0.5vw 0'
          style.lineHeight = '4.4vw'
          style.fontSize = '3.0vw'
      }
      return style
    },
    styleText () {
      const style = {}
      switch (this.format) {
        case 'Thema':
          style.lineHeight = '3.5vw'
          style.fontSize = '3.0vw'
          break
        default:
          style.lineHeight = '4.0vw'
          style.fontSize = '3.4vw'
      }
      return style
    }
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
    width: 100%;
    text-align: left;
    letter-spacing: 0.01vw;
    // text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
    filter: shadow(0.8);
  }

  .text {
    padding: 0vw;
    width: 100%;
    text-align: justify;
    letter-spacing: 0.01vw;
    color: #fff;
    // text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
    filter: shadow(0.8);
  }
  .theme {
    padding: 10vh 0 0.5vw 0;
    width: 100%;
    text-align: left;
    line-height: 4.4vw;
    font-size: 3.0vw;
    letter-spacing: 0.01vw;
    color: #fff;
    // text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
    filter: shadow(0.8);
  }
}
</style>
