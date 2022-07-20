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
      fileId: null
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
      fileId: null,
      fileLivestreamId: null
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
      type: 0
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
      livestream: require('./countdown/CountdownOutput.vue').default
    }
  }
  // {
  //   id: 'scripture'
  // }
]
