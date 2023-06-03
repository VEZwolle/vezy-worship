<template>
  <q-card>
    <q-toolbar class="bg-secondary text-white">
      <q-btn flat round dense icon="help" />
      <q-toolbar-title>
        <span>VezyWorship Help</span>
      </q-toolbar-title>
      <q-btn flat round dense icon="close" @click="hide" />
    </q-toolbar>

    <q-card-section>
      <div>
        <q-splitter
          v-model="splitterModel"
          unit="px"
          style="height: calc(100vh - 82px)"
        >
          <template #before>
            <q-tabs
              v-model="tab"
              vertical
              class="text-teal"
              dense
            >
              <q-tab name="main" icon="home" label="Basis" />
              <q-tab name="live" icon="live_tv" label="Bediening Live" />
              <q-tab name="mainsetlist" icon="input" label="Dienst & setlist" />
              <q-tab name="song" icon="music_note" label="Liederen" />
              <q-tab name="caption" icon="short_text" label="Titels" />
              <q-tab name="scripture" icon="menu_book" label="Bijbelteksten" />
              <q-tab name="image" icon="image" label="Afbeeldingen" />
              <q-tab name="video" icon="smart_display" label="Film" />
              <q-tab name="countdown" icon="alarm" label="Countdown" />
              <q-tab name="shortkey" icon="key" label="Sneltoetsen" />
              <q-tab name="about" icon="build" label="Over" />
            </q-tabs>
          </template>

          <template #after>
            <q-tab-panels
              v-model="tab"
              animated
              swipeable
              vertical
              transition-prev="jump-up"
              transition-next="jump-up"
            >
              <q-tab-panel name="main">
                <HelpMain />
              </q-tab-panel>
              <q-tab-panel name="live">
                <HelpLive />
              </q-tab-panel>
              <q-tab-panel name="mainsetlist">
                <HelpMainSetlist />
              </q-tab-panel>
              <q-tab-panel name="song">
                <HelpSong />
              </q-tab-panel>
              <q-tab-panel name="caption">
                <HelpCaption />
              </q-tab-panel>
              <q-tab-panel name="scripture">
                <HelpScripture />
              </q-tab-panel>
              <q-tab-panel name="image">
                <HelpImage />
              </q-tab-panel>
              <q-tab-panel name="video">
                <HelpVideo />
              </q-tab-panel>
              <q-tab-panel name="countdown">
                <HelpCountdown />
              </q-tab-panel>
              <q-tab-panel name="shortkey">
                <HelpShortkey />
              </q-tab-panel>
              <q-tab-panel name="about">
                <HelpAbout />
              </q-tab-panel>
            </q-tab-panels>
          </template>
        </q-splitter>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import HelpMain from './HelpMain.vue'
import HelpLive from './HelpLive.vue'
import HelpMainSetlist from './HelpMainSetlist.vue'
import HelpSong from './HelpSong.vue'
import HelpCaption from './HelpCaption.vue'
import HelpScripture from './HelpScripture.vue'
import HelpImage from './HelpImage.vue'
import HelpVideo from './HelpVideo.vue'
import HelpCountdown from './HelpCountdown.vue'
import HelpShortkey from './HelpShortkey.vue'
import HelpAbout from './HelpAbout.vue'

export default {
  components: {
    HelpMain,
    HelpLive,
    HelpMainSetlist,
    HelpSong,
    HelpCaption,
    HelpScripture,
    HelpImage,
    HelpVideo,
    HelpCountdown,
    HelpShortkey,
    HelpAbout
  },
  data () {
    return {
      tab: 'main',
      splitterModel: 150
    }
  },
  methods: {
    hide () {
      window.close()
    }
  }
}
</script>
