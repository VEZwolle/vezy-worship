<template>
  <Modal ref="modal" title="Open dienst">
    <template #header>
      Selecteer hieronder een dienst om te openen.
    </template>

    <ServiceList @select="select" />
  </Modal>
</template>

<script>
import ServiceList from './ServiceList.vue'
import useStore from '@/store'

export default {
  components: { ServiceList },
  setup () {
    const store = useStore()
    return { store }
  },
  data () {
    return {
      services: null
    }
  },
  methods: {
    open () {
      this.$refs.modal.open()
    },
    close () {
      this.$refs.modal.close()
    },
    select (service) {
      this.store.loadService(service.id)
      this.close()
    }
  }
}
</script>
