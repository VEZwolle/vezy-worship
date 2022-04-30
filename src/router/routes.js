
export default [
  {
    path: '/',
    component: () => import('components/App.vue')
  },
  {
    path: '/output/beamer',
    component: () => import('components/output/Beamer.vue')
  },
  {
    path: '/output/livestream',
    component: () => import('components/output/Livestream.vue')
  },
  {
    path: '/output/livestream/alpha',
    component: () => import('components/output/Livestream.vue'),
    props: () => ({ alpha: true })
  }
]
