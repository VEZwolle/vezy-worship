<template>
  <div class="livestream" :class="{ alpha }">
    <Transition name="q-transition--fade">
      <div v-if="!store.isClear" class="text">
        <div v-for="(line, i) in store.selectedSlide" :key="i">
          {{ line }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import useServiceStore from 'stores/service'

export default {
  props: {
    alpha: Boolean
  },
  setup () {
    const store = useServiceStore()
    return { store }
  }
}
</script>

<style scoped>
.livestream {
  position: relative;
  background: black;
  width: 100vw;
  height: 100vh;
  font-size: 1vw;
  cursor: none;
}

.text {
  position: absolute;
  bottom: 5%;
  width: 100%;
  text-align: center;

  color: white;
  font-size: 3em;
  font-weight: bold;
  -webkit-text-stroke: 0.05em black;
  line-height: 1.1em;
}

.alpha .text {
  -webkit-text-stroke-color: white;
}
</style>
