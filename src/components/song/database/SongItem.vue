<template>
  <q-item clickable :active="active" active-class="bg-purple-1">
    <q-item-section avatar>
      <q-avatar :color="todoColor" text-color="white" :icon="presentationType.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="title row">
        <div :class="todoTextClass" class="q-pr-md" v-html="title" />
        <q-badge v-if="collectionNumber" :color="todoLabelColor">
          {{ collectionNumber }}
        </q-badge>
      </q-item-label>
      <q-item-label v-if="text" caption :lines="1" :class="todoTextClass">
        {{ $strip(text) }}
      </q-item-label>
    </q-item-section>

    <q-item-section v-if="actions" side>
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

    <q-menu v-if="actions" context-menu no-focus>
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
        <q-item v-close-popup clickable @click.stop="$emit('edit')">
          <q-item-section>bewerken</q-item-section>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" size="28px" flat round icon="edit" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-item>
</template>

<script>
import presentationTypes from '../../presentation-types.js'

export default {
  props: {
    newSong: { type: Object, required: true },
    songTodoIndex: Number,
    active: Boolean,
    actions: Boolean
  },
  emits: ['add', 'change', 'remove', 'edit'],
  computed: {
    todoColor () {
      switch (this.songTodoIndex) {
        case -2: return 'grey-4'
        case -1:
        default: return 'blue'
      }
    },
    todoLabelColor () {
      switch (this.songTodoIndex) {
        case -2: return 'grey-4'
        case -1:
        default: return 'secondary'
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
      return this.newSong.settings.title
    },
    text () {
      return this.newSong.settings.text
    },
    collectionNumber () {
      if (this.newSong.settings.collection && this.newSong.settings.number) { return `${this.newSong.settings.collection} ${this.newSong.settings.number}` }
      if (this.newSong.settings.collection) { return this.newSong.settings.collection }
      if (this.newSong.settings.number) { return this.newSong.settings.number }
      return ''
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
