import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { PiniaSharedState } from 'pinia-shared-state'
import { RouterView } from 'vue-router'
import FloatingVue from 'floating-vue'

import router from './router'
import api from './util/api'
import date from './util/date'
import commonComponents from './components/common'

import './style.css'
import 'floating-vue/dist/style.css'

const app = createApp(RouterView)

const pinia = createPinia()
pinia.use(PiniaSharedState({}))

app.use(pinia)
app.use(router)
app.use(FloatingVue)

// Make utils available to all components
app.config.globalProperties.$api = api
app.config.globalProperties.$date = date

// Make common components available to all components
for (const component of commonComponents) {
  app.component(component.name, component)
}

app.mount('#app')
