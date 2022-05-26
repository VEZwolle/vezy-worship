import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import nl from 'dayjs/locale/nl'

dayjs.extend(customParseFormat)
dayjs.locale(nl)

export function date (value, format) {
  const date = dayjs(value)

  if (!date.isValid()) return 'n.n.b.'

  if (format) {
    return date.format(format)
  }

  return date.format('dddd D MMMM YYYY')
}

export default ({ app }) => {
  // Allows to use this.$date inside Vue components.
  app.config.globalProperties.$date = date
}
