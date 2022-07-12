<template>
  <q-responsive :ratio="16 / 9" class="output-box">
    <iframe :src="outputUrl" />
  </q-responsive>
</template>

<script>
export default {
  props: {
    outputId: String,
    preview: Boolean,
    alpha: Boolean,
    showBackground: Boolean
  },
  computed: {
    outputUrl () {
      let url = `/#/output/${this.outputId}?params`

      if (this.preview) url += '&preview'
      if (this.alpha) url += '&alpha'
      if (this.showBackground) url += '&showBackground'

      return url
    }
  }
}
</script>

<style scoped lang="scss">
.output-box {
  width: 100%;
  margin-right: 5px;

  &:last-child {
    margin-right: 0;
  }
}

iframe {
  border: none;
}
</style>
