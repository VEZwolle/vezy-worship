<template>
  <Transition :duration="{ enter: 5500, leave: 5500 }" name="message">
    <div v-if="show" class="messagebox">
      <div class="messagetext" v-html="message" />
    </div>
  </Transition>
  <button class="testbutton" @click="show = !show">
    Toggle
  </button>
</template>

<script>
export default {
  props: {
    message: String
  },
  data () {
    return {
      show: false
    }
  }
}
</script>

<style scoped lang="scss">
.messagebox, .messagetext {
  position: absolute;
  top: 0px;
  left: 0px;
  padding: 3vw;
  width: 100%;
  height: 5vw;
  background: $primary;
}

.messagetext {
  margin: auto;
  padding: 1.5vw;
  text-align: center;
  font-size: 3vw;
  letter-spacing: 0.01vw;
  color: #fff;
  width: 100%;
  max-width: 100%;
  line-height: 2.2vw;
}

.testbutton {
  position: absolute;
  top: 30%;
  left: 15%;
  width: 70%;
}

/* https://vuejs.org/guide/built-ins/transition.html#css-based-transitions */
/*
    Box komen: 1.5sec
    Text, wachten: 0.5sec
    Text komen: 3.5sec
    Actie; tijd instellen.
    Text gaan: 3.5sec
    Box wachten: 0.5sec --> 4.0sec instellen
    Box gaan: 1.5sec
    enter totaal: 5500
    leave totaal: 5500
*/
/* transition messagebox */
.message-enter-active, .message-leave-active {
  transition: all 1.5s ease-in-out;
}
/* delay leave of parent element */
.message-leave-active {
  transition-delay: 4.0s;
}

.message-enter-from,
.message-leave-to {
  transform: translateY(0%);
  opacity: 0;
}

/* transition messagetext */
.message-enter-active .messagetext,
.message-leave-active .messagetext {
  transition: all 3.5s ease-in-out;
}
/* delay enter of message element */
.message-enter-active .messagetext {
  transition-delay: 0.5s;
}

.message-enter-from .messagetext {
  transform: translateX(200%);
  /* opacity: 0.001; */
}
.message-leave-to .messagetext {
  transform: translateX(-100%);
  /* opacity: 0.001; */
}
</style>
