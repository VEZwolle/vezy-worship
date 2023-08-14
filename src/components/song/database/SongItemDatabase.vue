<template>
  <template v-if="!moreSongsFound">
    <q-item clickable :active="active" active-class="bg-purple-1" class="maxwidth" style="text-align: left;" @click="$emit('click')">
      <q-item-section avatar>
        <q-avatar :color="todoColor" text-color="white" :icon="todoIcon" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="title">
          <div v-html="titleDatabase" />
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
            <q-item-label class="title">
              <div v-html="titleDatabase" />
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
              <q-item-label class="title">
                <div v-html="titleDb(index)" />
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
    songTodoIndex: Number,
    active: Boolean
  },
  emits: ['click', 'setIndex'],
  computed: {
    todoIcon () {
      switch (this.songTodoIndex) {
        case -2: return 'block'
        case -1: return 'input'
        default: return 'wifi_protected_setup'
      }
    },
    todoColor () {
      switch (this.songTodoIndex) {
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
  max-width: max(25vw, min(480px, 40vw));
}
</style>
