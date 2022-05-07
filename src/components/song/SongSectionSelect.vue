<template>
  <q-list v-for="(section, sectionIndex) in sections" :key="sectionIndex" class="q-py-sm">
    <q-item v-if="section.label" :class="`section-label text-white bg-${section.label.color}`">
      <q-item-section>
        <q-item-label>{{ section.label.value }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-item
      v-for="(slide, slideIndex) in section.slides"
      :key="slideIndex"
      clickable
      :active="isSelected(sectionIndex, slideIndex)"
      active-class="bg-secondary text-white"
      @click="select(sectionIndex, slideIndex)"
      @dblclick="dblclick(sectionIndex, slideIndex)"
    >
      <q-item-section>
        <div v-for="(line, i) in slide" :key="i">
          {{ line }}
        </div>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
export default {
  props: {
    sections: Array,
    selectedSectionIndex: Number,
    selectedSlideIndex: Number
  },
  emits: ['select', 'dblclick'],
  methods: {
    select (sectionIndex, slideIndex) {
      this.$emit('select', sectionIndex, slideIndex)
    },
    dblclick (sectionIndex, slideIndex) {
      this.$emit('dblclick', sectionIndex, slideIndex)
    },
    isSelected (sectionIndex, slideIndex) {
      return sectionIndex === this.selectedSectionIndex &&
        slideIndex === this.selectedSlideIndex
    }
  }
}
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
}

.section-label {
  padding: 4px 13px;
  margin-top: -8px;
}
</style>
