<template>
  <div class="line">
    <TextSlidesOutput v-if="presentation.settings.text && control.sections" :presentation="presentation" :preview="preview" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import BaseOutputStage from '../output/BaseOutputStage.vue'
import TextSlidesOutput from '../common/TextSlidesOutput.vue'

export default defineComponent({
  name: 'TextSlidesOutputStage',
  components: { TextSlidesOutput },
  extends: BaseOutputStage,
  mounted () {
    if (!this.preview && !this.settings.text) {
      // scroll to top
      window.scrollTo({ behavior: 'smooth', top: 0 })
    }
  }
})
</script>

<style scoped>
.line {
  font-size: 7vh;
  line-height: 10vh;
  width: 100vw;
}
</style>
