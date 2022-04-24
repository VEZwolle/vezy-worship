<template>
  <div class="p-3 shadow">
    <Button icon="FolderOpen">
      Open dienst
    </Button>
    <Button icon="Plus" class="ml-2" @click="openServiceModal">
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
