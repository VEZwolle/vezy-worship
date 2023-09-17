import axios from 'axios'
import { Notify } from 'quasar'

const api = axios.create({
  baseURL: process.env.API_URL
})

api.interceptors.request.use(
  (request) => {
    let token = localStorage.getItem('VezyWorshipApiToken')
    if (!token) {
      Notify.create({ type: 'negative', message: 'Cloud functies: gebruikers sleutel niet ingesteld!' })
      // ask VezyWorshipApiToken (not working in electron)
      token = prompt('Vezy worship - Cloud functies: \nWat is uw gebruikers sleutel?', '')
      // check functie voor opslag nog toevoegen?
      localStorage.setItem('VezyWorshipApiToken', token)
    }
    if (token) {
      request.headers.Authorization = token
    }
    return request
  },
  (error) => Promise.reject(error)
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
