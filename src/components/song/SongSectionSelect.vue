<template>
  <q-list v-for="(section, sectionIndex) in sections" :key="sectionIndex">
    <q-item
      v-for="(slide, slideIndex) in section"
      :key="slideIndex"
      clickable
      :active="isSelected(sectionIndex, slideIndex)"
      active-class="bg-blue-1"
      @click="select(sectionIndex, slideIndex)"
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
  emits: ['select'],
  methods: {
    select (sectionIndex, slideIndex) {
      this.$emit('select', sectionIndex, slideIndex)
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
}
</style>
