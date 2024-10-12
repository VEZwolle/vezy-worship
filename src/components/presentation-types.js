import books from './scripture/books.js'
import TextSlidesOutputStage from './common/TextSlidesOutputStage.vue'
import SongSettings from './song/SongSettings.vue'
import SongControl from './song/SongControl.vue'
import SongOutputBeamer from './song/SongOutputBeamer.vue'
import SongOutputLivestream from './song/SongOutputLivestream.vue'
import CaptionSettings from './caption/CaptionSettings.vue'
import CaptionControl from './caption/CaptionControl.vue'
import CaptionOutputBeamer from './caption/CaptionOutputBeamer.vue'
import CaptionOutputLivestream from './caption/CaptionOutputLivestream.vue'
import ScriptureSettings from './scripture/ScriptureSettings.vue'
import ImageSettings from './image/ImageSettings.vue'
import ImageControl from './image/ImageControl.vue'
import ImageOutputStage from './image/ImageOutputStage.vue'
import ImageOutputBeamer from './image/ImageOutputBeamer.vue'
import ImageOutputLivestream from './image/ImageOutputLivestream.vue'
import VideoSettings from './video/VideoSettings.vue'
import VideoControl from './video/VideoControl.vue'
import VideoOutputStage from './video/VideoOutputStage.vue'
import VideoOutputBeamer from './video/VideoOutputBeamer.vue'
import VideoOutputLivestream from './video/VideoOutputLivestream.vue'
import CountdownSettings from './countdown/CountdownSettings.vue'
import CountdownControl from './countdown/CountdownControl.vue'
import CountdownOutputStage from './countdown/CountdownOutputStage.vue'
import CountdownOutputBeamer from './countdown/CountdownOutputBeamer.vue'
import CountdownOutputLivestream from './countdown/CountdownOutputLivestream.vue'

export default [
  {
    id: 'song',
    name: 'Lied',
    icon: 'music_note',
    color: 'blue',
    settings: {
      title: '',
      collection: '',
      number: '',
      text: '', // text
      translation: '', // text
      noSplitLines: false,
      bgOpacity: 0,
      bgFileId: null
    },
    title (settings) {
      let collectionNumber = settings.collection ? ` ${settings.collection}` : ''
      collectionNumber += settings.number ? ` ${settings.number}` : ''
      collectionNumber = collectionNumber ? ` |${collectionNumber}` : ''
      return `${settings.title}${collectionNumber}`
    },
    description (settings) {
      return settings.text
    },
    components: {
      settings: SongSettings,
      control: SongControl
    },
    outputs: {
      stage: TextSlidesOutputStage,
      beamer: SongOutputBeamer,
      livestream: SongOutputLivestream
    }
  },
  {
    id: 'caption',
    name: 'Ondertitel & tekst',
    icon: 'short_text',
    color: 'primary',
    settings: {
      title: 'Titel',
      text: 'Lorem ipsum...', // html
      bgOpacity: 0,
      bgFileId: null,
      formatBeamer: 'Geen',
      formatLivestream: 'Standaard',
      maxLivestreamChar: 500
    },
    description (settings) {
      return settings.text
    },
    components: {
      settings: CaptionSettings,
      control: CaptionControl
    },
    outputs: {
      stage: TextSlidesOutputStage,
      beamer: CaptionOutputBeamer,
      livestream: CaptionOutputLivestream
    }
  },
  {
    id: 'image',
    name: 'Afbeelding',
    icon: 'image',
    color: 'teal',
    settings: {
      title: '',
      bgOpacity: 0,
      bgFileId: null,
      beamer: {
        fileId: null,
        ratio: null,
        advanced: false,
        zoom: 100,
        x: 0,
        y: 0,
        rotate: 0
      },
      livestream: {
        fileId: null,
        ratio: null,
        advanced: false,
        zoom: 100,
        x: 0,
        y: 0,
        rotate: 0
      }
    },
    components: {
      settings: ImageSettings,
      control: ImageControl
    },
    outputs: {
      stage: ImageOutputStage,
      beamer: ImageOutputBeamer,
      livestream: ImageOutputLivestream
    }
  },
  {
    id: 'video',
    name: 'Video',
    icon: 'smart_display',
    color: 'red',
    settings: {
      title: '',
      bgOpacity: 0,
      bgFileId: null,
      fileId: null,
      play: false,
      time: 0,
      startTime: 0,
      endTime: -1,
      noLivestream: false
    },
    components: {
      settings: VideoSettings,
      control: VideoControl
    },
    outputs: {
      stage: VideoOutputStage,
      beamer: VideoOutputBeamer,
      livestream: VideoOutputLivestream
    }
  },
  {
    id: 'countdown',
    name: 'Countdown',
    icon: 'alarm',
    color: 'orange',
    settings: {
      time: null,
      type: 0,
      position: 'RO',
      bgOpacity: 0,
      bgFileId: null
    },
    description (settings) {
      if (settings.type === 1) {
        return `Klok tot ${settings.time}`
      }
      return `Aftellen tot ${settings.time}`
    },
    components: {
      settings: CountdownSettings,
      control: CountdownControl
    },
    outputs: {
      stage: CountdownOutputStage,
      beamer: CountdownOutputBeamer,
      livestream: CountdownOutputLivestream
    }
  },
  {
    id: 'scripture',
    name: 'Bijbeltekst',
    icon: 'menu_book',
    color: 'brown',
    settings: {
      title: '',
      bible: 'nbv21',
      book: 'GEN',
      chapter: null,
      verseFrom: null,
      verseTo: null,
      text: '', // html
      bgOpacity: 0,
      bgFileId: null,
      formatBeamer: 'Bijbeltekst',
      formatLivestream: 'Breed',
      maxLivestreamChar: 350
    },
    title ({ bible, book, chapter, verseFrom, verseTo }) {
      const bookDefinition = books.find(b => b.id === book)

      let title = `${bookDefinition.name} ${chapter}:${verseFrom}`

      if (verseTo) {
        title += `-${verseTo}`
      }

      return `${title} <small>(${bible})</small>`
    },
    description (settings) {
      return settings.text
    },
    components: {
      settings: ScriptureSettings,
      control: CaptionControl
    },
    outputs: {
      stage: TextSlidesOutputStage,
      beamer: CaptionOutputBeamer,
      livestream: CaptionOutputLivestream
    }
  }
]
