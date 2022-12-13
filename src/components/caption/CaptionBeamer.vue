<template>
  <div class="caption">
    <Transition name="q-transition--fade">
      <div>
        <div v-if="format === 'Thema'" class="theme">
          Thema:
        </div>
        <div v-if="format !== 'Bijbeltekst'" class="title" :style="styleTitle" v-html="title" />
        <div class="text" :style="styleText" v-html="text" />
        <div v-if="format === 'Bijbeltekst'" class="title" :style="styleTitle" v-html="title" />
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
      style.color = '#fff'
      style.padding = '0.0vw 0 1.0vw 0'
      style.lineHeight = '5.0vw'
      style.fontSize = '4.6vw'
      style.fontWeight = '700'
      switch (this.format) {
        case 'Thema':
          style.position = 'relative'
          style.top = '-1vh'
          style.height = '26vh'
          style.padding = '0 0 0 2vw'
          style.lineHeight = '6.6vw'
          style.fontSize = '5.8vw'
          break
        case 'Bijbeltekst':
          style.position = 'fixed'
          style.top = '67vh'
          style.right = '4vw'
          style.textAlign = 'right'
          break
        case 'Alleen tekst':
          style.display = 'none'
          break
        default:
      }
      return style
    },
    styleText () {
      const style = {}
      style.lineHeight = '4.4vw'
      style.fontSize = '3.4vw'
      switch (this.format) {
        case 'Thema':
          style.padding = '0 0 0 2vw'
          style.lineHeight = '3.1vw'
          style.fontSize = '2.5vw'
          break
        default:
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
    text-align: left;
    letter-spacing: 0.00vw;
    color: #fff;
    // text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
    filter: shadow(0.8);
  }
  .theme {
    padding: 15vh 0 0 2vw;
    width: 100%;
    color: #fff;
    text-align: left;
    font-style: italic;
    line-height: 4.4vw;
    font-size: 2.6vw;
    letter-spacing: 0.01vw;
    // text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
    filter: shadow(0.8);
  }
}
</style>
