<template>
  <div class="caption" :class="{ alpha }">
    <Transition appear name="q-transition--jump-right">
      <div class="text" v-html="text" />
    </Transition>

    <Transition appear name="q-transition--jump-left">
      <div class="title">
        {{ title }}
      </div>
    </Transition>
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
  position: relative;

  .title {
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(2rem, -50%);
    background: $primary;
    color: #fff;
    padding: 0.3rem 5rem 0.3rem 1rem;
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
