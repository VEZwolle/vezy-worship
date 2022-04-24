import dayjs from 'dayjs'
import nl from 'dayjs/locale/nl'

dayjs.locale(nl)

export default function (value, format) {
  const date = dayjs(value)

  if (!date.isValid()) return 'n.n.b.'

  if (format) {
    return date.format(format)
  }

  return date.format('dddd D MMMM YYYY')
}
