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
      const sentenceEndChars = '.,;?!'
      const regex = new RegExp(`.{1,${maxCharsPerSlide}}[${sentenceEndChars}]`, 'g')

      const slides = section
        .match(regex)
        .map(line => [line])

      return { slides }
    })
}
</script>
