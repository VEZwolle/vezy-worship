<template>
  <q-list v-for="(section, sectionIndex) in sections" :key="sectionIndex" separator>
    <q-item v-for="(lines, linesIndex) in section" :key="linesIndex" clickable>
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
  }
}
</script>
