<template>
  <q-item clickable :active="active" active-class="bg-purple-1">
    <q-item-section avatar>
      <q-avatar :color="color" text-color="white">
        {{ nr }}
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label class="title">
        {{ song.title }}
      </q-item-label>
      <q-item-label caption :lines="1">
        {{ song.text }}
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <div class="text-grey-8 q-gutter-xs">
        <q-btn class="gt-xs" size="12px" flat dense round icon="edit" @click.stop="$emit('edit')">
          <q-tooltip>Lied bewerken</q-tooltip>
        </q-btn>
        <q-btn class="gt-xs" size="12px" flat dense round icon="clear" @click.stop="$emit('remove')">
          <q-tooltip>Lied verwijderen uit deze dienst</q-tooltip>
        </q-btn>
      </div>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  props: {
    song: Object,
    active: Boolean,
    nr: Number,
    color: String
  },
  emits: ['edit', 'remove']
}
</script>

<style scoped>
.q-item {
  user-select: none;
  cursor: default !important;
}
</style>
