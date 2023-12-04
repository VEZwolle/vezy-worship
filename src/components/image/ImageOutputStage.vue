<template>
  <div ref="outputStage" class="row q-gutter-md image">
    <div class="col">
      Beamer:<br>
      <OutputPreview :component="ImageOutputBeamer" :presentation="presentation" :bg-style="styleBeamer" />
    </div>
    <div class="col">
      <template v-if="!$store.noLivestream">
        Livestream:<br>
        <OutputPreview :component="ImageOutputLivestream" :presentation="presentation" :bg-style="styleLivestream" />
      </template>
    </div>
  </div>
</template>

<script>
import BaseOutputStage from '../output/BaseOutputStage.vue'
import OutputPreview from '../output/OutputPreview.vue'
import ImageOutputBeamer from './ImageOutputBeamer.vue'
import ImageOutputLivestream from './ImageOutputLivestream.vue'

export default {
  components: { OutputPreview },
  extends: BaseOutputStage,
  setup () {
    return { ImageOutputBeamer, ImageOutputLivestream }
  },
  computed: {
    styleBeamer () {
      const style = {}
      style.backgroundColor = '#1d1d1d'
      return style
    },
    styleLivestream () {
      const style = {}
      style.backgroundColor = '#1d1d1d'
      return style
    }
  },
  mounted () {
    if (!this.preview) this.$refs.outputStage.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}
</script>

<style scoped>
.image {
  margin-left: 7vw;
  width: 86vw;
}
</style>
