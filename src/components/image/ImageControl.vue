<template>
  <div class="q-pa-md">
    <img :src="settings.fileUrl" class="full-width">
  </div>
</template>

<script>
import BaseControl from '../presentation/BaseControl.vue'

export default {
  extends: BaseControl
}
</script>
