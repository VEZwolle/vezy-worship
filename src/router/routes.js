
import App from 'components/App.vue'
import Output from 'components/output/Output.vue'

export default [
  {
    path: '/',
    component: App
  },
  {
    path: '/output/:id',
    component: Output,
    props: route => ({ id: route.params.id })
  },
  {
    path: '/output/:id/alpha',
    component: Output,
    props: route => ({ id: route.params.id, alpha: true })
  }
]
