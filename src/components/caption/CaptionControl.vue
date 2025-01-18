<template>
  <TextSlidesControl v-if="presentation.settings.text" :presentation="presentation" :preview="preview" />
  <div
    v-else
    v-shortkey="shortkeysNextBack"
    @shortkey="baseHandleArrow"
    @click="setHandleArrowLocation"
  >
    <q-list class="q-py-sm">
      <q-item>
        <q-item-section>
          <div class="section-line" v-html="presentation.settings.title" />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import BaseControl from '../presentation/BaseControl.vue'
import TextSlidesControl from '../common/TextSlidesControl.vue'

export default defineComponent({
  name: 'CaptionControl',
  components: { TextSlidesControl },
  extends: BaseControl,

  created () {
    // create .control via store: preview/golive
  }
})
</script>

<style scoped lang="scss">
.q-list {
  border-bottom: $layout-border;
}

.q-item {
  transition: none;
  user-select: none;
  cursor: default !important;
  min-height: unset;
  padding: 1px 13px;

  .section-line {
    min-height: 0.7em;
  }
}
</style>
