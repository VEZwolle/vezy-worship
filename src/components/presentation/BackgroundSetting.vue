<template>
  <q-file v-model="background" accept="image/*" label="Selecteer eventueel een afwijkende achtergrondafbeelding (beamer)" outlined @update:model-value="updateBackground">
    <template #prepend>
      <q-icon name="image" />
    </template>

    <template v-if="bgFileId" #append>
      <q-icon name="cancel" class="cursor-pointer" @click="resetBackground" />
    </template>
  </q-file>
  <div class="q-mt-sm preview">
    <q-responsive :ratio="ratio" class="output-preview">
      <div class="bg-output-beamer" :style="style">
        <div class="full" :style="styleOpacity" />
      </div>
    </q-responsive>
    <div class="slider">
      <q-slider
        v-model="opacity"
        :min="0"
        :max="1"
        :step="0.05"
        label
        :label-value="'Donkerder: ' + (opacity * 100).toFixed(0) + '%'"
        label-always
        switch-label-side
        @update:model-value="updateOpacity"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    bgFileId: String,
    bgOpacity: {
      type: Number,
      default: 0
    }
  },
  emits: [
    'update:bgFileId',
    'update:bgOpacity'
  ],
  data () {
    return {
      background: null,
      opacity: this.bgOpacity
    }
  },
  computed: {
    backgroundUrl () {
      return this.$store.getMediaUrl(this.bgFileId || this.$store.service.backgroundImageId)
    },
    backgroundColorBeamer () {
      return localStorage.getItem('backgroundColor.beamer') || ''
    },
    style () {
      const style = {}

      if (this.backgroundColorBeamer && !this.backgroundUrl) {
        style.backgroundColor = this.backgroundColorBeamer || '#000'
      } else {
        const image = this.backgroundUrl || require('../../assets/bg.png')
        style.backgroundImage = `url(${image})`
      }

      return style
    },
    styleOpacity () {
      const style = {}
      if (this.opacity) {
        style.background = `rgba(0, 0, 0, ${this.opacity})`
      }
      return style
    },
    ratio () {
      return this.$store.outputRatio
    }
  },
  methods: {
    updateOpacity () {
      this.$emit('update:bgOpacity', this.opacity)
    },
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

<style scoped>
.preview {
  width: 70%;
}

.output-preview {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.bg-output-beamer {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.full {
  width: 100%;
  height: 100%;
}

.slider {
  height: 6vh;
  padding: 0 2vw 0 2vw;
}
</style>
