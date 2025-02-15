<template>
  <div />
</template>

<script>
import { defineComponent } from 'vue'
import * as osc from "osc-min"

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
      osc: {
        outAddress: 'localhost',
        outPort: 7000,
        clear: '/composition/layers/3/clear', // none
        song: '/composition/layers/3/clips/1/connect', // int 0 or 1
        songText: '/composition/layers/3/clips/1/video/source/blocktextgenerator/text/params/lines', // string
        songTranslation: '/composition/layers/3/clips/1/video/effects/textblock/effect/text/params/lines', // string
        captionScripture: '/composition/layers/3/clips/2/connect', // int 0 or 1
        captionScriptureText: '/composition/layers/3/clips/2/video/source/blocktextgenerator/text/params/lines', // string
        captionScriptureTitle: '/composition/layers/3/clips/2/video/effects/textblock/effect/text/params/lines', // string
        captionDefault: '/composition/layers/3/clips/3/connect', // int 0 or 1
        captionDefaultText: '/composition/layers/3/clips/3/video/source/blocktextgenerator/text/params/lines', // string
        captionDefaultTitle: '/composition/layers/3/clips/3/video/effects/textblock/effect/text/params/lines', // string
        captionTitle: '/composition/layers/3/clips/4/connect', // int 0 or 1
        captionTitleText: '/composition/layers/3/clips/4/video/source/blocktextgenerator/text/params/lines', // string
        captionTitleTitle: '/composition/layers/3/clips/4/video/effects/textblock/effect/text/params/lines', // string
        captionOnlytext: '/composition/layers/3/clips/2/connect', // int 0 or 1
        captionOnlytextText: '/composition/layers/3/clips/2/video/source/blocktextgenerator/text/params/lines', // string
        captionThema: '/composition/layers/3/clips/5/connect', // int 0 or 1
        captionThemaText: '/composition/layers/3/clips/5/video/source/blocktextgenerator/text/params/lines', // string
        captionThemaTitle: '/composition/layers/3/clips/5/video/effects/textblock/effect/text/params/lines', // string
        countdown: '/composition/layers/3/clips/6/connect', // int 0 or 1
        countdownText: '/composition/layers/3/clips/6/video/effects/texteffect/effect/text/params/lines', // string
        imageOffering: '/composition/layers/3/clips/7/connect', // int 0 or 1
        imageMinistry: '/composition/layers/3/clips/8/connect', // int 0 or 1
        imageEnd: '/composition/layers/3/clips/9/connect', // int 0 or 1
      },
      oscLog: ''
    }
  },

  computed: {
    id () {
      return this.presentation.id
    },
    settings () {
      return this.presentation.settings
    },
    control () {
      return this.presentation.control
    },
    // song/caption selection
    selectedSectionIndex () {
      return this.control?.selectedSectionIndex ? this.control.selectedSectionIndex : 0
    },
    // countdown
    remaining () {
      return this.control?.remaining ? this.control.remaining : ''
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
    },

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
    'selectedSectionIndex' () {
      this.oscSendMsgData()
    },
    'remaining' () {
      this.oscSendMsgData()
    }
  },
  methods: {
    oscSendMsgTotal () {
      let elements = []
      if (this.isClear) elements.push({ address: this.osc.clear })

      switch (this.presentationTypeId) {
        case 'song':
          if (!this.isClear) elements.push({ address: this.osc.song, args: 1 })
          break
        case 'caption':
        case 'scripture':
          if (!this.isClear) {
            switch (this.settings?.formatBeamer) {
              case 'Standaard':
                elements.push({ address: this.osc.captionDefault, args: 1 })
                break
              case 'Bijbeltekst':
              case 'Alleen tekst':
                elements.push({ address: this.osc.captionScripture, args: 1 })
                break
              case 'Titel':
                elements.push({ address: this.osc.captionTitle, args: 1 })
                break
              case 'Thema':
                elements.push({ address: this.osc.captionThema, args: 1 })
                break
              case 'Geen':
                elements.push({ address: this.osc.clear })
                break
              default:
            }
          }
          break
        case 'countdown':
          if (!this.control.isFinished) { // niet actief zetten wanneer finished
            if (!this.isClear ) elements.push({ address: this.osc.countdown, args: 1 })
          }
          break
        case 'image':
          if (!this.isClear) {
            switch (this.id) {
              case 'offering':
                elements.push({ address: this.osc.imageOffering, args: 1 })
                break
              case 'ministry':
                elements.push({ address: this.osc.imageMinistry, args: 1 })
                break
              case 'end':
                elements.push({ address: this.osc.imageEnd, args: 1 })
                break
              default:
                elements.push({ address: this.osc.clear })
            }  
          }
          break
        case 'video':
          elements.push({ address: this.osc.clear })
          break
        default:
      }
      // add data
      this.oscSendMsgData(elements)
    },

    oscSendMsgData (elements = []) {
      let addressText
      let addressTitle

      switch (this.presentationTypeId) {
        case 'song':
          elements.push({ address: this.osc.songText, args: this.lines.join('\n') })
          elements.push({ address: this.osc.songTranslation, args: this.translatedLines.join('\n') })
          break
        case 'caption':
        case 'scripture': // remove HTML code of line.
          switch (this.settings?.formatBeamer) {
            case 'Standaard':
              addressText = this.osc.captionDefaultText
              addressTitle = this.osc.captionDefaultTitle
              break
            case 'Bijbeltekst':
              addressText = this.osc.captionScriptureText
              addressTitle = this.osc.captionScriptureTitle
              break
            case 'Titel':
              addressText = this.osc.captionTitleText
              addressTitle = this.osc.captionTitleTitle
              break
            case 'Alleen tekst':
              addressText = this.osc.captionOnlytextText
              break
            case 'Thema':
              addressText = this.osc.captionThemaText
              addressTitle = this.osc.captionThemaTitle
              break
            case 'Geen':
            default:
          }
          if (addressText) elements.push({ address: addressText, args: this.lines.join('\n').replace(/<br>/gi, '\n').replace(/<(.*?)>/gi, '').replace(/&nbsp;/gi, ' ') }) // .replace(/<(.*?)>/gi, '')
          if (addressTitle) elements.push({ address: addressTitle, args: this.title.replace(/<(.*?)>/gi, '') })
          break
        case 'countdown':
          if (!this.control.isFinished) {
            if (this.control?.remaining) elements.push({ address: this.osc.countdownText, args: this.control.remaining })
          } else {
            elements.push({ address: this.osc.countdownText, args: '' })
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
      const buffer = osc.toBuffer({
        timetag: new Date(new Date().getTime() + 0),
        elements
      })

      if (this.$q.platform.is.electron) {
        this.oscLog = await this.$electron.oscSend(this.osc.outAddress, this.osc.outPort, buffer)
      }
    }
  }
})
</script>
