import PresentationSettingsDialog from '../components/presentation/PresentationSettingsDialog.vue'
import SongDatabaseDialog from '../components/song/database/SongDatabaseDialog.vue'

export default ({ app }) => {
  app.component('PresentationSettingsDialog', PresentationSettingsDialog)
  app.component('SongDatabaseDialog', SongDatabaseDialog)
}
