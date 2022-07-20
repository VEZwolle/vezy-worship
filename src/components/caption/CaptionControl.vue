<template>
  <q-list>
    <q-item
      clickable
      class="bg-primary text-white"
      :active="true"
      active-class="text-bold"
      @dblclick="goLive"
    >
      <q-item-section>
        <q-item-label>{{ settings.title }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-item
      clickable
      :active="true"
      :active-class="!preview ? 'bg-secondary text-white' : null"
      @dblclick="goLive"
    >
      <q-item-section v-html="settings.text" />
    </q-item>
  </q-list>
</template>

<script>
import BaseControl from '../presentation/BaseControl.vue'

export default {
  extends: BaseControl
}
</script>

<style scoped>
.q-item {
  transition: none;
  user-select: none;
  cursor: default !important;
  min-height: unset;
  padding: 6px 13px;
}
</style>
