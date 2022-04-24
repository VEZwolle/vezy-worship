<template>
  <Modal ref="modal">
    Testje
  </Modal>
</template>

<script>
export default {
  methods: {
    open () {
      this.$refs.modal.open()
    }
  }
}
</script>
