<template>
  <div>
    <video :src="settings.file_url" muted class="full-width" />
  </div>
</template>

<script>
import BaseControl from '../presentation/BaseControl.vue'

export default {
  extends: BaseControl
}
</script>
