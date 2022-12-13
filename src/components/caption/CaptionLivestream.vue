<template>
  <div class="caption" :class="{ alpha }">
    <div class="title" v-html="title" />
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
    top: -1.8vw;
    left: 2vw;
    font-size: 1.8vw;
  }
  .text {
    background: #fff;
    min-width: 30vw;
    max-width: 100%;
    font-size: 2.2vw;
    line-height: 2.7vw;
    padding: 2vw 1.5vw 1.5vw 2vw;
  }
  .text-default {
    width: max-content;
  }
  .text-full {
    width: 100vw;
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
