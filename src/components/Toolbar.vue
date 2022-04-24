<template>
  <div class="p-2">
    <Button icon="Plus" @click="openServiceModal">
      Nieuwe dienst
    </Button>

    <ServiceModal ref="serviceModal" />
  </div>
</template>

<script>
import useStore from '@/store'
import ServiceModal from './service/ServiceModal.vue'

export default {
  components: { ServiceModal },
  setup () {
    const store = useStore()
    return { store }
  },
  methods: {
    openServiceModal () {
      this.$refs.serviceModal.open()
    }
  }
}
</script>
