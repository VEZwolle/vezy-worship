import { defineBoot } from '#q-app/wrappers'
import useServiceStore from 'stores/service'

export default defineBoot(({ app }) => {
  // Allows to use this.$store inside Vue components.
  app.config.globalProperties.$store = useServiceStore()
})
