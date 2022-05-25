<template>
  <OutputPreview :sync-clear="!preview">
    <CaptionOutput :presentation="presentation" />
  </OutputPreview>
</template>

<script>
import BaseControl from '../presentation/BaseControl.vue'
import CaptionOutput from './CaptionOutput.vue'
import OutputPreview from '../output/OutputPreview.vue'

export default {
  components: { CaptionOutput, OutputPreview },
  extends: BaseControl
}
</script>
