<template>
  <div>
    <div>
      <q-item-label :class="`text-h6 ${classDiff}`" :lines="1">
        <div v-html="title" />
      </q-item-label>
      <q-item-label :class="`text-subtitle2 overflow-hidden${classDiff}`" :lines="1">
        <div v-html="collectionNumber" />
      </q-item-label>
    </div>
    <q-separator />
    <div class="row">
      <div class="col">
        <div class="text-primary">
          Tekst:
        </div>
        <div :class="`lyrics${classDiff}`" :style="`height: ${lyricsHeight}vh;`" v-html="lyrics" />
      </div>
      <q-separator vertical class="q-mx-xs" />
      <div class="col-auto" style="max-width: 49%;">
        <div class="text-primary">
          Vertaling:
        </div>
        <div :class="`lyrics${classDiff}`" :style="`height: ${lyricsHeight}vh;`" v-html="lyricsTranslation" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    collectionNumber: String,
    lyrics: String,
    lyricsTranslation: String,
    showDiff: Boolean,
    lyricsHeight: String // vh
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
    overflow-y: auto;
    overflow-x: hidden;
  }

</style>
