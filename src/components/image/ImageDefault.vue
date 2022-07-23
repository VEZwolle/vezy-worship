<script>
import BaseSettings from '../presentation/BaseSettings.vue'

export default {
  extends: BaseSettings,
  data () {
    return {
      imageDefaults: [
        {
          title: 'Collecte',
          idName: 'collecte',
          width: 1920,
          height: 1080
        },
        {
          title: 'Nazorg',
          idName: 'nazorg',
          width: 1920,
          height: 1080
        },
        {
          title: 'Einde dienst / Gezegende Zondag',
          idName: 'end',
          width: 1920,
          height: 1080
        }
      ]
    }
  },
  computed: {
    fileBeamerUrl () {
      if (this.imageDefaults.find(t => t.idName === this.settings.fileId) !== undefined) {
        return require('../../assets/' + this.settings.fileId + 'beamer.png')
      }
      return this.$store.media[this.settings.fileId]
    },
    fileLivestreamUrl () {
      if (this.imageDefaults.find(t => t.idName === this.settings.fileLivestreamId) !== undefined) {
        return require('../../assets/' + this.settings.fileLivestreamId + 'livestream.png')
      }
      return this.$store.media[this.settings.fileLivestreamId] || this.fileBeamerUrl
    }
  }
}
</script>
