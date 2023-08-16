<template>
  <template v-if="!moreSongsFound">
    <q-item clickable :active="active" active-class="bg-purple-1" class="maxwidth" style="text-align: left;" @click="$emit('click')">
      <q-item-section avatar>
        <q-avatar :color="todoColor" text-color="white" :icon="todoIcon" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="title row">
          <div v-html="titleDatabase" />
          <q-space />
          <div v-html="diffDatabase" />
        </q-item-label>
        <q-item-label v-if="textDatabase" caption :lines="1">
          {{ $strip(textDatabase) }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </template>
  <template v-if="moreSongsFound">
    <q-btn-dropdown
      split
      flat
      square
      unelevated
      padding="none"
      dense
      no-caps
      transition-hide
      @click="$emit('click')"
    >
      <template #label>
        <q-item :active="active" active-class="bg-purple-1" class="maxwidth" style="text-align: left;">
          <q-item-section avatar>
            <q-avatar :color="todoColor" text-color="white" :icon="todoIcon" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="title row">
              <div v-html="titleDatabase" />
              <q-space />
              <div v-html="diffDatabase" />
            </q-item-label>
            <q-item-label v-if="textDatabase" caption :lines="1">
              {{ $strip(textDatabase) }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>

      <q-list class="maxwidth">
        <template v-for="(songDatabase, index) in songDatabases" :key="`sdb${index}`">
          <q-item v-close-popup clickable @click.stop="$emit('setIndex', index)">
            <q-item-section>
              <q-item-label class="title row">
                <div v-html="titleDb(index)" />
                <q-space />
                <div v-html="diffDb(index)" />
              </q-item-label>
              <q-item-label v-if="textDb(index)" caption :lines="1">
                {{ $strip(textDb(index)) }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-btn-dropdown>
  </template>
</template>

<script>
export default {
  props: {
    songDatabases: Object,
    songDiffs: Object,
    songTodoIndex: Number,
    active: Boolean
  },
  emits: ['click', 'setIndex'],
  computed: {
    todoIcon () {
      switch (this.songTodoIndex) {
        case -3: // no add, exist in database
        case -2: return 'block' // no add
        case -1: return 'input' // add
        default: return 'wifi_protected_setup' // change index database
      }
    },
    todoColor () {
      switch (this.songTodoIndex) {
        case -3:
        case -2: return 'grey-4'
        case -1:
        default: return 'blue'
      }
    },
    moreSongsFound () {
      if (this.songDatabases?.length > 1) return true
      return false
    },
    titleDatabase () {
      return this.titleDb(this.songTodoIndex)
    },
    textDatabase () {
      return this.textDb(this.songTodoIndex)
    },
    diffDatabase () {
      return this.diffDb(this.songTodoIndex)
    }
  },
  methods: {
    log (text = '') {
      console.log(text)
    },
    noDb (index) {
      if (this.songDatabases) {
        if (index < 0) return true
        if (index >= this.songDatabases.length) return true
        if (this.songDatabases[index]?.title) return false
      }
      return true
    },
    dbCollectionNumber (index) {
      if (this.noDb(index)) return ''
      if (this.songDatabases[index]?.collection && this.songDatabases[index]?.number) { return `${this.songDatabases[index]?.collection} ${this.songDatabases[index]?.number}` }
      if (this.songDatabases[index]?.collection) { return this.songDatabases[index]?.collection }
      if (this.songDatabases[index]?.number) { return this.songDatabases[index]?.number }
      return ''
    },
    titleDb (index) {
      if (this.noDb(index)) return ''
      const CollectionNumber = this.dbCollectionNumber(index) ? ` | ${this.dbCollectionNumber(index)}` : ''
      return `${this.songDatabases[index]?.title}${CollectionNumber}`
    },
    textDb (index) {
      if (this.noDb(index)) return ''
      return this.songDatabases[index]?.lyrics || ''
    },
    diffDb (index) {
      if (this.noDb(index)) return ''
      return `+${this.songDiffs[index]?.text.ins} -${this.songDiffs[index]?.text.del}`
    }
  }
}
</script>

<style scoped>
.q-item {
  user-select: none;
  cursor: default !important;
}
.maxwidth {
  max-width: max(34vw, min(653px, 40vw));
}
</style>
