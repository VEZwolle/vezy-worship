<template>
  <TextSlidesControl :presentation="presentation" :preview="preview" />
</template>

<script>
import BaseControl from '../presentation/BaseControl.vue'
import TextSlidesControl from '../common/TextSlidesControl.vue'

export default {
  components: { TextSlidesControl },
  extends: BaseControl,
  created () {
    this.presentation.sections = splitScripture(this.presentation.settings.text)
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
