import PresentationSettingsDialog from '../components/presentation/PresentationSettingsDialog.vue'
import SongDatabaseDialog from '../components/song/database/SongDatabaseDialog.vue'
import SongLyricsViews from '../components/song/database/SongLyricsViews.vue'
import SongItemDatabase from '../components/song/database/SongItemDatabase.vue'
import SongItem from '../components/song/database/SongItem.vue'

export default ({ app }) => {
  app.component('PresentationSettingsDialog', PresentationSettingsDialog)
  app.component('SongDatabaseDialog', SongDatabaseDialog)
  app.component('SongLyricsViews', SongLyricsViews)
  app.component('SongItemDatabase', SongItemDatabase)
  app.component('SongItem', SongItem)
}
