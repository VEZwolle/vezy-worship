<script>
import BaseSettings from '../presentation/BaseSettings.vue'
import labels, { isLabel } from './labels.js'

export default {
  extends: BaseSettings,
  data () {
    return {
      backupSettingText: '',
      backupSettingTranslation: ''
    }
  },
  computed: {
    labels () {
      return labels
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
    cpRemovePunctuation (text) {
      return text.replace(/[.,;]$/gm, '')
    },
    cpInsertLabelsLines (text, label) {
      const lines = text.replace(/\r?\n/g, '<br>').split('<br><br>')
      text = ''
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]?.split('<br>')
        const hasLabel = isLabel(line[0] || '')
        if (!hasLabel) {
          text += text ? '\r\n\r\n' + label + '\r\n' + lines[i] : label + '\r\n' + lines[i]
        } else {
          text += text ? '\r\n\r\n' + lines[i] : lines[i]
        }
      }
      text = text.replace(/<br>/g, '\r\n')
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
    trimRemovePunctuation (input) {
      if (input === 'text') {
        this.backupSettingText = this.settings.text
        this.settings.text = this.cpRemovePunctuation(this.cpTrimLines(this.settings.text))
      } else {
        this.backupSettingTranslation = this.settings.translation
        this.settings.translation = this.cpRemovePunctuation(this.cpTrimLines(this.settings.translation))
      }
    },
    insertLabelsLines (input, label) {
      if (input === 'text') {
        this.backupSettingText = this.settings.text
        this.settings.text = this.cpInsertLabelsLines(this.settings.text, label)
      } else {
        this.backupSettingTranslation = this.settings.translation
        this.settings.translation = this.cpInsertLabelsLines(this.settings.translation, label)
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
