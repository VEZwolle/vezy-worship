import { createRouter, createWebHashHistory } from 'vue-router'
import App from './components/App.vue'
import BeamerOutput from './components/output/Beamer.vue'
import LivestreamOutput from './components/output/Livestream.vue'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: App },
    { path: '/output/beamer', component: BeamerOutput },
    { path: '/output/livestream', component: LivestreamOutput }
  ]
})
