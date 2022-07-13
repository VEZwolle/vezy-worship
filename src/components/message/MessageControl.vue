<template>
  <q-select
    v-model="messageText"
    :options="messageList"
    dense
    options-dense
    standout="bg-primary"
    hide-selected
    hide-dropdown-icon
    use-input
    fill-input
    :input-debounce="0"
    placeholder="Mededeling"
    class="message-input"
    @filter="updateMessage"
  >
    <template #append>
      <q-btn
        color="white"
        flat
        dense
        round
        :label="buttonText"
        :disabled="!messageText && !isMessageActive"
        @click.stop="toggleMessage"
      >
        <q-tooltip v-if="$store.message">
          Klik om mededeling te verbergen
        </q-tooltip>
      </q-btn>
    </template>
  </q-select>
</template>

<script>
export default {
  data () {
    return {
      messageText: '',
      time: 0,
      timeDefault: 15,
      messageList: [
        'Gevraagd: extra BHV (melden bij kosters)',
        'Spoed: verplaatsen i.v.m. nooduitgang hulpdiensten!',
        'Gevraagd: 2 tieners voor de Baby\'s',
        'Gevraagd: 2 tieners voor de Lopers',
        'Gevraagd: 2 tieners voor de Springers',
        'Gevraagd: 2 tieners voor de Schaapjes',
        'Gevraagd: 2 tieners voor de Gele groep',
        'Gevraagd: 2 tieners voor de Groene groep',
        'Gevraagd: 2 tieners voor de Paarse groep',
        'Gevraagd: 2 tieners voor de Oranje groep'
      ]
    }
  },
  computed: {
    isMessageActive () {
      return this.$store.message !== ''
    },
    buttonText () {
      return this.isMessageActive ? this.time : '➤'
    }
  },
  created () {
    this.time = this.timeDefault
  },
  methods: {
    updateMessage (text, update) {
      update(() => {
        if (!text) {
          return
        }
        this.messageText = text
      })
    },
    toggleMessage () {
      if (this.isMessageActive) {
        this.hideMessage()
        return
      }

      this.$store.message = this.messageText

      this.ticker = setInterval(this.tick, 1000)
      this.tick()

      if (!this.messageList.includes(this.messageText)) {
        this.messageList.push(this.messageText)
      }

      this.messageText = ''
    },
    tick () {
      if (this.time > 0) {
        this.time--
      } else {
        this.hideMessage()
      }
    },
    hideMessage () {
      clearInterval(this.ticker)
      this.$store.message = ''
      this.time = this.timeDefault
    }
  }
}
</script>

<style lang="scss">
.message-input {
  width: 25vw;

  input {
    color: #fff;
  }
}
</style>
