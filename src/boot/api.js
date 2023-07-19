import axios from 'axios'

const api = axios.create({
  baseURL: process.env.API_URL // ,
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
)

export default ({ app }) => {
  // Allows to use this.$api inside Vue components.
  app.config.globalProperties.$api = api
}

export { api }
