<template>
  <q-item v-ripple class="q-my-sm" clickable :active="active" active-class="bg-purple-1">
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
  </q-item>
</template>

<script>
export default {
  props: {
    song: Object,
    active: Boolean,
    nr: Number,
    color: String
  }
}
</script>
