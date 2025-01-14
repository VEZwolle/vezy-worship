<template>
  <div class="output" :style="style">
    <Transition
      :name="lastItemBG ? 'vezy-fadeinout' : 'q-transition--fade'"
      appear
      @after-enter="setLastBg"
    >
      <component :is="outputComponent" v-if="outputComponent" :key="presentationId" :clear="isClear" :alpha="alpha" :presentation="presentation" :muted="muted" />
    </Transition>
  </div>

  <MessageOutput v-if="showMessages" />
</template>

<script>
import { defineComponent } from 'vue'
import presentationTypes from '../presentation-types.js'
import MessageOutput from '../message/MessageOutput.vue'
import { replaceBackgroundUrl } from '../presets-settings.js'
import BgPng from '../../assets/bg.png'

export default defineComponent({
  name: 'OutputView',
  components: { MessageOutput },
  props: {
    id: String,
    preview: Boolean,
    alpha: Boolean,
    showBackground: Boolean,
    showMessages: Boolean,
    muted: Boolean
  },
  data () {
    return {
      backgroundColor: {
        beamer: '',
        livestream: ''
      },
      lastItemBG: false
    }
  },
  computed: {
    presentation () {
      return this.preview
        ? this.$store.previewPresentation
        : this.$store.livePresentation
    },
    presentationId () {
      return this.preview
        ? this.$store.previewPresentationId // this.presentation.id
        : this.$store.livePresentationId
    },
    presentationType () {
      return presentationTypes.find(t => t.id === this.presentation?.type)
    },
    outputComponent () {
      return this.presentationType?.outputs?.[this.id]
    },
    backgroundImageUrl () {
      return this.$store.getMediaUrl(this.$store.service?.backgroundImageId)
    },
    isClear () {
      return this.preview
        ? false
        : this.$store.isClear || (this.id === 'livestream' ? this.$store.isOnlyLivestreamClear : false)
    },
    style () {
      const style = {}

      if (this.showBackground) {
        if (this.backgroundColor.beamer && !this.backgroundImageUrl) {
          if (this.alpha) {
            style.backgroundColor = '#000'
          } else {
            style.backgroundColor = this.backgroundColor.beamer || '#000'
          }
        } else {
          const image = this.backgroundImageUrl || replaceBackgroundUrl || BgPng
          style.backgroundImage = `url(${image})`
          if (this.alpha) {
            style.filter = 'brightness(0) invert(1)'
          }
        }
      } else if (this.id === 'livestream' && !this.alpha && this.backgroundColor.livestream) {
        style.backgroundColor = this.backgroundColor.livestream
      }

      return style
    }
  },
  created () {
    this.$store.$subscribe((mutation, state) => {
      const subTime = Date.now()
      console.log(`${subTime} | MutationType: "${mutation.type}" | Store: ${mutation.storeId}`)
      console.log(state)
    })
  },
  mounted () {
    this.backgroundColor.beamer = localStorage.getItem('backgroundColor.beamer') || ''
    this.backgroundColor.livestream = localStorage.getItem('backgroundColor.livestream') || ''
  },
  methods: {
    setLastBg () {
      if (this.showBackground) {
        if (this.presentation.settings?.bgFileId) {
          if (!this.backgroundColor.beamer) {
            this.lastItemBG = true
            return
          }
        }
      }
      this.lastItemBG = false
    }
  }
})
</script>

<style>
.output {
  user-select: none;
  position: relative;
  width: 100vw;
  height: 100vh;
  cursor: none;
  background-color: #000;
  background-size: cover;
  background-position: center;
}
</style>
