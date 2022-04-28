import { createPinia } from 'pinia'
import { PiniaSharedState } from 'pinia-shared-state'

const pinia = createPinia()

pinia.use(PiniaSharedState({}))

export default pinia
