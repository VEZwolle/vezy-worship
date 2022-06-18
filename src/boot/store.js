import useServiceStore from 'stores/service'

export default ({ app }) => {
  // Allows to use this.$store inside Vue components.
  app.config.globalProperties.$store = useServiceStore()
}
