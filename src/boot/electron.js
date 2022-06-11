/**
 * Communicate with electron main thread (electron-main.js).
 */
export default ({ app }) => {
  // Allows to use this.$electron inside Vue components.
  app.config.globalProperties.$electron = window.electron || {}
}
