
import App from 'components/App.vue'
import Output from 'components/output/Output.vue'

export default [
  {
    path: '/',
    component: App
  },
  {
    path: '/output/beamer',
    component: Output,
    props: () => ({ id: 'beamer', showBackground: true, showMessages: true })
  },
  {
    path: '/output/livestream',
    component: Output,
    props: () => ({ id: 'livestream' })
  },
  {
    path: '/output/livestream/alpha',
    component: Output,
    props: () => ({ id: 'livestream', alpha: true })
  }
]
