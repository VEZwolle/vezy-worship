<template>
  <div>
    <video :src="settings.url" muted class="full-width" />
  </div>
</template>

<script>
import BaseControl from '../presentation/BaseControl.vue'

export default {
  extends: BaseControl
}
</script>
