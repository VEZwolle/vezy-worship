<script>
import BaseSettings from '../presentation/BaseSettings.vue'

export default {
  extends: BaseSettings,
  data () {
    return {
      imageDefault: [
        {
          title: 'Collecte',
          id: 'collecte'
        },
        {
          title: 'Nazorg',
          id: 'nazorg'
        },
        {
          title: 'Einde dienst / Gezegende Zondag',
          id: 'end'
        }
      ]
    }
  },
  computed: {
    fileBeamerUrl () {
      if (this.imageDefault.find(t => t.id === this.settings.fileId) !== undefined) {
        return require('../../assets/' + this.settings.fileId + 'beamer.png')
      }
      return this.$store.media[this.settings.fileId]
    },
    fileLivestreamUrl () {
      if (this.imageDefault.find(t => t.id === this.settings.fileLivestreamId) !== undefined) {
        return require('../../assets/' + this.settings.fileLivestreamId + 'livestream.png')
      }
      return this.$store.media[this.settings.fileLivestreamId] || this.fileBeamerUrl
    }
  }
}
</script>
