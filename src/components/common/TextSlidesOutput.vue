<template>
  <q-list
    v-for="(section, sectionIndex) in presentation.sections"
    :key="sectionIndex"
    class="q-py-sm"
  >
    <q-item
      v-if="section.label"
      :class="`section-label text-${section.label.color}`"
      :active="isSelectedLabel(sectionIndex)"
      active-class="text-bold"
    >
      <q-item-section>
        <q-item-label>{{ section.label.value }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-item
      v-for="(slide, slideIndex) in section.slides"
      :key="slideIndex"
      :ref="`slide_${sectionIndex}_${slideIndex}`"
      :active="isSelected(sectionIndex, slideIndex)"
      active-class="text-bold text-white"
    >
      <q-item-section>
        <div v-for="(line, i) in slide" :key="i" class="section-line" v-html="line" />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import BaseOutputStage from '../output/BaseOutputStage.vue'

export default {
  extends: BaseOutputStage,
  watch: {
    'presentation.selectedSectionIndex' (val) {
      this.scroll()
    },
    'presentation.selectedSlideIndex' (val) {
      this.scroll()
    }
  },
  mounted () {
    this.scroll()
  },
  methods: {
    scroll () {
      if (!this.preview) {
        const el = this.$refs[`slide_${this.presentation.selectedSectionIndex}_${this.presentation.selectedSlideIndex}`][0].$el
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    },
    isSelected (sectionIndex, slideIndex) {
      return !this.preview &&
        sectionIndex === this.presentation.selectedSectionIndex &&
        slideIndex === this.presentation.selectedSlideIndex
    },
    isSelectedLabel (sectionIndex) {
      if (this.preview) return false
      const selectedIndex = this.presentation.selectedSectionIndex

      if (selectedIndex === sectionIndex) {
        return true
      }

      const nextLabelIndex = this.presentation.sections
        .findIndex((s, i) => i > sectionIndex && s.label !== null)

      if (nextLabelIndex === -1) { // No next labeled section found
        return selectedIndex >= sectionIndex
      }

      return selectedIndex >= sectionIndex &&
        selectedIndex < nextLabelIndex
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
  min-height: unset;
  padding: 1px 13px;

  .section-line {
    min-height: 0.2em;
  }
}

.section-label {
  font-size: 0.7em;
  line-height: 0.7em;
  color: gray;
  padding: 4px 13px;
  margin-top: -8px;
}
</style>
