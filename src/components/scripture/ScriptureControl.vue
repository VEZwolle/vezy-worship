<template>
  <TextSlidesControl v-if="presentation.settings.text" :presentation="presentation" :preview="preview" />
</template>

<script>
import BaseControl from '../presentation/BaseControl.vue'
import TextSlidesControl from '../common/TextSlidesControl.vue'

export default {
  components: { TextSlidesControl },
  extends: BaseControl,
  created () {
    if (this.$store.noLivestream) {
      this.presentation.sections = splitScripture(this.presentation.settings.text, 10000)
    } else {
      this.presentation.sections = splitScripture(this.presentation.settings.text)
    }
  }
}

function splitScripture (text, maxCharsPerSlide = 350) {
  if (!text) return []

  const lineBreaks = [
    '<div><br></div>',
    '<div><sup><br></sup></div>'
  ]

  return text
    .split(new RegExp(lineBreaks.join('|')))
    .map((section) => {
      if (!section) {
        const slides = [['']]
        return { slides }
      }
      const sentenceEndChars1 = '.?!’”\'";'
      const sentenceEndChars2 = ',:'
      const minMaxChars = `.{1,${maxCharsPerSlide}}`
      const regex = new RegExp(`${minMaxChars}$|${minMaxChars}<div>|${minMaxChars}[${sentenceEndChars1}]|${minMaxChars}[${sentenceEndChars2}]|${minMaxChars} |${minMaxChars}.`, 'g')

      const slides = section
        .match(regex)
        .map(line => [line])

      return { slides }
    })
}
</script>
