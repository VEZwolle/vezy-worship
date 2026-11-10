import { defineBoot } from '#q-app'
import { useServiceStore } from '@/stores/service.js'

export default defineBoot(({ app }) => {
  // Allows to use this.$store inside Vue components.
  app.config.globalProperties.$store = useServiceStore()
})
