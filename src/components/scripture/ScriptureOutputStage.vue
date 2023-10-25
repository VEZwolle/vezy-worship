<template>
  <div class="line">
    <TextSlidesOutput v-if="presentation.sections" :presentation="presentation" :preview="preview" />
  </div>
</template>

<script>
import BaseOutputStage from '../output/BaseOutputStage.vue'
import TextSlidesOutput from '../common/TextSlidesOutput.vue'

export default {
  components: { TextSlidesOutput },
  extends: BaseOutputStage
}
</script>

<style scoped>
.line {
  font-size: 7vh;
  line-height: 10vh;
  width: 100vw;
}
</style>
