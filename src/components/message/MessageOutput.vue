<template>
  <Transition :duration="{ enter: 5500, leave: 5500 }" name="message">
    <div v-if="message.length > 1" class="message-box">
      <div class="message-text" v-html="message" />
    </div>
  </Transition>
</template>

<script>
export default {
  computed: {
    message () {
      return this.$store.message
    }
  }
}
</script>

<style scoped lang="scss">
.message-box, .message-text {
  position: absolute;
  top: 0px;
  left: 0px;
  padding: 3vw;
  width: 100%;
  height: 5vw;
  background: $primary;
}
.message-box {
  overflow: hidden;
}
.message-text {
  margin: auto;
  padding: 1.5vw;
  text-align: center;
  font-size: 3.4vw;
  letter-spacing: 0.01vw;
  color: #fff;
  width: 100%;
  max-width: 100%;
  line-height: 2.2vw;
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
/* transition message-box */
.message-enter-active, .message-leave-active {
  transition: all 1.5s ease-in-out;
  transform: translateY(0%);
}
/* delay leave of parent element */
.message-leave-active {
  transition-delay: 4.0s;
}

.message-enter-from,
.message-leave-to {
  transform: translateY(-100%);
}

/* transition message-text */
.message-enter-active .message-text,
.message-leave-active .message-text {
  transition: all 3.5s ease-in-out;
}
/* delay enter of message element */
.message-enter-active .message-text {
  transition-delay: 0.5s;
}

.message-enter-from .message-text {
  transform: translateX(200%);
}
.message-leave-to .message-text {
  transform: translateX(-100%);
}
</style>
