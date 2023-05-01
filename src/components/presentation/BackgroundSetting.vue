<template>
  <q-file v-model="background" accept="image/*" label="Selecteer eventueel een afwijkende achtergrondafbeelding (beamer)" outlined @update:model-value="updateBackground">
    <template #prepend>
      <q-icon name="image" />
    </template>

    <template v-if="bgFileId" #append>
      <q-icon name="cancel" class="cursor-pointer" @click="resetBackground" />
    </template>
  </q-file>

  <img :src="backgroundUrl" class="q-mt-sm full-width">
</template>

<script>
export default {
  props: {
    bgFileId: String
  },
  emits: ['update:bgFileId'],
  data () {
    return {
      background: null
    }
  },
  computed: {
    backgroundUrl () {
      return this.$store.getMediaUrl(this.bgFileId || this.$store.service.backgroundImageId)
    }
  },
  methods: {
    updateBackground (file) {
      this.$emit('update:bgFileId', this.$store.addMedia(file))
    },
    resetBackground () {
      this.$emit('update:bgFileId', null)
      this.background = null
    }
  }
}

</script>
