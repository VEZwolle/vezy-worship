<template>
  <q-dialog ref="dialogDatabase" persistent square>
    <q-card>
      <q-toolbar class="bg-secondary text-white">
        <q-toolbar-title>
          <span>Liedtekst vergelijken/toevoegen met lokale database</span>
        </q-toolbar-title>
        <q-btn v-close-popup flat round dense icon="close" />
      </q-toolbar>
      <div class="row q-pa-md q-gutter-md">
        <div class="col">
          <h6>Lied met wijzigingen</h6>
          <q-editor ref="newSong" v-model="newText" />
        </div>
        <div class="col">
          <h6>Origineel (db) versie</h6>
          <q-editor ref="dbSong" v-model="databaseText" />
        </div>
      </div>

      <q-separator />

      <div class="row q-pa-md q-gutter-md">
        <q-card bordered class="col">
          <q-card-section>
            <div class="text-h6" v-text="'Titel new'" />
            <div class="text-subtitle2" v-text="'Collecie en nr.'" />
          </q-card-section>
          <q-separator inset />
          <q-card-section>
            <div ref="compareTitleNew" class="col lyrics" v-html="newText" />
          </q-card-section>
        </q-card>
        <q-card bordered class="col">
          <q-card-section>
            <div class="text-h6" v-text="'Titel verschil'" />
            <div class="text-subtitle2" v-text="'Collecie en nr.'" />
          </q-card-section>
          <q-separator inset />
          <q-card-section>
            <div ref="compareTitleDiff" class="col lyrics diff" v-html="compareText" />
          </q-card-section>
        </q-card>
        <q-card bordered class="col">
          <q-card-section>
            <div class="text-h6" v-text="'Titel database'" />
            <div class="text-subtitle2" v-text="'Collecie en nr.'" />
          </q-card-section>
          <q-separator inset />
          <q-card-section>
            <div ref="compareTitleDatabase" class="col lyrics" v-html="databaseText" />
          </q-card-section>
        </q-card>
      </div>

      <q-separator />

      <q-card-actions align="right">
        <q-btn color="secondary" label="Opslaan in database" @click.stop="save">
          <q-tooltip>Geselecteerde liederen toevoegen, vervangen & opslaan in database</q-tooltip>
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
      newText: 'De <b>schepping</b> van hemel en aarde 1 1 In het begin schiep God de hemel en de aarde. 2 De aarde was nog woest en doods, en duisternis lag over de oervloed, maar Gods geest zweefde over het water.',
      databaseText: 'De schepping van hemel en <i>aarde</i> 1 In het begin schiep God de hemel en de aarde.  2   De aarde was woest en doods, duisternis lag over de oervloed, en over het water zweefde Gods geest.',
      compareTab: 'tabCompareTitle'
    }
  },
  computed: {
    compareText () {
      return HtmlDiff(this.databaseText, this.newText)
    }
  },
  methods: {
    async show () {
      this.$refs.dialogDatabase.show()
    },
    hide () {
      this.$refs.dialogDatabase.hide()
    },
    save () {
      // save database, nog uitwerken
    }
  }
}

</script>

<style scoped lang="scss">
.q-card {
  min-width: max(60vw, min(1152px, 95vw));
  min-height: 80vh;

  .q-card {
    min-width: 0;
    min-height: 15vh;
  }
}
</style>

<style lang="scss">
  .diff {
    ins {
      background: lightgreen;
      text-decoration: none;
    }
    del {
      background: pink;
    }
  }

  .diffhide {
    del {
      visibility: hidden;
    }
    ins, mark {
      text-decoration: none;
    }
    ins ~ del {
      display: none;
    }
  }

  .lyrics {
    height: 10vh;
    overflow-y: auto;
    overflow-x: hidden;
  }

</style>
