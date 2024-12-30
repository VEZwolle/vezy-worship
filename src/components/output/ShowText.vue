<template>
  <div class="bg-primary base">
    {{ $route.params.nr }}
  </div>
</template>

<script>
// used for show display nr in electron
export default {
}
</script>

<style scoped lang="scss">
.base {
  user-select: none;
  position: relative;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center;
  color: white;
  text-align: center;
  font-size: 50vh;
  line-height: 50vh;
  padding-top: 25vh;
}
</style>
