<template>
  <q-tabs v-model="lyricsTab" class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator :breakpoint="0">
    <q-tab name="new" label="Nieuw" />
    <q-tab name="newDiff" label="N + V" />
    <q-tab name="diff" label="Verschil" />
    <q-tab name="diffDb" label="V + D" />
    <q-tab name="db" label="Database" />
  </q-tabs>
  <q-separator />
  <q-tab-panels v-model="lyricsTab" animated>
    <q-tab-panel name="new">
      <SongLyricsView
        :title="newTitle"
        :collection-number="newCollectionNumber"
        :lyrics="newLyrics"
        :lyrics-translation="newLyricsTranslation"
        class="col"
      />
    </q-tab-panel>
    <q-tab-panel name="newDiff">
      <div class="row">
        <SongLyricsView
          :title="newTitle"
          :collection-number="newCollectionNumber"
          :lyrics="newLyrics"
          :lyrics-translation="newLyricsTranslation"
          class="col"
        />
        <q-separator vertical color="secondary" class="q-mx-md" />
        <SongLyricsView
          :title="compareTitle"
          :collection-number="compareCollectionNumber"
          :lyrics="compareLyrics"
          :lyrics-translation="compareLyricsTranslation"
          show-diff
          class="col"
        />
      </div>
    </q-tab-panel>
    <q-tab-panel name="diff">
      <SongLyricsView
        :title="compareTitle"
        :collection-number="compareCollectionNumber"
        :lyrics="compareLyrics"
        :lyrics-translation="compareLyricsTranslation"
        show-diff
        class="col"
      />
    </q-tab-panel>
    <q-tab-panel name="diffDb">
      <div class="row">
        <SongLyricsView
          :title="compareTitle"
          :collection-number="compareCollectionNumber"
          :lyrics="compareLyrics"
          :lyrics-translation="compareLyricsTranslation"
          show-diff
          class="col"
        />
        <q-separator vertical color="secondary" class="q-mx-md" />
        <SongLyricsView
          :title="databaseTitle"
          :collection-number="databaseCollectionNumber"
          :lyrics="databaseLyrics"
          :lyrics-translation="databaseLyricsTranslation"
          class="col"
        />
      </div>
    </q-tab-panel>
    <q-tab-panel name="db">
      <SongLyricsView
        :title="databaseTitle"
        :collection-number="databaseCollectionNumber"
        :lyrics="databaseLyrics"
        :lyrics-translation="databaseLyricsTranslation"
        class="col"
      />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script>
import SongLyricsView from './SongLyricsView.vue'

export default {
  components: { SongLyricsView },
  props: {
    newTitle: String,
    newCollectionNumber: String,
    newLyrics: String,
    newLyricsTranslation: String,
    compareTitle: String,
    compareCollectionNumber: String,
    compareLyrics: String,
    compareLyricsTranslation: String,
    databaseTitle: String,
    databaseCollectionNumber: String,
    databaseLyrics: String,
    databaseLyricsTranslation: String,
    tab: String
  },
  data () {
    return {
      lyricsTab: this.tab || 'diff'
    }
  }
}
</script>
