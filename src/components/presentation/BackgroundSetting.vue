<template>
  <q-file v-model="background" accept="image/*" label="Selecteer achtergrondafbeelding" outlined @update:model-value="updateBackground">
    <template #prepend>
      <q-icon name="image" />
    </template>

    <template v-if="bgfileId" #append>
      <q-icon name="cancel" class="cursor-pointer" @click="resetBackground" />
    </template>
  </q-file>

  <img :src="backgroundUrl" class="q-mt-sm full-width">
</template>

<script>
export default {
  props: {
    bgfileId: String
  },
  emits: ['update:bgfileId'],
  data () {
    return {
      background: null
    }
  },
  computed: {
    backgroundUrl () {
      return this.$store.getMediaUrl(this.bgfileId || this.$store.service.backgroundImageId)
    }
  },
  methods: {
    updateBackground (file) {
      this.$emit('update:bgfileId', this.$store.addMedia(file))
    },
    resetBackground () {
      this.$emit('update:bgfileId', null)
      this.background = null
    }
  }
}

</script>
