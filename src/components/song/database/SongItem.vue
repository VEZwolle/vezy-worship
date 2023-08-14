<template>
  <q-item clickable :active="active" active-class="bg-purple-1">
    <q-item-section avatar>
      <q-avatar :color="todoColor" text-color="white" :icon="presentationType.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="title">
        <div :class="todoTextClass" v-html="title" />
      </q-item-label>
      <q-item-label v-if="text" caption :lines="1" :class="todoTextClass">
        {{ $strip(text) }}
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <div class="text-grey-8 q-gutter-xs">
        <q-btn class="gt-xs" size="12px" flat dense round icon="input" @click.stop="$emit('add')">
          <q-tooltip>{{ presentationType.name }} toevoegen aan database</q-tooltip>
        </q-btn>
        <q-btn class="gt-xs" size="12px" flat dense round icon="wifi_protected_setup" @click.stop="$emit('change')">
          <q-tooltip>{{ presentationType.name }} vervang in database</q-tooltip>
        </q-btn>
        <q-btn class="gt-xs" size="12px" flat dense round icon="block" @click.stop="$emit('remove')">
          <q-tooltip>{{ presentationType.name }} niet toevoegen aan database</q-tooltip>
        </q-btn>
      </div>
    </q-item-section>

    <q-menu context-menu no-focus>
      <q-list dense style="min-width: 100px">
        <q-item v-close-popup clickable @click.stop="$emit('add')">
          <q-item-section>toevoegen aan</q-item-section>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" size="28px" flat round icon="input" />
          </q-item-section>
        </q-item>
        <q-item v-close-popup clickable @click.stop="$emit('change')">
          <q-item-section>vervang in</q-item-section>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" size="28px" flat round icon="wifi_protected_setup" />
          </q-item-section>
        </q-item>
        <q-item v-close-popup clickable @click.stop="$emit('remove')">
          <q-item-section>niet toevoegen</q-item-section>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" size="28px" flat round icon="block" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-item>
</template>

<script>
import presentationTypes from '../../presentation-types'

export default {
  props: {
    newSong: { type: Object, required: true },
    songTodoIndex: Number,
    active: Boolean
  },
  emits: ['add', 'change', 'remove'],
  computed: {
    todoColor () {
      switch (this.songTodoIndex) {
        case -2: return 'grey-4'
        case -1:
        default: return 'blue'
      }
    },
    todoTextClass () {
      switch (this.songTodoIndex) {
        case -2: return 'text-grey-4'
        case -1:
        default: return ''
      }
    },
    presentationType () {
      return presentationTypes.find(t => t.id === this.newSong.type)
    },
    title () {
      return this.presentationType.title(this.newSong.settings)
    },
    text () {
      return this.newSong.settings.text
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.q-item {
  user-select: none;
  cursor: default !important;
}
</style>
