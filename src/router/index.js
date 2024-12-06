import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes.js'

export default createRouter({
  routes,
  history: createWebHashHistory(process.env.VUE_ROUTER_BASE)
})
