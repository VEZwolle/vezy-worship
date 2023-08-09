<template>
  <q-dialog ref="dialogDatabase" persistent square>
    <q-card>
      <q-toolbar class="bg-secondary text-white">
        <q-toolbar-title>
          <span>Liedtekst vergelijken/toevoegen met lokale database</span>
        </q-toolbar-title>
        <q-btn v-close-popup flat round dense icon="close" />
      </q-toolbar>
      <div class="row q-px-md q-pt-md">
        <div class="col">
          <q-editor ref="newSong" v-model="newSong" />
          <h5>Lied met wijzigingen</h5>
          <div class="newsong" v-html="newSongComp" />
        </div>
        <div class="col">
          <q-editor ref="dbSong" v-model="dbSong" />
          <h5>Origineel (db) versie</h5>
          <div class="dbsong" v-html="dbSongComp" />
        </div>
      </div>
      <q-separator />

      <q-card-actions align="right">
        <q-btn color="secondary" label="vergelijk" @click.stop="htmlDiff">
          <q-tooltip>HtmlDiff</q-tooltip>
        </q-btn>
        <q-btn color="secondary" label="Annuleren" @click.stop="hide">
          <q-tooltip>Wijzigingen niet toepassen</q-tooltip>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { HtmlDiff } from '../common/HtmlDiff.js'

export default {
  props: {
  },
  emits: [
  ],
  data () {
    return {
      newSong: 'test deze song tekst <br>en nog een nieuwe regel',
      dbSong: 'test deze oude song tekst <br>en nog een regel',
      newSongComp: '',
      dbSongComp: ''
    }
  },
  computed: {
  },
  methods: {
    async show () {
      this.$refs.dialogDatabase.show()
    },
    hide () {
      this.$refs.dialogDatabase.hide()
    },
    async htmlDiff () {
      this.newSongComp = await HtmlDiff(this.dbSong, this.newSong)
      console.log(this.newSongComp)
      this.dbSongComp = await HtmlDiff(this.newSong, this.dbSong) // or use this.dbSong whitout css clean
      console.log(this.dbSongComp)
    }
  }
}

</script>

<style scoped lang="scss">
.q-card {
  min-width: max(60vw, min(1152px, 95vw));
  min-height: 80vh;
}
</style>

<style lang="scss">
  .newsong {
    ins {
      background: lightgreen;
      text-decoration: none;
    }
    del {
      background: pink;
    }
  }

  .dbsong {
    del {
      visibility: hidden;
    }
    ins {
      text-decoration: none;
    }
    ins ~ del {
      display: none;
    }
  }

</style>
