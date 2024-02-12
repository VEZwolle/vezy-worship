<template>
  <q-tabs v-model="lyricsTab" class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator :breakpoint="0">
    <q-tab v-for="(t, i) in tabs" :key="i" :name="t.name" :label="t.label" />
  </q-tabs>
  <q-separator />
  <q-tab-panels v-model="lyricsTab" animated>
    <q-tab-panel name="new">
      <SongLyricsView
        :title="newTitle"
        :collection-number="newCollectionNumber"
        :lyrics="newLyrics"
        :lyrics-translation="newLyricsTranslation"
        :lyrics-height="lyricsHeight"
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
          :lyrics-height="lyricsHeight"
          class="col"
        />
        <q-separator vertical color="secondary" class="q-mx-md" />
        <SongLyricsView
          :title="compareTitle"
          :collection-number="compareCollectionNumber"
          :lyrics="compareLyrics"
          :lyrics-translation="compareLyricsTranslation"
          :lyrics-height="lyricsHeight"
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
        :lyrics-height="lyricsHeight"
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
          :lyrics-height="lyricsHeight"
          show-diff
          class="col"
        />
        <q-separator vertical color="secondary" class="q-mx-md" />
        <SongLyricsView
          :title="databaseTitle"
          :collection-number="databaseCollectionNumber"
          :lyrics="databaseLyrics"
          :lyrics-translation="databaseLyricsTranslation"
          :lyrics-height="lyricsHeight"
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
        :lyrics-height="lyricsHeight"
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
    lyricsHeight: String, // vh
    tabs: Object,
    tab: String
  },
  data () {
    return {
      lyricsTab: this.tab || 'diff'
    }
  }
}
</script>
