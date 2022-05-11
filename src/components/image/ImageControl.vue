<template>
  <div>
    <img :src="settings.file_url" class="full-width">
  </div>
</template>

<script>
import BaseControl from '../presentation/BaseControl.vue'

export default {
  extends: BaseControl
}
</script>
