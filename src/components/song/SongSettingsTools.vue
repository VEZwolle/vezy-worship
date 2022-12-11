<script>
import BaseSettings from '../presentation/BaseSettings.vue'

export default {
  extends: BaseSettings,
  data () {
    return {
      backupSettingText: '',
      backupSettingTranslation: ''
    }
  },
  mounted () {
    this.backupSettingText = this.settings.text
    this.backupSettingTranslation = this.settings.translation
  },
  methods: {
    arrange () {
      this.backupSettingText = this.settings.text
      this.backupSettingTranslation = this.settings.translation
      this.$refs.SongArrangeDialog.show()
    },
    cpReplaceDubbeleNewline (text) {
      return text.replace(/\r?\n/g, '<br>').replace(/<br><br>/g, '<br>').replace(/<br>/g, '\r\n')
    },
    cpTrimLines (text) {
      const lines = text.replace(/\r?\n/g, '<br>').split('<br>')
      text = ''
      for (let i = 0; i < lines.length; i++) {
        text += text ? '\r\n' + lines[i].trim() : lines[i].trim()
      }
      return text
    },
    replaceDubbeleNewline (input) {
      if (input === 'text') {
        this.backupSettingText = this.settings.text
        this.settings.text = this.cpReplaceDubbeleNewline(this.settings.text)
      } else {
        this.backupSettingTranslation = this.settings.translation
        this.settings.translation = this.cpReplaceDubbeleNewline(this.settings.translation)
      }
    },
    trimLines (input) {
      if (input === 'text') {
        this.backupSettingText = this.settings.text
        this.settings.text = this.cpTrimLines(this.settings.text)
      } else {
        this.backupSettingTranslation = this.settings.translation
        this.settings.translation = this.cpTrimLines(this.settings.translation)
      }
    },
    restorBackup (input) {
      if (input === 'text') {
        const newBackup = this.settings.text
        this.settings.text = this.backupSettingText
        this.backupSettingText = newBackup
      } else {
        const newBackup = this.settings.translation
        this.settings.translation = this.backupSettingTranslation
        this.backupSettingTranslation = newBackup
      }
    }
  }
}
</script>
