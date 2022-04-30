<template>
  <div class="beamer">
    <Transition name="q-transition--fade">
      <div v-if="!store.isClear" class="text">
        <div v-for="(line, i) in lines" :key="i">
          {{ line }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import useServiceStore from 'stores/service'

export default {
  setup () {
    const store = useServiceStore()
    return { store }
  },
  computed: {
    lines () {
      return this.store.selectedSection?.flat() || []
    }
  }
}
</script>

<style scoped>
.beamer {
  position: relative;
  background: url('../../assets/bg.png');
  background-size: cover;
  width: 100vw;
  height: 100vh;
  font-size: 1vw;
}

.text {
  position: absolute;
  top: 10%;
  width: 100%;
  text-align: center;

  color: white;
  font-size: 3.6em;
  font-weight: bold;
  -webkit-text-stroke: 0.05em black;
  line-height: 1.25em;
  letter-spacing: -0.01em;
}
</style>
