<template>
  <q-btn-dropdown
    v-shortkey="['ctrl', 'r']"
    flat
    dense
    no-caps
    :label="labelBack"
    @click="returnLiveOuptut()"
    @shortkey="returnLiveOuptut()"
  >
    <q-tooltip>
      Kies een sheet uit de lijst die direct getoond moet worden.<br>
      Daarna kan u terug naar waar u gebleven bent in de setlist. (ctrl + r)<br>
    </q-tooltip>
    <q-list>
      <q-item
        v-for="defaultItem in defaultItems"
        :key="defaultItem.id"
        v-close-popup
        dense
        clickable
        @click="output(defaultItem.id)"
      >
        <q-item-section>
          <q-item-label>{{ defaultItem.settings.title }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'

export default {
  components: { },
  data () {
    return {
      defaultItems: [
        {
          id: 'nazorg',
          type: 'image',
          settings: {
            title: 'Nazorg',
            beamer: {
              fileId: 'nazorgbeamer.png',
              ratio: 16 / 9,
              advanced: false,
              zoom: 100,
              x: 0,
              y: 0,
              rotate: 0
            },
            livestream: {
              fileId: 'nazorglivestream.png',
              ratio: 16 / 9,
              advanced: false,
              zoom: 100,
              x: 0,
              y: 0,
              rotate: 0
            }
          }
        },
        {
          id: 'collecte',
          type: 'image',
          settings: {
            title: 'Collecte',
            beamer: {
              fileId: 'collectebeamer.png',
              ratio: 16 / 9,
              advanced: false,
              zoom: 100,
              x: 0,
              y: 0,
              rotate: 0
            },
            livestream: {
              fileId: 'collectelivestream.png',
              ratio: 16 / 9,
              advanced: false,
              zoom: 100,
              x: 0,
              y: 0,
              rotate: 0
            }
          }
        },
        {
          id: 'end',
          type: 'image',
          settings: {
            title: 'Einde dienst / Gezegende Zondag',
            beamer: {
              fileId: 'endbeamer.png',
              ratio: 16 / 9,
              advanced: false,
              zoom: 100,
              x: 0,
              y: 0,
              rotate: 0
            },
            livestream: {
              fileId: 'endlivestream.png',
              ratio: 16 / 9,
              advanced: false,
              zoom: 100,
              x: 0,
              y: 0,
              rotate: 0
            }
          }
        },
        {
          id: 'host',
          type: 'caption',
          settings: {
            title: 'Host',
            text: 'Host'
          }
        },
        {
          id: 'preacher',
          type: 'caption',
          settings: {
            title: 'Spreker',
            text: 'Spreker'
          }
        }
      ]
    }
  },
  computed: {
    labelBack () {
      if (this.$store.livePresentationToRestore !== null) {
        if (this.$store.livePresentationToRestore.settings.title !== undefined) {
          return 'verder met: ' + this.$store.livePresentationToRestore.settings.title
        }
        return 'verder met: live'
      }
      return 'Toon direct...'
    }
  },
  methods: {
    output (idName) {
      if (this.$store.livePresentationToRestore === null) {
        this.$store.livePresentationToRestore = cloneDeep(this.$store.livePresentation)
      }
      // controleer of in setlist staat
      this.$store.livePresentation = cloneDeep(this.$store.service.presentations.find(t => t.id === idName)) || cloneDeep(this.defaultItems.find(t => t.id === idName))
      this.$store.isClear = false
    },
    returnLiveOuptut () {
      if (this.$store.livePresentationToRestore !== null) {
        this.$store.isClear = true
        this.$store.livePresentation = cloneDeep(this.$store.livePresentationToRestore)
        this.$store.livePresentationToRestore = null
      }
    }
  }
}
</script>
