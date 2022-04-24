<template>
  <Modal ref="modal" title="Nieuwe dienst">
    <template #header>
      Vul onderstaande gegevens in om een nieuwe dienst aan te maken.
    </template>

    <div class="space-y-4 p-6">
      <Input v-model="service.date" type="date" name="Datum" />
      <Input v-model="service.theme" name="Thema" />
      <Input v-model="service.preacher" name="Spreker" placeholder="Bijv. Olaf ten Napel" />
      <Input v-model="service.host" name="Host" placeholder="Bijv. Cor van den Belt" />
    </div>

    <template #footer>
      <Button secondary @click="close">
        Annuleren
      </Button>
      <Button class="ml-2" :click="save">
        Dienst aanmaken
      </Button>
    </template>
  </Modal>
</template>

<script>
import useStore from '@/store'

export default {
  setup () {
    const store = useStore()
    return { store }
  },
  data () {
    return {
      service: {}
    }
  },
  methods: {
    open () {
      this.$refs.modal.open()
    },
    close () {
      this.$refs.modal.close()
    },
    async save () {
      const { id } = await this.$api.post('/services', this.service)
      this.store.loadService(id)
      this.close()
    }
  }
}
</script>
