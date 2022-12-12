<template>
  <div class="caption" :class="{ alpha }">
    <div class="title" :class="'title' + format" v-html="title" />
    <div class="text" :class="'text' + format" v-html="text" />
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    text: String,
    format: {
      type: String,
      default: '-default'
    },
    alpha: Boolean
  }
}
</script>

<style scoped lang="scss">
.caption {
  position: relative;

  .title {
    position: absolute;
    background: $primary;
    color: #fff;
    padding: 0.3vw 5vw 0.3vw 1vw;
    width: max-content;
    min-width: 15vw;
  }
  .title-default {
    top: -1.3vw;
    left: 2vw;
    font-size: 1.3vw;
  }
  .title-big-bottom {
    top: -2.4vw;
    left: 4vw;
    font-size: 2.2vw;
  }
  .title-big-right {
    top: 4vw;
    left: 1vw;
    font-size: 2.2vw;
  }

  .text {
    background: #fff;
    min-width: 30vw;
    max-width: 100%;
  }
  .text-default {
    padding: 2vw 1.5vw 1.5vw 2vw;
    width: max-content;
    font-size: 1.7vw;
    line-height: 2.2vw;
  }
  .text-big-bottom {
    text-align: justify;
    padding: 2vw 2vw 1.5vw 2vw;
    width: 100vw;
    font-size: 2.2vw;
    line-height: 2.7vw;
  }
  .text-big-right {
    text-align: left;
    padding: 8.4vw 4vw 4vw 2vw;
    width: 45vw;
    height: 100vh;
    overflow: hidden;
    font-size: 3.0vw;
    line-height: 3.4vw;
  }

  &.alpha {
    .title {
      background: #fff;
    }

    .text {
      color: #fff;
    }
  }
}
</style>
