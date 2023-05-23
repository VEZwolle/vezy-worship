<template>
  <q-dialog ref="dialogArrange" persistent square>
    <q-card>
      <q-toolbar class="bg-secondary text-white">
        <q-toolbar-title>
          <span>Liedtekst ordenen</span>
        </q-toolbar-title>
        <q-btn v-close-popup flat round dense icon="close" />
      </q-toolbar>
      <div v-if="lyricsLines">
        <div class="row">
          <div class="col">
            <q-toolbar class="bg-grey-3 text-dark">
              <q-toolbar-title>
                <span>{{ oneListView ? 'Songtext, Vertaling & verwijdere regels': 'Lied tekst' }}</span>
              </q-toolbar-title>
              <q-btn v-show="oneListView" color="secondary" label="II >" @click.stop="toggleListView(false)">
                <q-tooltip>Klik aan om tekst en vertaling naast elkaar te zien.</q-tooltip>
              </q-btn>
            </q-toolbar>
          </div>
          <div class="col">
            <q-toolbar class="bg-grey-3 text-dark">
              <q-toolbar-title>
                <span>{{ oneListView ? '' : 'Vertaling' }}</span>
              </q-toolbar-title>
              <q-btn color="secondary" label="Zoek & splits taal via DeepL" @click.stop="language">
                <q-tooltip>Laat via DeepL de taal herkennen en splits de songtext op (alleen uit songtekst).</q-tooltip>
              </q-btn>
              <q-btn v-show="!oneListView" color="secondary" label="< I" @click.stop="toggleListView(true)">
                <q-tooltip>Klik aan om alles onder elkaar te zien of.<br>laat leeg om tekst en vertaling naast elkaar te zien. </q-tooltip>
              </q-btn>
            </q-toolbar>
          </div>
        </div>
        <div class="row lyrics">
          <template v-for="editorCol in editorCols" :key="editorCol.id">
            <div v-if="editorCol.show" class="col">
              <q-list dense bordered padding class="rounded-borders">
                <template v-for="(lyricsLine, lyricsIndex) in lyricsLines" :key="lyricsIndex">
                  <q-item
                    v-if="showOutput(lyricsLine.output, editorCol.id)"
                    v-shortkey="lineEditText ? { } : { up: ['arrowup'], down: ['arrowdown'], left: ['arrowleft'], right: ['arrowright'], space: ['space'], delete: ['del'], insertOne: ['i'], insert: ['u'] }"
                    clickable
                    :class="lineClass(lyricsLine)"
                    :active="isSelectedLabel(lyricsIndex)"
                    active-class="bg-yellow text-white"
                    @click="select(lyricsIndex)"
                    @shortkey="handleArrow"
                  >
                    <q-item-section avatar>
                      <q-avatar round dense size="sm" color="text-grey" text-color="text-grey" :icon="lineAvatar(lyricsLine.output)" />
                    </q-item-section>
                    <q-item-section no-wrap>
                      <div
                        :ref="`line_${lyricsIndex}`"
                        :contenteditable="lineEditText"
                        @dblclick="toggleLineEdit(lyricsIndex)"
                        @blur="updateLyricsLine(lyricsIndex)"
                        @input="updateLyricsLine(lyricsIndex)"
                        @keydown.enter="updateLyricsLine(lyricsIndex, true)"
                        v-text="lyricsLine.text"
                      />
                    </q-item-section>

                    <q-item-section side class="setlist-actions">
                      <div class="text-grey-8 q-gutter-xs">
                        <q-btn
                          class="gt-xs"
                          size="12px"
                          flat
                          dense
                          round
                          icon="keyboard_double_arrow_up"
                          @click.stop="insertLine(lyricsIndex, 3)"
                        >
                          <q-tooltip>Lege regel hierboven (beide kolommen)</q-tooltip>
                        </q-btn>
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
                        <q-item v-close-popup clickable @click.stop="insertLabel(lyricsIndex, { key: 'vers', color: 'blue' }, 3)">
                          <q-item-section>Invoegen label: 'vers' (beide)</q-item-section>
                          <q-item-section avatar>
                            <q-avatar color="primary" text-color="white" size="28px" flat round icon="label_important_outline" />
                          </q-item-section>
                          <q-menu context-menu no-focus>
                            <q-list dense style="min-width: 100px">
                              <q-item v-for="label, index of labels" :key="index" v-close-popup clickable @click.stop="insertLabel(lyricsIndex, label, 3)">
                                <q-item-section>{{ label.key }}</q-item-section>
                              </q-item>
                            </q-list>
                          </q-menu>
                          <q-tooltip>Klik rechts voor meer label opties.</q-tooltip>
                        </q-item>
                        <q-item v-close-popup clickable @click.stop="insertLine(lyricsIndex, editorCol.output)">
                          <q-item-section>Invoegen: Lege regel</q-item-section>
                          <q-item-section avatar>
                            <q-avatar color="primary" text-color="white" size="28px" flat round icon="publish" />
                          </q-item-section>
                        </q-item>
                        <q-item v-close-popup clickable @click.stop="insertLine(lyricsIndex, 3)">
                          <q-item-section>Invoegen: Lege regel (beide)</q-item-section>
                          <q-item-section avatar>
                            <q-avatar color="primary" text-color="white" size="28px" flat round icon="keyboard_double_arrow_up" />
                          </q-item-section>
                        </q-item>
                        <q-item v-close-popup clickable @click.stop="moveLineToLabel(lyricsIndex)">
                          <q-item-section>Verplaats naar label</q-item-section>
                          <q-item-section avatar>
                            <q-avatar color="primary" text-color="white" size="28px" flat round icon="move_up" />
                          </q-item-section>
                        </q-item>
                        <q-item v-close-popup clickable @click.stop="copyText(lyricsIndex)">
                          <q-item-section>Kopieer onderdeel</q-item-section>
                          <q-item-section avatar>
                            <q-avatar color="primary" text-color="white" size="28px" flat round icon="content_copy" />
                          </q-item-section>
                        </q-item>
                        <q-item v-close-popup :disable="!ifCopyLyrics" clickable @click.stop="pasteText(lyricsIndex, true)">
                          <q-item-section>Plak onderdeel onder (met label)</q-item-section>
                          <q-item-section avatar>
                            <q-avatar color="primary" text-color="white" size="28px" flat round icon="content_paste" />
                          </q-item-section>
                        </q-item>
                        <q-item v-close-popup :disable="!ifCopyLyrics" clickable @click.stop="pasteText(lyricsIndex, false)">
                          <q-item-section>Plak onderdeel onder (zonder label)</q-item-section>
                          <q-item-section avatar>
                            <q-avatar color="primary" text-color="white" size="28px" flat round icon="content_paste" />
                          </q-item-section>
                        </q-item>
                        <q-item v-for="outputOption in outputOptions" :key="outputOption.id" v-close-popup clickable @click.stop="lineOutput(lyricsIndex, outputOption.id)">
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
          </template>
        </div>
      </div>
      <q-separator />
      <q-card-actions align="right">
        ordenen
        <q-toggle v-model="lineEditText" :icon="lineEditText ? 'edit' : 'sync_alt'" keep-color color="secondary" label="tekst bewerken">
          <q-tooltip>Schakel tussen ordenen en tekst bewerken.</q-tooltip>
        </q-toggle>
        <q-space />
        <q-btn color="secondary" label="Toepassen" @click.stop="submitSong">
          <q-tooltip>Pas de georganiseerde tekst toe op het lied in basis tab.</q-tooltip>
        </q-btn>
        <q-btn color="secondary" label="Annuleren" @click.stop="hide">
          <q-tooltip>Wijzigingen niet toepassen</q-tooltip>
        </q-btn>
      </q-card-actions>
      <q-inner-loading
        :showing="isLoading"
        label="Bezig met laden..."
        label-class="text-teal"
        label-style="font-size: 1.1em"
      />
    </q-card>
  </q-dialog>
</template>

<script>
import labels from './labels'

export default {
  props: {
    text: String,
    translation: String
  },
  emits: [
    'update:text',
    'update:translation'
  ],
  data () {
    return {
      lyricsLines: [],
      oneListView: false,
      selectIndex: 0,
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
          show: true,
          output: 1
        },
        {
          id: 'translation',
          show: !this.oneListView,
          output: 2
        }
      ],
      isLoading: false,
      lineEditText: false,
      copyLyrics: []
    }
  },
  computed: {
    labels () {
      return labels
    },
    ifCopyLyrics () {
      return this.copyLyrics.length > 0
    }
  },
  methods: {
    show () {
      this.lyricsLines = []
      this.$refs.dialogArrange.show()
      this.isLoading = true
      if (!this.translation) {
        this.lyricsLines = splitToLines(this.text)
      } else {
        this.lyricsLines = CombiSplitToLines(this.text, this.translation)
      }
      this.isLoading = false
    },
    hide () {
      this.$refs.dialogArrange.hide()
    },
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
    toggleListView (oneListView) {
      this.oneListView = oneListView
      this.editorCols.find(t => t.id === 'translation').show = !this.oneListView
    },
    insertLabel (index, label, outputNr) {
      if (this.lyricsLines[index].output === 3) { outputNr = 3 }
      const newLine = {
        empty: false,
        label,
        text: label.key,
        output: outputNr // 0 = none, 1 = only text, 2 = only translation, 3 = text + translation
      }
      this.lyricsLines.splice(index, 0, newLine)
    },
    insertLine (index, outputNr) {
      const newLine = {
        empty: true,
        label: null,
        text: '',
        output: outputNr // 0 = none, 1 = only text, 2 = only translation, 3 = text + translation
      }
      this.lyricsLines.splice(index, 0, newLine)
    },
    moveLineToLabel (index) {
      let labelIndex = -1
      for (let i = index - 1; i >= 0; i--) {
        if (this.lyricsLines[i].label && this.lyricsLines[i].output) {
          labelIndex = i
          break
        }
      }
      this.lyricsLines[index].output = 0 // remove line
      if (labelIndex > -1) {
        this.lyricsLines[labelIndex].text += ` (${this.lyricsLines[index].text})`
      } else {
        const newLine = {
          empty: false,
          label: { key: 'tag', color: 'deep-purple' },
          text: `tag (${this.lyricsLines[index].text})`,
          output: 3 // 0 = none, 1 = only text, 2 = only translation, 3 = text + translation
        }
        this.lyricsLines.splice(0, 0, newLine)
      }
    },
    copyText (index) {
      let labelStartIndex = 0
      let labelEndIndex = this.lyricsLines.length
      for (let i = index; i >= 0; i--) {
        if (this.lyricsLines[i].label && this.lyricsLines[i].output) {
          labelStartIndex = i
          break
        }
      }
      for (let i = index + 1; i < this.lyricsLines.length; i++) {
        if (this.lyricsLines[i].label && this.lyricsLines[i].output) {
          labelEndIndex = i
          break
        }
      }
      this.copyLyrics = this.lyricsLines.slice(labelStartIndex, labelEndIndex)
    },
    pasteText (index, withLabel) {
      this.isLoading = true
      let startIndex = 0
      if (!withLabel && this.copyLyrics[0].label) { startIndex = 1 }
      if (withLabel && !this.copyLyrics[this.copyLyrics.length - 1].empty) { this.insertLine(index + 1, 3) }
      for (let i = this.copyLyrics.length - 1; i >= startIndex; i--) {
        this.lyricsLines.splice(index + 1, 0, this.copyLyrics[i])
      }
      if (withLabel && !this.copyLyrics[0].empty) { this.insertLine(index + 1, 3) }
      this.isLoading = false
    },
    toggleLineEdit (index) {
      this.lineEditText = !this.lineEditText
      if (this.lineEditText) {
        const lineElement = this.$refs[`line_${index}`][0]
        setTimeout(() => { lineElement.focus() }, 0)
        if (lineElement.hasChildNodes()) { // if the element is not empty
          const s = window.getSelection()
          const r = document.createRange()
          const e = lineElement.childElementCount > 0 ? lineElement.lastChild : lineElement
          r.setStart(e, 1)
          r.setEnd(e, 1)
          s.removeAllRanges()
          s.addRange(r)
        }
      }
    },
    updateLyricsLine (index, finisch = false) {
      const lineElement = this.$refs[`line_${index}`][0]
      this.lyricsLines[index].text = lineElement.innerText.trim()
      if (!this.lyricsLines[index].text) {
        this.lyricsLines[index].empty = true
      } else {
        this.lyricsLines[index].empty = false
      }
      this.lyricsLines[index].label = null
      for (const label of labels) {
        if (((this.lyricsLines[index].text.toLowerCase().startsWith(label.key) && /[\d({[]/.test(this.lyricsLines[index].text.toLowerCase())) || this.lyricsLines[index].text.toLowerCase() === label.key) === false) {
          continue
        }
        this.lyricsLines[index].label = { ...label, value: this.lyricsLines[index].text }
        // this.lyricsLines[index].output = 3
        break
      }
      if (finisch) {
        this.lineEditText = false
      }
    },
    lineOutput (index, output) {
      this.lyricsLines[index].output = output
    },
    isSelectedLabel (index) {
      return this.selectIndex === index
    },
    select (index) {
      this.selectIndex = index
    },
    handleArrow (event) {
      switch (event.srcKey) {
        case 'up':
          this.selectIndex -= 1
          break
        case 'left':
          this.lyricsLines[this.selectIndex].output = 1
          break
        case 'down':
          this.selectIndex += 1
          break
        case 'right':
          this.lyricsLines[this.selectIndex].output = 2
          break
        case 'space':
          this.lyricsLines[this.selectIndex].output = 3
          break
        case 'delete':
          this.lyricsLines[this.selectIndex].output = 0
          break
        case 'insertOne':
          this.insertLine(this.selectIndex, this.lyricsLines[this.selectIndex].output)
          break
        case 'insert':
          this.insertLine(this.selectIndex, 3)
          break
      }
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
            text += text ? `\r\n${this.lyricsLines[i].text}` : this.lyricsLines[i].text
            break
          case 2:
            translation += translation ? `\r\n${this.lyricsLines[i].text}` : this.lyricsLines[i].text
            translationAdd = true
            break
          default: // 3
            text += text ? `\r\n${this.lyricsLines[i].text}` : this.lyricsLines[i].text
            translation += translation ? `\r\n${this.lyricsLines[i].text}` : this.lyricsLines[i].text
            break
        }
      }
      this.$emit('update:text', text)
      if (translationAdd) { this.$emit('update:translation', translation) }
      this.hide()
    },
    async language () {
      this.isLoading = true

      const getLanguage = []
      const lines = []
      let language = []
      for (let i = 0; i < this.lyricsLines.length; i++) {
        if (this.lyricsLines[i].output === 1) {
          getLanguage.push(this.lyricsLines[i].text)
          lines.push(i)
        }
      }
      if (!lines.length) {
        this.isLoading = false
        return
      }

      try {
        const result = await this.$api.post('/language', { textLines: getLanguage })
        language = result.resultLanguage
        // if (lines.length !== language.length)
        for (let i = 0; i < language.length; i++) {
          if (language[i] === 'NL') {
            this.lyricsLines[lines[i]].output = 2
          } else {
            this.lyricsLines[lines[i]].output = 1
          }
        }
      } catch {
        this.$q.notify({ type: 'negative', message: 'Er is iets fout gegaan met het vertalen. Probeer het later opnieuw.' })
      } finally {
        this.isLoading = false
      }
    }
  }
}

function splitToLines (text, outputNr = 1) {
  if (!text) return []

  return text
    .replace(/\r?\n/g, '<br>')
    .split('<br>')
    .map((lines) => {
      const line = lines.trim()
      const result = {
        empty: false,
        label: null,
        text: '',
        output: outputNr // 0 = none, 1 = only text, 2 = only translation, 3 = text + translation
      }

      if (line === '') {
        result.empty = true
        result.output = 3
      } else {
        for (const label of labels) {
          if (((line?.toLowerCase().startsWith(label.key) && /[\d({[]/.test(line?.toLowerCase())) || line?.toLowerCase() === label.key) === false) {
            continue
          }
          result.label = { ...label, value: lines }
          result.output = 3
          break
        }
      }

      result.text = line

      return result
    })
}
function CombiSplitToLines (text, translation) {
  const lyricsLines = []
  if (!text && !translation) return []
  const stlText = splitToLines(text)
  const stlTranslation = splitToLines(translation, 2)
  let iText = 0
  let iTranslation = 0
  while (iText < stlText.length && iTranslation < stlTranslation.length) {
    /*
    splisten gebeurt na een lege regel
    label hoort bij volgende regel.
    - start met text en vul aan met translation per regel
    - verwijder(negeer) uit vertaling de lege regels & labels; deze komen uit de songtext
    */
    if ((stlText[iText].empty && stlTranslation[iTranslation].empty) || (stlText[iText].label && stlTranslation[iTranslation].label)) {
      lyricsLines.push(stlText[iText])
      iText++
      iTranslation++
    } else if (!stlText[iText].empty && stlTranslation[iTranslation].empty) {
      lyricsLines.push(stlText[iText])
      iText++
    } else if (stlText[iText].empty && !stlTranslation[iTranslation].empty) {
      if (!stlTranslation[iTranslation].label) { lyricsLines.push(stlTranslation[iTranslation]) }
      iTranslation++
    } else if (stlText[iText].label) {
      lyricsLines.push(stlText[iText])
      iText++
    } else if (stlTranslation[iTranslation].label) {
      iTranslation++
    } else {
      lyricsLines.push(stlText[iText])
      lyricsLines.push(stlTranslation[iTranslation])
      iText++
      iTranslation++
    }
  }
  if (iText < stlText.length) {
    for (let j = iText; j < stlText.length; j++) {
      lyricsLines.push(stlText[j])
    }
  }
  if (iTranslation < stlTranslation.length) {
    for (let j = iTranslation; j < stlTranslation.length; j++) {
      lyricsLines.push(stlTranslation[j])
    }
  }
  return lyricsLines
}

</script>

<style scoped lang="scss">
.lyrics {
  height: 70vh;
  overflow-y: scroll;
}

.q-card {
  min-width: 60vw;
  min-height: 80vh;
}
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
