<template>
  <div class="p-3 shadow flex items-center">
    <Button v-tooltip="'Open dienst'" icon="FolderOpen" @click="openSelectServiceModal" />
    <Button v-tooltip="'Nieuwe dienst maken'" icon="Plus" class="ml-1" @click="openEditServiceModal" />

    <h1 v-if="store.service" class="text-lg font-bold capitalize ml-5">
      {{ $date(store.service.date) }}
    </h1>

    <SelectServiceModal ref="selectServiceModal" />
    <EditServiceModal ref="editServiceModal" />
  </div>
</template>

<script>
import SelectServiceModal from './service/SelectServiceModal.vue'
import EditServiceModal from './service/EditServiceModal.vue'
import useStore from '@/store'

export default {
  components: { SelectServiceModal, EditServiceModal },
  setup () {
    const store = useStore()
    return { store }
  },
  methods: {
    openSelectServiceModal () {
      this.$refs.selectServiceModal.open()
    },
    openEditServiceModal () {
      this.$refs.editServiceModal.open()
    }
  }
}
</script>
