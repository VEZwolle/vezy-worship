import { Notify } from 'quasar'

Notify.setDefaults({
  position: 'bottom-right'
})

// base settings: https://github.com/quasarframework/quasar/blob/dev/ui/src/plugins/Notify.js
Notify.registerType('negative', {
  position: 'top',
  icon: $q => $q.iconSet.type.negative,
  color: 'negative'
})

Notify.registerType('info', {
  position: 'top',
  icon: $q => $q.iconSet.type.info,
  color: 'info'
})
