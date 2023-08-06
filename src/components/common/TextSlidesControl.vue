<template>
  <q-list
    v-for="(section, sectionIndex) in presentation.sections"
    :key="sectionIndex"
    v-shortkey="{ up: ['arrowup'], down: ['arrowdown'], left: ['arrowleft'], right: ['arrowright'] }"
    class="q-py-sm"
    @shortkey="handleArrow"
  >
    <q-item
      v-if="section.label"
      clickable
      :class="`section-label text-white bg-${section.label.color}`"
      :active="isSelectedLabel(sectionIndex)"
      active-class="text-bold"
      @click="select(sectionIndex, 0)"
      @dblclick="goLive"
    >
      <q-item-section>
        <q-item-label>{{ section.label.value }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-item
      v-for="(slide, slideIndex) in section.slides"
      :key="slideIndex"
      :ref="`slide_${sectionIndex}_${slideIndex}`"
      clickable
      :active="isSelected(sectionIndex, slideIndex)"
      :active-class="!preview ? 'bg-secondary text-white' : null"
      @click="select(sectionIndex, slideIndex)"
      @dblclick="goLive"
    >
      <q-item-section>
        <div v-for="(line, i) in slide" :key="i" class="section-line" v-html="line" />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import BaseControl from '../presentation/BaseControl.vue'

export default {
  extends: BaseControl,
  created () {
    if (!this.presentation.selectedSectionIndex) {
      this.presentation.selectedSectionIndex = 0
    }

    if (!this.presentation.selectedSlideIndex) {
      this.presentation.selectedSlideIndex = 0
    }
  },
  mounted () {
    this.select(this.presentation.selectedSectionIndex, this.presentation.selectedSlideIndex, true)
  },
  methods: {
    select (sectionIndex, slideIndex, scroll = false) {
      this.presentation.selectedSectionIndex = sectionIndex
      this.presentation.selectedSlideIndex = slideIndex

      if (scroll) {
        const el = this.$refs[`slide_${sectionIndex}_${slideIndex}`][0].$el
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    },
    jump (change = +1) {
      const selectedSection = this.presentation.sections[this.presentation.selectedSectionIndex]
      let newSlideIndex = this.presentation.selectedSlideIndex + change

      if (selectedSection.slides[newSlideIndex]) {
        // Slide is in current section, so stay on `selectedSectionIndex`
        return this.select(this.presentation.selectedSectionIndex, newSlideIndex, true)
      }

      const newSectionIndex = this.presentation.selectedSectionIndex + change
      const section = this.presentation.sections[newSectionIndex]

      if (!section) {
        return
      }

      // Select last or first slide of section, based on going up (-1) or down (+1)
      newSlideIndex = (change === -1)
        ? section.slides.length - 1 // Going up, select last slide
        : 0 // Going down, select first slide

      this.select(newSectionIndex, newSlideIndex, true)
    },
    handleArrow (event) {
      switch (event.srcKey) {
        case 'up':
        case 'left':
          return this.jump(-1)
        case 'down':
        case 'right':
          return this.jump(+1)
      }
    },
    goLive () {
      this.$store.goLive(this.presentation)

      if (!this.preview) {
        this.$store.unclear()
      }
    },
    isSelected (sectionIndex, slideIndex) {
      return sectionIndex === this.presentation.selectedSectionIndex &&
        slideIndex === this.presentation.selectedSlideIndex
    },
    isSelectedLabel (sectionIndex) {
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
  cursor: default !important;
  min-height: unset;
  padding: 1px 13px;

  .section-line {
    min-height: 0.7em;
  }
}

.section-label {
  padding: 4px 13px;
  margin-top: -8px;
}
</style>
