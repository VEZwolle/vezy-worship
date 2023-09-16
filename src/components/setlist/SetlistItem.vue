<template>
  <q-item clickable :active="active" active-class="bg-purple-1">
    <q-item-section avatar>
      <q-avatar :color="presentationType.color" text-color="white" :icon="presentationType.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="title">
        <div v-html="title" />
      </q-item-label>
      <q-item-label v-if="description" caption :lines="1">
        {{ $strip(description) }}
      </q-item-label>
    </q-item-section>

    <q-item-section side class="setlist-actions">
      <div class="text-grey-8 q-gutter-xs">
        <q-btn class="gt-xs" size="12px" flat dense round icon="edit" @click.stop="$emit('edit')">
          <q-tooltip>{{ presentationType.name }} bewerken</q-tooltip>
        </q-btn>
        <q-btn class="gt-xs" size="12px" flat dense round icon="clear" @click.stop="$emit('remove')">
          <q-tooltip>{{ presentationType.name }} verwijderen uit deze dienst</q-tooltip>
        </q-btn>
      </div>
    </q-item-section>

    <q-menu context-menu no-focus>
      <q-list dense style="min-width: 100px">
        <q-item v-close-popup clickable @click.stop="$emit('preview')">
          <q-item-section>Preview</q-item-section>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" size="28px" flat round icon="search" />
          </q-item-section>
        </q-item>
        <q-item v-close-popup clickable @click.stop="$emit('goLive')">
          <q-item-section>Go Live</q-item-section>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" size="28px" flat round icon="arrow_forward" />
          </q-item-section>
        </q-item>
        <q-item v-close-popup clickable @click.stop="$emit('edit')">
          <q-item-section>Bewerken</q-item-section>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" size="28px" flat round icon="edit" />
          </q-item-section>
        </q-item>
        <q-item v-close-popup clickable @click.stop="$emit('remove')">
          <q-item-section>Verwijderen</q-item-section>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" size="28px" flat round icon="clear" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-item>
</template>

<script>
import presentationTypes from '../presentation-types'

export default {
  props: {
    presentation: Object,
    active: Boolean
  },
  emits: ['edit', 'remove', 'preview', 'goLive'],
  computed: {
    presentationType () {
      return presentationTypes.find(t => t.id === this.presentation.type)
    },
    title () {
      if (this.presentation.type === 'song') {
        return this.presentationType.title(this.presentation.settings)
      }

      if (this.presentation.settings.title) {
        return this.presentation.settings.title
      }

      if (this.presentationType.title) {
        return this.presentationType.title(this.presentation.settings)
      }

      return this.presentationType.name
    },
    description () {
      if (!this.presentationType.description) {
        return
      }

      return this.presentationType.description(this.presentation.settings)
    }
  }
}
</script>

<style scoped>
.q-item {
  user-select: none;
  cursor: default !important;
}

.setlist-actions {
  opacity: 0;
  transition: opacity 0.2s;
}
.q-item:hover .setlist-actions {
  opacity: 1;
}
</style>
