import books from './scripture/books'

export default [
  {
    id: 'song',
    name: 'Lied',
    icon: 'music_note',
    color: 'blue',
    settings: {
      title: '',
      text: '',
      translation: '',
      bgOpacity: 0,
      bgFileId: null
    },
    description (settings) {
      return settings.text
    },
    components: {
      settings: require('./song/SongSettings.vue').default,
      control: require('./song/SongControl.vue').default
    },
    outputs: {
      beamer: require('./song/SongOutputBeamer.vue').default,
      livestream: require('./song/SongOutputLivestream.vue').default
    }
  },
  {
    id: 'caption',
    name: 'Ondertitel',
    icon: 'short_text',
    color: 'primary',
    settings: {
      title: 'Titel',
      text: 'Lorem ipsum...',
      bgOpacity: 0,
      bgFileId: null,
      formatBeamer: 'Geen',
      formatLivestream: 'Standaard'
    },
    description (settings) {
      return settings.text
    },
    components: {
      settings: require('./caption/CaptionSettings.vue').default,
      control: require('./caption/CaptionControl.vue').default
    },
    outputs: {
      beamer: require('./caption/CaptionOutputBeamer.vue').default,
      livestream: require('./caption/CaptionOutputLivestream.vue').default
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
      settings: require('./image/ImageSettings.vue').default,
      control: require('./image/ImageControl.vue').default
    },
    outputs: {
      beamer: require('./image/ImageOutputBeamer.vue').default,
      livestream: require('./image/ImageOutputLivestream.vue').default
    }
  },
  {
    id: 'video',
    name: 'Video',
    icon: 'smart_display',
    color: 'red',
    settings: {
      title: '',
      fileId: null,
      play: false,
      time: 0
    },
    components: {
      settings: require('./video/VideoSettings.vue').default,
      control: require('./video/VideoControl.vue').default
    },
    outputs: {
      beamer: require('./video/VideoOutputBeamer.vue').default,
      livestream: require('./video/VideoOutputLivestream.vue').default
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
      settings: require('./countdown/CountdownSettings.vue').default,
      control: require('./countdown/CountdownControl.vue').default
    },
    outputs: {
      beamer: require('./countdown/CountdownOutputBeamer.vue').default,
      livestream: require('./countdown/CountdownOutput.vue').default
    }
  },
  {
    id: 'scripture',
    name: 'Bijbeltekst',
    icon: 'menu_book',
    color: 'brown',
    settings: {
      bible: 'nbv21',
      book: 'GEN',
      chapter: null,
      verseFrom: null,
      verseTo: null,
      text: '',
      bgOpacity: 0,
      bgFileId: null
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
      settings: require('./scripture/ScriptureSettings.vue').default,
      control: require('./scripture/ScriptureControl.vue').default
    },
    outputs: {
      beamer: require('./scripture/ScriptureOutputBeamer.vue').default,
      livestream: require('./scripture/ScriptureOutputLivestream.vue').default
    }
  }
]
