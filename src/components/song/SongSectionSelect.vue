<template>
  <q-list v-for="(section, sectionIndex) in sections" :key="sectionIndex" @click="selectSection(section)">
    <q-item v-for="(lines, linesIndex) in section" :key="linesIndex" clickable @click="selectLines(lines)">
      <q-item-section>
        <div v-for="(line, i) in lines" :key="i">
          {{ line }}
        </div>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
export default {
  props: {
    sections: Array
  },
  emits: ['selectSection', 'selectLines'],
  methods: {
    selectSection (section) {
      this.$emit('selectSection', section.flat())
    },
    selectLines (lines) {
      this.$emit('selectLines', lines)
    }
  }
}
</script>

<style scoped lang="scss">
.q-list {
  border-bottom: $layout-border;
}
</style>
