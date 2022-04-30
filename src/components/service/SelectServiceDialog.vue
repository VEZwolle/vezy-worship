<template>
  <q-dialog ref="dialog" square>
    <q-card>
      <q-toolbar class="bg-secondary text-white">
        <q-toolbar-title>Open dienst</q-toolbar-title>
        <q-btn v-close-popup flat round dense icon="close" />
      </q-toolbar>

      <q-card-section v-if="!services" class="text-center">
        <q-spinner-dots color="primary" size="4rem" />
      </q-card-section>

      <div v-else>
        <q-list>
          <ServiceListItem v-for="(service, i) in services" :key="service.id" :service="service" :color="colors[i % 7]" @click="select(service)" />
        </q-list>

        <q-separator />

        <q-card-section>
          <q-pagination v-model="page" direction-links :max="total" :max-pages="5" class="justify-center" />
        </q-card-section>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import useServiceStore from 'stores/service'
import ServiceListItem from './ServiceListItem'

export default {
  components: { ServiceListItem },
  setup () {
    const store = useServiceStore()
    return { store }
  },
  data () {
    return {
      services: null,
      page: 1,
      total: 0
    }
  },
  computed: {
    colors () {
      return ['primary', 'secondary', 'accent', 'positive', 'negative', 'info', 'warning']
    }
  },
  methods: {
    async show () {
      this.$refs.dialog.show()
      await this.load()
    },
    hide () {
      this.$refs.dialog.hide()
    },
    async load () {
      this.services = await this.$api.get('/services')
    },
    select (service) {
      this.store.loadService(service.id)
      this.hide()
    }
  }
}
</script>

<style scoped>
.q-card {
  min-width: 400px;
}
</style>
