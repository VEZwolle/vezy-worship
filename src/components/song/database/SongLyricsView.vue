<template>
  <div class="lyricsview">
    <div>
      <q-item-label :class="`text-h6 ${classDiff}`" :lines="1">
        <div v-html="sanitizerHtml(title)" />
      </q-item-label>
      <q-item-label :class="`text-subtitle2 overflow-hidden${classDiff}`" :lines="1">
        <div v-html="sanitizerHtml(collectionNumber)" />
      </q-item-label>
    </div>
    <q-separator />
    <div class="row">
      <div class="col">
        <div class="text-primary">
          Tekst:
        </div>
        <div :class="`lyrics${classDiff}`" :style="`height: ${lyricsHeight}vh;`" v-html="sanitizerHtml(lyrics)" />
      </div>
      <q-separator vertical class="q-mx-xs" />
      <div class="col-auto" style="max-width: 49%;">
        <div class="text-primary">
          Vertaling:
        </div>
        <div :class="`lyrics${classDiff}`" :style="`height: ${lyricsHeight}vh;`" v-html="sanitizerHtml(lyricsTranslation)" />
      </div>
    </div>
  </div>
</template>

<script>
import { sanitizerHtml } from '../../common/CleanText.js'
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
  },
  methods: {
    sanitizerHtml (contect) {
      return sanitizerHtml(contect)
    }
  }
}
</script>

<style scoped lang="scss">
  .lyricsview {
    :deep(.diff) {
      ins {
        background: lightgreen;
        text-decoration: none;
      }
      del {
        background: pink;
      }
    }

    :deep(.diffhide) {
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

    :deep(.lyrics) {
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
</style>
