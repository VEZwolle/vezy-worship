<template>
  <OutputPreview :component="CaptionOutput" :presentation="presentation" :clear="clear && !preview" />
</template>

<script>
import BaseControl from '../presentation/BaseControl.vue'
import CaptionOutput from './CaptionOutput.vue'
import OutputPreview from '../output/OutputPreview.vue'

export default {
  components: { OutputPreview },
  extends: BaseControl,
  setup () {
    return { CaptionOutput }
  }
}
</script>
