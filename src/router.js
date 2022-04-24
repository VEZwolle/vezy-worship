import { createRouter, createWebHashHistory } from 'vue-router'
import App from './components/App.vue'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: App }
  ]
})
