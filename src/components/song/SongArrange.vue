<template>
  <q-card>
    <q-toolbar class="bg-grey-3 text-dark">
      <q-checkbox
        v-model="oneListView"
        left-label
        label="1 kolom weergave"
        color="red"
        @click="toggleListView"
      >
        <q-tooltip>
          Vink aan om allesonder elkaar te zien of<br>laat leeg om tekst en vertaling naast elkaar te zien.
        </q-tooltip>
      </q-checkbox>
    </q-toolbar>
    <div class="row">
      <div v-for="editorCol in editorCols" :key="editorCol.id" class="col">
        {{ editorCol.label }}
        <q-list v-if="editorCol.show" dense bordered padding class="rounded-borders">
          <template v-for="(lyricsLine, lyricsIndex) in lyricsLines" :key="lyricsIndex">
            <q-item
              v-if="showOutput(lyricsLine.output, editorCol.id)"
              v-shortkey="{ up: ['arrowup'], down: ['arrowdown'], left: ['arrowleft'], right: ['arrowright'] }"
              clickable
              :class="lineClass(lyricsLine)"
              :active="isSelectedLabel(lyricsIndex)"
              active-class="bg-secondary text-white"
              @click="select(lyricsIndex, lyricsLine.output)"
              @shortkey="handleArrow"
            >
              <q-item-section avatar>
                <q-avatar round dense size="sm" color="text-grey" text-color="text-grey" :icon="lineAvatar(lyricsLine.output)" />
              </q-item-section>
              <q-item-section no-wrap>
                <div v-html="lyricsLine.text" />
              </q-item-section>

              <q-item-section side class="setlist-actions">
                <div class="text-grey-8 q-gutter-xs">
                  <q-btn
                    v-for="outputOption in outputOptions"
                    :key="outputOption.id"
                    class="gt-xs"
                    size="12px"
                    flat
                    dense
                    round
                    :icon="outputOption.icon"
                    @click.stop="lineOutput(lyricsIndex, outputOption.id)"
                  >
                    <q-tooltip>{{ outputOption.label }}</q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>

              <q-menu context-menu no-focus>
                <q-list dense style="min-width: 100px">
                  <q-item
                    v-for="outputOption in outputOptions"
                    :key="outputOption.id"
                    v-close-popup
                    clickable
                    @click.stop="lineOutput(lyricsIndex, outputOption.id)"
                  >
                    <q-item-section>{{ outputOption.label }}</q-item-section>
                    <q-item-section avatar>
                      <q-avatar color="primary" text-color="white" size="28px" flat round :icon="outputOption.icon" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-item>
          </template>
        </q-list>
      </div>
    </div>
    <q-separator />
    <q-card-actions align="right">
      <q-btn color="secondary" label="Toepassen" @click.stop="submitSong">
        <q-tooltip>Pas de georganiseerde tekst toe op het lied in basis tab.</q-tooltip>
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import labels from './labels'

export default {
  props: {
    text: String,
    translation: String,
    tab: String
  },
  emits: [
    'update:text',
    'update:translation',
    'update:tab'
  ],
  data () {
    return {
      lyricsLines: [],
      oneListView: true,
      selectIndex: 0,
      selectOutput: 0,
      outputOptions: [
        {
          id: 0,
          icon: 'delete',
          label: 'Verwijderen'
        },
        {
          id: 1,
          icon: 'text_fields',
          label: 'Lied tekst'
        },
        {
          id: 2,
          icon: 'translate',
          label: 'Vertaling'
        },
        {
          id: 3,
          icon: 'sync_alt',
          label: 'Beide toepassen'
        }
      ],
      editorCols: [
        {
          id: 'text',
          label: 'Lied tekst',
          show: true
        },
        {
          id: 'translation',
          label: 'Vertaling',
          show: !this.oneListView
        }
      ],
      temp: true
    }
  },
  created () {
    // nu alleen de text input gebruikt; nog aanpassen aan samenvoegen met translation bestaad wanneer gaan bewerken.
    this.lyricsLines = splitToLines(this.text)
    // this.lyricsLines = splitToLines(this.translation)
  },
  methods: {
    showOutput (output, view) {
      if (this.oneListView) {
        return view === 'text'
      }
      switch (output) {
        case 0:
          return false
        case 1:
          return view === 'text'
        case 2:
          return view !== 'text'
        default: // 3
          return true
      }
    },
    lineClass (lyricsLine) {
      let bgColor = ''
      if (lyricsLine.label) { bgColor = ` bg-${lyricsLine.label.color}` }
      if (lyricsLine.empty) { bgColor = ' bg-indigo-1 line-empty' }
      switch (lyricsLine.output) {
        case 0:
          return 'text-red line-delete'
        case 1:
          return `text-blue-grey-8${bgColor}`
        case 2:
          return `text-blue${bgColor}`
        default: // 3
          return `text-black${bgColor}`
      }
    },
    lineAvatar (output) {
      return this.outputOptions.find(t => t.id === output).icon
    },
    toggleListView () {
      this.editorCols.find(t => t.id === 'translation').show = !this.oneListView
    },
    lineOutput (index, output) {
      this.lyricsLines[index].output = output
    },
    isSelectedLabel (index) {
      return this.selectIndex === index
    },
    select (index, output) {
      this.selectIndex = index
      this.selectOutput = output
    },
    handleArrow () {
      this.temp = !this.temp
    },
    submitSong () {
      let text = ''
      let translation = ''
      let translationAdd = false
      for (let i = 0; i < this.lyricsLines.length; i++) {
        switch (this.lyricsLines[i].output) {
          case 0:
            break
          case 1:
            text += `\r\n${this.lyricsLines[i].text}`
            break
          case 2:
            translation += `\r\n${this.lyricsLines[i].text}`
            translationAdd = true
            break
          default: // 3
            text += `\r\n${this.lyricsLines[i].text}`
            translation += `\r\n${this.lyricsLines[i].text}`
            break
        }
      }
      this.$emit('update:text', text)
      if (translationAdd) { this.$emit('update:translation', translation) }
      this.$emit('update:tab', 'text')
    }

  }
}

function splitToLines (text) {
  if (!text) return []

  return text
    .replace(/\r?\n/g, '<br>')
    .split('<br>')
    // .trim()
    .map((lines) => {
      const result = {
        empty: false,
        label: null,
        text: '',
        output: 1 // 0 = none, 1 = only text, 2 = only translation, 3 = text + translation
      }

      if (lines === '') {
        result.empty = true
        result.output = 3
      } else {
        for (const label of labels) {
          if (!lines?.toLowerCase().startsWith(label.key)) {
            continue
          }
          result.label = { ...label, value: lines }
          result.output = 3
          break
        }
      }

      result.text = lines

      return result
    })
}
</script>

<style scoped lang="scss">
.q-item {
  user-select: none;
  cursor: default !important;
}
.setlist-actions {
  opacity: 0;
  transition: opacity 0.2s;
}
.q-item:hover .setlist-actions {
  opacity: 1;
}
.line-empty {
  height: 15px;
  min-height: 15px;
}
.line-delete {
  height: 10px;
  min-height: 10px;
}
</style>
