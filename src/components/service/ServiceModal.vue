<template>
  <Modal ref="modal" title="Nieuwe dienst">
    <template #header>
      Vul onderstaande gegevens in om een nieuwe dienst aan te maken.
    </template>

    <Input v-model="service.preacher" name="Spreker" placeholder="Bijv. Olaf ten Napel" />
    <Input v-model="service.host" name="Host" placeholder="Bijv. Cor van den Belt" />

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
export default {
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
      await this.$api.post('/services', this.service)
      this.close()
    }
  }
}
</script>
