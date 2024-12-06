import App from 'components/App.vue'
import OutputView from 'src/components/output/OutputView.vue'
import OutputStage from 'components/output/OutputStage.vue'
import HelpDocu from 'components/help/HelpDocu.vue'

export default [
  {
    path: '/',
    component: App
    // loaded on demand only, using dynamic imports:
    // component: () => import('components/App.vue')
    // no import at start required
  },
  {
    path: '/output/beamer',
    component: OutputView,
    props: () => ({ id: 'beamer', showBackground: true, showMessages: true })
  },
  {
    path: '/output/beamer/alpha',
    component: OutputView,
    props: () => ({ id: 'beamer', showBackground: true, showMessages: true, alpha: true })
  },
  {
    path: '/output/livestream',
    component: OutputView,
    props: () => ({ id: 'livestream' })
  },
  {
    path: '/output/livestream/alpha',
    component: OutputView,
    props: () => ({ id: 'livestream', alpha: true })
  },
  {
    path: '/output/stage',
    component: OutputStage
  },
  {
    path: '/help',
    component: HelpDocu
  }
]
