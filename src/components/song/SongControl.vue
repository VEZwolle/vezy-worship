<template>
  <q-list v-for="(section, sectionIndex) in presentation.sections" :key="sectionIndex" class="q-py-sm">
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

    this.presentation.sections = splitSong(this.presentation.settings.text)
  },
  methods: {
    select (sectionIndex, slideIndex) {
      this.presentation.selectedSectionIndex = sectionIndex
      this.presentation.selectedSlideIndex = slideIndex
    },
    goLive () {
      this.store.goLive(this.presentation)
    },
    isSelected (sectionIndex, slideIndex) {
      return sectionIndex === this.presentation.selectedSectionIndex &&
        slideIndex === this.presentation.selectedSlideIndex
    }
  }
}

const labels = [
  { key: 'verse', color: 'blue' },
  { key: 'couplet', color: 'blue' },
  { key: 'chorus', color: 'purple' },
  { key: 'refrein', color: 'purple' },
  { key: 'bridge', color: 'green' },
  { key: 'tag', color: 'deep-purple' },
  { key: 'end', color: 'red-10' },
  { key: 'eind', color: 'red-10' }
]

function splitSong (text) {
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

      result.slides = chunk(lines, 2)

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
