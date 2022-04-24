import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { PiniaSharedState } from 'pinia-shared-state'
import { RouterView } from 'vue-router'
import router from './router'
import commonComponents from './components/common'
import './style.css'

const app = createApp(RouterView)

const pinia = createPinia()
pinia.use(PiniaSharedState({}))

app.use(pinia)
app.use(router)

for (const component of commonComponents) {
  app.component(component.name, component)
}

app.mount('#app')
