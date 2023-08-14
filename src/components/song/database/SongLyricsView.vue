<template>
  <q-card bordered>
    <q-card-section>
      <div :class="`text-h6${classDiff}`" v-html="title" />
      <div :class="`text-subtitle2${classDiff}`" v-html="collectionNumber" />
    </q-card-section>
    <q-separator inset />
    <q-card-section horizontal>
      <q-card-section>
        <div :class="`col lyrics${classDiff}`" v-html="lyrics" />
      </q-card-section>
      <q-separator vertical />
      <q-card-section>
        <div :class="`col lyrics${classDiff}`" v-html="lyricsTranslation" />
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  props: {
    title: String,
    collectionNumber: String,
    lyrics: String,
    lyricsTranslation: String,
    showDiff: Boolean
  },
  computed: {
    classDiff () {
      return this.showDiff ? ' diff' : ''
    }
  }
}
</script>

<style scoped lang="scss">

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
    height: 30vh;
    overflow-y: auto;
    overflow-x: hidden;
  }

</style>
