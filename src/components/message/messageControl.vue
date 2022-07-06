<template>
  <div class="row">
    <q-input
      v-model="messagetext"
      placeholder="Mededeling"
      :dense="true"
      :hide-bottom-space="true"
      filled
      maxlength="60"
      class="messageinput"
    />
    <q-btn-dropdown
      split
      flat
      :label="buttontext"
      @click="showMessage"
    >
      <q-list>
        <q-item v-for="(message, index) in messageList" :key="index" v-close-popup clickable @click="messageFromList(index)">
          <q-item-section>
            <q-item-label>
              {{ message }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
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
        'gevraagd: extra BHV (melden bij kosters)',
        'Spoed:  verplaatsen ivm nooduitgang hulpdiensten!',
        'gevraagd: 2 tieners voor de Baby\'s',
        'gevraagd: 2 tieners voor de Lopers',
        'gevraagd: 2 tieners voor de Springers',
        'gevraagd: 2 tieners voor de Schaapjes',
        'gevraagd: 2 tieners voor de Gele groep',
        'gevraagd: 2 tieners voor de Groene groep',
        'gevraagd: 2 tieners voor de Paarse groep',
        'gevraagd: 2 tieners voor de Oranje groep'
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

<style scoped>
.messageinput {
  width: 20vw;
}
</style>
