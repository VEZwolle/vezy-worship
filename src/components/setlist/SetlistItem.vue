<template>
  <q-item clickable :active="active" active-class="bg-purple-1">
    <q-item-section avatar>
      <q-avatar :color="presentationType.color" text-color="white" :icon="presentationType.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="title">
        {{ presentation.settings.title }}
      </q-item-label>
      <q-item-label v-if="description" caption :lines="1">
        {{ description }}
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <div class="text-grey-8 q-gutter-xs">
        <q-btn class="gt-xs" size="12px" flat dense round icon="edit" @click.stop="$emit('edit')">
          <q-tooltip>{{ presentationType.name }} bewerken</q-tooltip>
        </q-btn>
        <q-btn class="gt-xs" size="12px" flat dense round icon="clear" @click.stop="$emit('remove')">
          <q-tooltip>{{ presentationType.name }} verwijderen uit deze dienst</q-tooltip>
        </q-btn>
      </div>
    </q-item-section>
  </q-item>
</template>

<script>
import presentationTypes from '../presentation-types'

export default {
  props: {
    presentation: Object,
    active: Boolean
  },
  emits: ['edit', 'remove'],
  computed: {
    presentationType () {
      return presentationTypes.find(t => t.id === this.presentation.type)
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
</style>
