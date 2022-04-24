import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { PiniaSharedState } from 'pinia-shared-state'
import { RouterView } from 'vue-router'
import router from './router'
import './style.css'

const app = createApp(RouterView)

const pinia = createPinia()
pinia.use(PiniaSharedState({}))

app.use(pinia)
app.use(router)

app.mount('#app')
