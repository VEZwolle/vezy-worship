import axios from 'axios'

const api = axios.create({
  baseURL: process.env.API_URL
})

api.interceptors.request.use(
  (request) => {
    let token = localStorage.getItem('VezyWorshipApiToken')
    if (!token) {
      // ask VezyWorshipApiToken
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
    }
    Promise.reject(error)
  }
)

export default ({ app }) => {
  // Allows to use this.$api inside Vue components.
  app.config.globalProperties.$api = api
}

export { api }
