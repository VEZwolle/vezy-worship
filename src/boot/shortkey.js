import { defineBoot } from '#q-app'
import ShortKey from 'vue-three-shortkey'

export default defineBoot(({ app }) => {
  app.use(ShortKey, { prevent: ['input', 'textarea', 'div[contenteditable="true"]'] })
})
