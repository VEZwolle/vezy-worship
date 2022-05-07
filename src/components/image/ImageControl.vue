<template>
  <div>
    <img :src="settings.url">
  </div>
</template>

<script>
import BaseControl from '../presentation/BaseControl.vue'

export default {
  extends: BaseControl
}
</script>
