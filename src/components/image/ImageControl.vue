<template>
  <div class="q-pa-md row">
    <div class="width50">
      Beamer<br>
      <img :src="settings.beamer.fileUrl" class="full-width">
    </div>
    <div class="width50">
      Livestream<br>
      <img :src="settings.livestream.fileUrl" class="full-width">
    </div>
  </div>
</template>

<script>
import BaseControl from '../presentation/BaseControl.vue'

export default {
  extends: BaseControl
}
</script>

<style scope>
.width50 {
  width: 50%;
}
</style>
