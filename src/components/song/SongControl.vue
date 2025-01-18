<template>
  <TextSlidesControl v-if="presentation.settings.text" :presentation="presentation" :preview="preview" />
  <div
    v-else
    v-shortkey="shortkeysNextBack"
    @shortkey="baseHandleArrow"
    @click="setHandleArrowLocation"
  />
</template>

<script>
import { defineComponent } from 'vue'
import BaseControl from '../presentation/BaseControl.vue'
import TextSlidesControl from '../common/TextSlidesControl.vue'

export default defineComponent({
  name: 'SongControl',
  components: { TextSlidesControl },
  extends: BaseControl,
  created () {
    // create .control via store: preview/golive
  }
})

</script>
