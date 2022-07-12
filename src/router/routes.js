
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
    props: ({ params, query }) => ({
      id: params.id,
      showBackground: query.showBackground !== undefined,
      alpha: query.alpha !== undefined,
      preview: query.preview !== undefined
    })
  }
]
