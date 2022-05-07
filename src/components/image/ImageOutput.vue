<template>
  <div class="image" :style="style" />
</template>

<script>
export default {
  computed: {
    style () {
      return {
        backgroundImage: `url(${this.settings.url})`
      }
    }
  }
}
</script>

<style scoped>
.image {
  width: 100%;
  height: 100%;
  background-size: cover;
}
</style>
