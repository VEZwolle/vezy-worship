<template>
  <template v-if="!moreSongsFound">
    <q-item clickable :active="active" active-class="bg-purple-1" :style="styleWidth" style="text-align: left;" @click="$emit('click')">
      <q-item-section avatar>
        <q-avatar :color="todoColor" text-color="white" font-size="24px" :icon="todoIcon" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="title row">
          <div class="q-pr-md" v-text="titleDatabase" />
          <q-badge v-if="collectionNumberDatabase" color="secondary">
            {{ collectionNumberDatabase }}
          </q-badge>
          <q-space />
          <q-badge v-if="diffDatabase">
            {{ diffDatabase }}
          </q-badge>
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
        <q-item :active="active" active-class="bg-purple-1" :style="styleWidth" style="text-align: left;">
          <q-item-section avatar>
            <q-avatar :color="todoColor" text-color="white" font-size="14px" :icon="todoIcon" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="title row">
              <div class="q-pr-md" v-text="titleDatabase" />
              <q-badge v-if="collectionNumberDatabase" color="secondary">
                {{ collectionNumberDatabase }}
              </q-badge>
              <q-space />
              <q-badge v-if="diffDatabase">
                {{ diffDatabase }}
              </q-badge>
            </q-item-label>
            <q-item-label v-if="textDatabase" caption :lines="1">
              {{ $strip(textDatabase) }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>

      <q-list :style="styleWidth">
        <template v-for="(songDatabase, index) in songDatabases" :key="`sdb${index}`">
          <q-item v-close-popup clickable @click.stop="$emit('setIndex', index)">
            <q-item-section>
              <q-item-label class="title row">
                <div class="q-pr-md" v-text="titleDb(index)" />
                <q-badge v-if="dbCollectionNumber(index)" color="secondary">
                  {{ dbCollectionNumber(index) }}
                </q-badge>
                <q-space />
                <q-badge v-if="diffDb(index)">
                  {{ diffDb(index) }}
                </q-badge>
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
    active: Boolean,
    width: Number,
    icon: String
  },
  emits: ['click', 'setIndex'],
  computed: {
    todoIcon () {
      if (this.icon) return this.icon
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
      // place pulldown if not change but found.
      if (this.songDatabases?.length === 1 && this.noDb(this.songTodoIndex)) return true
      // change one found or non found
      return false
    },
    collectionNumberDatabase () {
      return this.dbCollectionNumber(this.songTodoIndex)
    },
    titleDatabase () {
      return this.titleDb(this.songTodoIndex)
    },
    textDatabase () {
      return this.textDb(this.songTodoIndex)
    },
    diffDatabase () {
      return this.diffDb(this.songTodoIndex)
    },
    styleWidth () {
      const style = {
        width: `${this.width - 40}px`
      }
      return style
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
      return this.songDatabases[index]?.title || ''
    },
    textDb (index) {
      if (this.noDb(index)) return ''
      return this.songDatabases[index]?.lyrics || ''
    },
    diffDb (index) {
      if (this.noDb(index)) return ''
      return `${this.songDiffs[index]?.text.factor100.toFixed(0)}% | ${this.songDiffs[index]?.translation.factor100.toFixed(0)}%`
    }
  }
}
</script>

<style scoped>
.q-item {
  user-select: none;
  cursor: default !important;
}
</style>
