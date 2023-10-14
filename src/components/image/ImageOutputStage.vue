<template>
  <div class="row q-gutter-md image">
    <div class="col">
      Beamer:<br>
      <OutputPreview :component="ImageOutputBeamer" :presentation="presentation" />
    </div>
    <div class="col">
      Livestream:<br>
      <OutputPreview :component="ImageOutputLivestream" :presentation="presentation" />
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
  }
}
</script>

<style scoped>
.image {
  margin-left: 15vw;
  width: 70vw;
}
</style>
