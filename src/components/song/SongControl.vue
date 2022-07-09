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
        <div v-for="(line, i) in slide" :key="i">
          {{ line }}
        </div>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import BaseControl from '../presentation/BaseControl.vue'
import chunk from 'lodash/chunk'

export default {
  extends: BaseControl,
  created () {
    if (!this.presentation.selectedSectionIndex) {
      this.presentation.selectedSectionIndex = 0
    }

    if (!this.presentation.selectedSlideIndex) {
      this.presentation.selectedSlideIndex = 0
    }

    if (this.presentation.settings.translation) {
      // Use 1 line per slide
      this.presentation.sections = splitSong(this.presentation.settings.text, 1)
      this.presentation.translationSections = splitSong(this.presentation.settings.translation, 1)
    } else {
      // Use 2 lines per slide
      this.presentation.sections = splitSong(this.presentation.settings.text, 2)
    }
  },
  methods: {
    select (sectionIndex, slideIndex, scroll = false) {
      this.presentation.selectedSectionIndex = sectionIndex
      this.presentation.selectedSlideIndex = slideIndex

      if (scroll) {
        const el = this.$refs[`slide_${sectionIndex}_${slideIndex}`][0].$el
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
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

const labels = [
  { key: 'intro', color: 'deep-purple' },
  { key: 'introduction', color: 'deep-purple' },
  { key: 'verse', color: 'blue' },
  { key: 'vers', color: 'blue' },
  { key: 'couplet', color: 'blue' },
  { key: 'pre-chorus', color: 'purple' },
  { key: 'chorus', color: 'purple' },
  { key: 'refrein', color: 'purple' },
  { key: 'bridge', color: 'green' },
  { key: 'tag', color: 'deep-purple' },
  { key: 'tussenspel', color: 'deep-purple' },
  { key: 'interlude', color: 'deep-purple' },
  { key: 'misc', color: 'deep-purple' },
  { key: 'ending', color: 'red-10' },
  { key: 'end', color: 'red-10' },
  { key: 'eind', color: 'red-10' },
  { key: 'outro', color: 'red-10' },
  { key: 'slide', color: 'blue' },
  { key: 'vamp', color: 'blue' },
  { key: 'other', color: 'blue' },
  { key: 'scripture', color: 'red-10' }
]

function splitSong (text, linesPerSlide) {
  if (!text) return []

  return text
    .replace(/\r?\n/g, '<br>')
    .split('<br><br>')
    .map((section) => {
      const result = {
        label: null,
        slides: []
      }

      const lines = section.split('<br>')

      for (const label of labels) {
        if (!lines[0]?.toLowerCase().startsWith(label.key)) {
          continue
        }

        result.label = { ...label, value: lines[0] }
        lines.shift()
        break
      }

      result.slides = chunk(lines, linesPerSlide)

      return result
    })
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
