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
      newSong: 'De <b>schepping</b> van hemel en aarde 1 1 In het begin schiep God de hemel en de aarde. 2 De aarde was nog woest en doods, en duisternis lag over de oervloed, maar Gods geest zweefde over het water.',
      dbSong: 'De schepping van hemel en <i>aarde</i> 1 In het begin schiep God de hemel en de aarde.  2   De aarde was woest en doods, duisternis lag over de oervloed, en over het water zweefde Gods geest.',
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
    htmlDiff () {
      this.newSongComp = HtmlDiff(this.dbSong, this.newSong)
      this.dbSongComp = this.dbSong //  HtmlDiff(this.newSong, this.dbSong) // or use this.dbSong whitout css clean
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
