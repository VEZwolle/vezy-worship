<template>
  <q-select
    v-model="messagetext"
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
    class="messageinput"
    @filter="updateMessage"
  >
    <template #append>
      <q-btn
        color="white"
        flat
        dense
        round
        :label="buttontext"
        :disabled="!messagetext"
        @click.stop="showMessage"
      >
        <q-tooltip v-if="$store.messageShow">
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
      messagetext: '',
      buttontext: '',
      time: 0,
      buttondefault: '➤',
      timedefault: 15,
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
  created () {
    this.buttontext = this.buttondefault
    this.time = this.timedefault
  },
  methods: {
    messageFromList (id) {
      this.messagetext = this.messageList[id]
    },
    updateMessage (text, update) {
      update(() => {
        if (!text) {
          return
        }

        this.messagetext = text
      })
    },
    showMessage () {
      if (this.buttontext === this.buttondefault && this.messagetext.length > 1) {
        this.$store.messageShow = this.messagetext
        this.ticker = setInterval(this.tick, 1000)
        this.tick()
        if (this.messageList.includes(this.messagetext) === false) {
          this.messageList.push(this.messagetext)
        }
        this.messagetext = ''
      } else if (this.buttontext !== this.buttondefault) {
        this.hideMessage()
      }
    },
    tick () {
      if (this.time > 0) {
        this.buttontext = this.time // 'Stop ( ' + this.time + ' sec)'
        this.time--
      } else {
        this.hideMessage()
      }
    },
    hideMessage () {
      clearInterval(this.ticker)
      this.$store.messageShow = ''
      this.time = this.timedefault
      this.buttontext = this.buttondefault
    }
  }
}
</script>

<style lang="scss">
.messageinput {
  width: 25vw;

  input {
    color: #fff;
  }
}
</style>
