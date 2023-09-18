import axios from 'axios'
import { Notify, Dialog } from 'quasar'

const api = axios.create({
  baseURL: process.env.API_URL
})

api.interceptors.request.use((request) =>
  new Promise((resolve) => {
    let token = localStorage.getItem('VezyWorshipApiToken')
    if (token) {
      request.headers.Authorization = token
      resolve(request)
    } else {
      Notify.create({ type: 'negative', message: 'Cloud functies: gebruikers sleutel niet ingesteld!' })
      Dialog.create({
        title: 'Vezy worship - Cloud functies',
        message: 'Wat is uw gebruikers sleutel?',
        prompt: {
          model: '',
          isValid: val => val.length > 5,
          type: 'text'
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        token = data
      }).onCancel(() => {
        token = ''
      }).onDismiss(() => {
        localStorage.setItem('VezyWorshipApiToken', token)
        if (token) {
          request.headers.Authorization = token
        }
        resolve(request)
      })
    }
  },
  (error) => Promise.reject(error)
  )
)

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response.status === 401 && error.response.data?.api === 'VezyWorshipApi') {
      localStorage.removeItem('VezyWorshipApiToken')
      Notify.create({ type: 'negative', message: 'Cloud functies: Gebruikers sleutel niet geldig!' })
    }
    Promise.reject(error)
  }
)

export default ({ app }) => {
  // Allows to use this.$api inside Vue components.
  app.config.globalProperties.$api = api
}

export { api }
