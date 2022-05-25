import ShortKey from 'vue-three-shortkey'

export default ({ app }) => {
  app.use(ShortKey, { prevent: ['input', 'textarea', 'div[contenteditable="true"]'] })
}
