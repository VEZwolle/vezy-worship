const imageDefaults = {
  ratio: 16 / 9,
  advanced: false,
  zoom: 100,
  x: 0,
  y: 0,
  rotate: 0
}

export default [
  {
    id: 'offering',
    type: 'image',
    settings: {
      title: 'Collecte',
      beamer: {
        fileId: '/images/collectebeamer.png',
        ...imageDefaults
      },
      livestream: {
        fileId: '/images/collectelivestream.png',
        ...imageDefaults
      }
    }
  },
  {
    id: 'ministry',
    type: 'image',
    settings: {
      title: 'Nazorg',
      beamer: {
        fileId: '/images/nazorgbeamer.png',
        ...imageDefaults
      },
      livestream: {
        fileId: '/images/nazorglivestream.png',
        ...imageDefaults
      }
    }
  },
  {
    id: 'end',
    type: 'image',
    settings: {
      title: 'Einde dienst / Gezegende zondag',
      beamer: {
        fileId: '/images/endbeamer.png',
        ...imageDefaults
      },
      livestream: {
        fileId: '/images/endlivestream.png',
        ...imageDefaults
      }
    }
  }
]
