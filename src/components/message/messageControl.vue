<template>
  <div class="row">
    <q-input
      v-model="messagetext"
      filled
      placeholder="Mededeling text"
      :dense="dense"
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
      buttondefault: 'Weergeven',
      timedefault: 15,
      messageList: [
        'bericht 0',
        'bericht 1',
        'bericht 2'
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
        this.messagetext = ''
        this.ticker = setInterval(this.tick, 1000)
        this.tick()
      } else if (this.buttontext !== this.buttondefault) {
        this.hideMessage()
      }
    },
    tick () {
      if (this.time > 0) {
        this.buttontext = 'Stop ( ' + this.time + ' sec)'
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
  background-color: #fff;
  color: #000;
  width: 20vw;
  height: 2vw;
}
</style>
