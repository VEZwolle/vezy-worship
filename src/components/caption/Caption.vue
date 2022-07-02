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
    alpha: Boolean,
    outputvw: {
      type: Number,
      default: 1
    }
  },
  computed: {
    csscaption () {
      return {
        title: {
          top: (-1.3 * this.outputvw) + 'px',
          left: (2 * this.outputvw) + 'px',
          padding: (0.3 * this.outputvw) + 'px ' + (5 * this.outputvw) + 'px ' + (0.3 * this.outputvw) + 'px ' + (1 * this.outputvw) + 'px',
          fontsize: (1.3 * this.outputvw) + 'px',
          minwidth: (15 * this.outputvw) + 'px'
        },
        text: {
          padding: (2 * this.outputvw) + 'px ' + (1.5 * this.outputvw) + 'px ' + (1.5 * this.outputvw) + 'px ' + (2 * this.outputvw) + 'px',
          fontsize: (1.7 * this.outputvw) + 'px',
          minwidth: (30 * this.outputvw) + 'px',
          lineheight: (2.2 * this.outputvw) + 'px'
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.caption {
  position: relative;

  .title {
    position: absolute;
    top: v-bind('csscaption.title.top');
    left: v-bind('csscaption.title.left');
    background: $primary;
    color: #fff;
    padding: v-bind('csscaption.title.padding');
    font-size: v-bind('csscaption.title.fontsize');
    width: max-content;
    min-width: v-bind('csscaption.title.minwidth');
  }

  .text {
    background: #fff;
    padding: v-bind('csscaption.text.padding');
    font-size: v-bind('csscaption.text.fontsize');
    width: max-content;
    min-width: v-bind('csscaption.text.minwidth');
    max-width: 100%;
    line-height: v-bind('csscaption.text.lineheight');
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
