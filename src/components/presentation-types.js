export default [
  {
    id: 'song',
    name: 'Lied',
    icon: 'music_note',
    color: 'blue',
    settings: {
      name: '',
      text: ''
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
    id: 'image',
    name: 'Afbeelding',
    icon: 'image',
    color: 'teal',
    settings: {
      name: '',
      url: null
    },
    components: {
      settings: require('./image/ImageSettings.vue').default,
      control: require('./image/ImageControl.vue').default
    },
    outputs: {
      beamer: require('./image/ImageOutput.vue').default,
      livestream: require('./image/ImageOutput.vue').default
    }
  },
  {
    id: 'video',
    name: 'Video',
    icon: 'smart_display',
    color: 'red',
    settings: {
      name: '',
      url: null
    },
    components: {
      settings: require('./video/VideoSettings.vue').default,
      control: require('./video/VideoControl.vue').default
    },
    outputs: {
      beamer: require('./video/VideoOutput.vue').default,
      livestream: require('./video/VideoOutput.vue').default
    }
  }
  // {
  //   id: 'scripture'
  // },
  // {
  //   id: 'caption'
  // },
  // {
  //   id: 'countdown'
  // }
]
