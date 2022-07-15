export function strip (html) {
  const tmp = document.createElement('div')
  tmp.innerHTML = html

  return tmp.innerText
}

export default ({ app }) => {
  // Allows to use this.$strip inside Vue components.
  app.config.globalProperties.$strip = strip
}
