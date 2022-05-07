export default [
  {
    id: 'song',
    name: 'Lied',
    icon: 'music_note',
    color: 'red',
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
    color: 'blue',
    settings: {
      name: '',
      url: null
    },
    components: {
      settings: require('./image/ImageSettings.vue').default
    },
    outputs: {
      beamer: require('./image/ImageOutput.vue').default,
      livestream: require('./image/ImageOutput.vue').default
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
