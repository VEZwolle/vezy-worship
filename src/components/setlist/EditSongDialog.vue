<template>
  <q-dialog ref="dialog" square>
    <q-card>
      <q-toolbar class="bg-secondary text-white">
        <q-toolbar-title>Lied aanpassen</q-toolbar-title>
        <q-btn v-close-popup flat round dense icon="close" />
      </q-toolbar>

      <q-card-section>
        <q-input v-model="song.title" outlined label="Titel" stack-label :rules="['required']" />

        <div class="row">
          <div class="col">
            <q-input v-model="song.text" outlined label="Tekst" stack-label type="textarea" class="input-songtext" />
          </div>
          <div class="col" />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn color="secondary" label="Opslaan" icon="save" @click="save" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import useServiceStore from 'stores/service'

export default {
  setup () {
    const store = useServiceStore()
    return { store }
  },
  data () {
    return {
      song: {}
    }
  },
  computed: {
    editorToolbar () {
      return [
        ['bold', 'italic', 'underline'],
        ['undo', 'redo']
      ]
    }
  },
  methods: {
    show () {
      this.$refs.dialog.show()
      this.song = {
        title: '',
        text: ''
      }
    },
    hide () {
      this.$refs.dialog.hide()
    },
    async save () {
      this.store.service.songs.push(this.song)
      this.hide()
    }
  }
}
</script>

<style scoped>
.q-card {
  min-width: 60vw;
  min-height: 80vh;
}

.input-songtext >>> textarea {
  height: 60vh;
}
</style>
