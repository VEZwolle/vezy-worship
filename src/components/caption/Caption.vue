<template>
  <div class="caption" :class="{ alpha }">
    <div class="title">
      {{ title }}
    </div>

    <div class="text" v-html="text" />
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    text: String,
    alpha: Boolean
  }
}
</script>

<style scoped lang="scss">
.caption {
  .title {
    transform: translate(2rem, 50%);
    background: $primary;
    color: #fff;
    padding: 0.3rem 5rem 0.3rem 1rem;
    z-index: 10;
    font-size: 1.3rem;
    width: max-content;
    min-width: 15rem;
  }

  .text {
    background: #fff;
    padding: 2rem 1.5rem 1.5rem 2rem;
    font-size: 1.7rem;
    width: max-content;
    min-width: 30rem;
    max-width: 100%;
    line-height: 2.2rem;
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
