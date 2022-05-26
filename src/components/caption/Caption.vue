<template>
  <div class="caption" :class="{ alpha }">
    <Transition appear name="q-transition--flip-up">
      <div class="text" v-html="text" />
    </Transition>

    <Transition appear name="q-transition--slide-up">
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
    top: -1.3vw;
    left: 2vw;
    background: $primary;
    color: #fff;
    padding: 0.3vw 5vw 0.3vw 1vw;
    font-size: 1.3vw;
    width: max-content;
    min-width: 15vw;
  }

  .text {
    background: #fff;
    padding: 2vw 1.5vw 1.5vw 2vw;
    font-size: 1.7vw;
    width: max-content;
    min-width: 30vw;
    max-width: 100%;
    line-height: 2.2vw;
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
