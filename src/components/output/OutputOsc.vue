<template>
  <div>
    OSC: {{ $store.osc.enabled ? 'aan' : 'uit' }}
    <q-tooltip>
      Output teksten via het OSC-protocol naar:<br>
      {{ $store.osc.outAddress }} : {{ $store.osc.outPort }}
    </q-tooltip>
  </div>
</template>

<script>
// v-if="$store.osc.enabled"
import { defineComponent } from 'vue'
import * as osc from "osc-min"
import oscOutput from '../osc-output-settings.js'

export default defineComponent({
  name: 'OscSend',
  props: {
    presentation: Object,
    presentationTypeId: String,
    title: String,
    isClear: Boolean
  },
  data () {
    return {
    }
  },

  computed: {
    id () {
      return this.presentation?.id
    },
    settings () {
      return this.presentation?.settings
    },
    control () {
      return this.presentation?.control
    },
    oscOut () {
      return this.$store.osc.output
    },
    // song/caption selection
    selectedSectionIndex () {
      return this.control?.selectedSectionIndex ? this.control.selectedSectionIndex : 0
    },
    // song/caption text update?
    settingsText () {
      return this.settings?.text ? this.settings.text : ''
    },
    // countdown
    remaining () {
      return this.control?.remaining ? this.control.remaining : ''
    },
    isFinished () {
      return this.control?.isFinished ? this.control.isFinished : false
    },
    // song, caption, scripture
    lines () {
      if (!this.control) return []
      const section = this.control.sections?.[this.control.selectedSectionIndex]
      return section?.slides.flat() || []
    },
    // only song
    translatedLines () {
      if (!this.control) return []
      const section = this.control.translationSections?.[this.control.selectedSectionIndex]
      return section?.slides.flat() || []
    }
  },

  watch: {
    'id' () { // nieuwe presentation
      this.oscSendMsgTotal()
    },
    'isClear' () { // aan/uit presentation
      this.oscSendMsgTotal()
    },
    'title' () {
      this.oscSendMsgTotal()
    },
    'isFinished' () {
      this.oscSendMsgTotal()
    },
    'settingsText' () {
      this.oscSendMsgData()
    },
    'selectedSectionIndex' () {
      this.oscSendMsgData()
    },
    'remaining' () {
      this.oscSendMsgData()
    }
  },
  created () {
    console.log('OutputOsc created')
    // check $store.output is completely
    this.$store.$patch((state) => {
      for (var key in oscOutput) {
        if (!Object.prototype.hasOwnProperty.call(this.$store.osc.output, key)) {
          state.osc.output[key] = oscOutput[key]
        }
      }
    })
  },
  mounted () {
    this.$nextTick(() => { this.oscSendMsgTotal() })
  },
  methods: {
    oscSendMsgTotal () {
      if (!this.$store.osc.enabled || !this.$q.platform.is.electron) return

      let elements = []
      if (this.isClear) elements.push({ address: this.oscOut.clear })

      if (!this.presentation) return this.oscSendMsg(elements)

      switch (this.presentationTypeId) {
        case 'song':
          if (!this.isClear) elements.push({ address: this.oscOut.song, args: 1 })
          break
        case 'caption':
        case 'scripture':
          if (!this.isClear) {
            switch (this.settings?.formatBeamer) {
              case 'Standaard':
                elements.push({ address: this.oscOut.captionDefault, args: 1 })
                break
              case 'Bijbeltekst':
              case 'Alleen tekst':
                elements.push({ address: this.oscOut.captionScripture, args: 1 })
                break
              case 'Titel':
                elements.push({ address: this.oscOut.captionTitle, args: 1 })
                break
              case 'Thema':
                elements.push({ address: this.oscOut.captionThema, args: 1 })
                break
              case 'Geen':
                elements.push({ address: this.oscOut.clear })
                break
              default:
            }
          }
          break
        case 'countdown':
          if (!this.control?.isFinished) { // niet actief zetten wanneer finished
            if (!this.isClear ) elements.push({ address: this.oscOut.countdown, args: 1 })
          } else {
            elements.push({ address: this.oscOut.clear })
          }
          break
        case 'image':
          if (!this.isClear) {
            switch (this.id) {
              case 'offering':
                elements.push({ address: this.oscOut.imageOffering, args: 1 })
                break
              case 'ministry':
                elements.push({ address: this.oscOut.imageMinistry, args: 1 })
                break
              case 'end':
                elements.push({ address: this.oscOut.imageEnd, args: 1 })
                break
              default:
                elements.push({ address: this.oscOut.clear })
            }  
          }
          break
        case 'video':
          elements.push({ address: this.oscOut.clear })
          break
        default:
      }
      // add data
      this.oscSendMsgData(elements)
    },

    oscSendMsgData (elements = []) {
      if (!this.$store.osc.enabled || !this.$q.platform.is.electron || !this.presentation) return

      let addressText
      let addressTitle

      switch (this.presentationTypeId) {
        case 'song':
          elements.push({ address: this.oscOut.songText, args: this.lines.join('\n') })
          elements.push({ address: this.oscOut.songTranslation, args: this.translatedLines.join('\n') })
          break
        case 'caption':
        case 'scripture': // remove HTML code of line.
          switch (this.settings?.formatBeamer) {
            case 'Standaard':
              addressText = this.oscOut.captionDefaultText
              addressTitle = this.oscOut.captionDefaultTitle
              break
            case 'Bijbeltekst':
              addressText = this.oscOut.captionScriptureText
              addressTitle = this.oscOut.captionScriptureTitle
              break
            case 'Titel':
              addressText = this.oscOut.captionTitleText
              addressTitle = this.oscOut.captionTitleTitle
              break
            case 'Alleen tekst':
              addressText = this.oscOut.captionOnlytextText
              break
            case 'Thema':
              addressText = this.oscOut.captionThemaText
              addressTitle = this.oscOut.captionThemaTitle
              break
            case 'Geen':
            default:
          }
          if (addressText) elements.push({ address: addressText, args: this.lines.join('\n').replace(/<br>/gi, '\n').replace(/<(.*?)>/gi, '').replace(/&nbsp;/gi, ' ') }) // .replace(/<(.*?)>/gi, '')
          if (addressTitle) elements.push({ address: addressTitle, args: this.title.replace(/<(.*?)>/gi, '') })
          break
        case 'countdown':
          if (!this.control.isFinished) {
            if (this.control?.remaining) elements.push({ address: this.oscOut.countdownText, args: this.control.remaining })
          } else {
            elements.push({ address: this.oscOut.countdownText, args: '' })
          }
          break
        case 'image':
        case 'video':
          break
        default:
      }

      this.oscSendMsg(elements)
    },

    async oscSendMsg (elements) {
      if (!this.$store.osc.enabled || !this.$q.platform.is.electron) return
      // console.log(elements)
      const oscElements = elements.filter(element => element.address !== '' && element.address !== undefined)
      if (oscElements.length < 1) return

      const buffer = osc.toBuffer({
        timetag: new Date(new Date().getTime() + 0),
        oscElements
      })

      await this.$electron.oscSend(this.$store.osc.outAddress, this.$store.osc.outPort, buffer)
    }
  }
})
</script>
