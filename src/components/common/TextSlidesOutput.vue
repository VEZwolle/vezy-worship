<template>
  <q-list
    v-for="(section, sectionIndex) in control.sections"
    :key="sectionIndex"
    class="q-py-xs"
  >
    <q-item
      v-if="section.label"
      :class="`section-label text-${section.label.color}`"
      :active="isSelectedLabel(sectionIndex)"
      active-class=""
    >
      <q-item-section>
        <q-item-label>{{ section.label.value }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-item
      v-for="(slide, slideIndex) in section.slides"
      :key="slideIndex"
      :ref="`slide_${sectionIndex}_${slideIndex}`"
      :active="isPastSelected(sectionIndex, slideIndex)"
      :active-class="isPastSelectedClass(isSelected(sectionIndex, slideIndex))"
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
    'control.selectedSectionIndex' (val) {
      this.scroll()
    },
    'control.selectedSlideIndex' (val) {
      this.scroll()
    }
  },
  mounted () {
    this.scroll()
  },
  methods: {
    scroll () {
      if (!this.preview) {
        const el = this.$refs[`slide_${this.control.selectedSectionIndex}_${this.control.selectedSlideIndex}`][0].$el
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },
    isPastSelected (sectionIndex, slideIndex) {
      return !this.preview &&
        (sectionIndex < this.control.selectedSectionIndex ||
          (sectionIndex === this.control.selectedSectionIndex &&
          slideIndex <= this.control.selectedSlideIndex)
        )
    },
    isSelected (sectionIndex, slideIndex) {
      return !this.preview &&
        sectionIndex === this.control.selectedSectionIndex &&
        slideIndex === this.control.selectedSlideIndex
    },
    isPastSelectedClass (past = false) {
      return past ? 'text-white' : 'text-gray'
    },
    isSelectedLabel (sectionIndex) {
      if (this.preview) return false
      const selectedIndex = this.control.selectedSectionIndex

      if (selectedIndex === sectionIndex) {
        return true
      }

      const nextLabelIndex = this.control.sections
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
  padding: 1px 0px;
  scroll-margin-block-start: 0;

  .section-line {
    min-height: 0.2em;
  }
}

.section-label {
  font-size: 0.7em;
  line-height: 0.7em;
  color: gray;
  padding: 4px 0px;
  margin-top: -8px;
}
</style>
