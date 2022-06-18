<template>
  <q-list
    v-for="(section, sectionIndex) in presentation.sections"
    :key="sectionIndex"
    v-shortkey="{ up: ['arrowup'], down: ['arrowdown'], left: ['arrowleft'], right: ['arrowright'] }"
    class="q-py-sm"
    @shortkey="handleArrow"
  >
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
import useServiceStore from 'stores/service'
import chunk from 'lodash/chunk'

export default {
  extends: BaseControl,
  setup () {
    const store = useServiceStore()
    return { store }
  },
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
    select (sectionIndex = null, slideIndex = null) {
      if (sectionIndex !== null) {
        this.presentation.selectedSectionIndex = sectionIndex
      }

      if (slideIndex !== null) {
        this.presentation.selectedSlideIndex = slideIndex
      }
    },
    jump (change = +1) {
      const selectedSection = this.presentation.sections[this.presentation.selectedSectionIndex]
      let newSlideIndex = this.presentation.selectedSlideIndex + change

      if (selectedSection.slides[newSlideIndex]) {
        // Slide is in current section, so stay on current section
        return this.select(null, newSlideIndex)
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

      this.select(newSectionIndex, newSlideIndex)
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
      this.store.goLive(this.presentation)

      if (!this.preview) {
        this.store.unclear()
      }
    },
    isSelected (sectionIndex, slideIndex) {
      return sectionIndex === this.presentation.selectedSectionIndex &&
        slideIndex === this.presentation.selectedSlideIndex
    }
  }
}

const labels = [
  { key: 'verse', color: 'blue' },
  { key: 'vers', color: 'blue' },
  { key: 'couplet', color: 'blue' },
  { key: 'chorus', color: 'purple' },
  { key: 'refrein', color: 'purple' },
  { key: 'bridge', color: 'green' },
  { key: 'tag', color: 'deep-purple' },
  { key: 'end', color: 'red-10' },
  { key: 'eind', color: 'red-10' }
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
