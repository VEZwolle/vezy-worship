<template>
  <div class="q-pa-md">
    <video :src="settings.fileUrl" muted class="full-width" />
  </div>
</template>

<script>
import BaseControl from '../presentation/BaseControl.vue'

export default {
  extends: BaseControl
}
</script>
