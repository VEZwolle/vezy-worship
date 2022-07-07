<template>
  <div class="q-pa-md row">
    <div class="width50">
      Beamer<br>
      <ImagePreview :id="'beamer'" :scale="scale" :presentation="presentation" />
    </div>
    <div class="width50">
      Livestream<br>
      <ImagePreview :id="'livestream'" :scale="scale" :presentation="presentation" />
    </div>
  </div>
</template>

<script>
import BaseControl from '../presentation/BaseControl.vue'
import ImagePreview from './ImagePreview.vue'

export default {
  components: { ImagePreview },
  extends: BaseControl,
  data () {
    return {
      scale: 0
    }
  },
  mounted () { // toekomst nog aanpassen aan output formaten
    this.scale = ((this.$el.offsetWidth * 0.5) - 40) / 1920
  }
}
</script>

<style scope>
.width50 {
  width: 50%;
}
</style>
