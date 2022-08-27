<template>
  <q-dialog ref="dialog" persistent square>
    <q-card>
      <q-toolbar class="bg-secondary text-white">
        <q-toolbar-title>{{ isNew ? 'Nieuwe dienst' : 'Dienst bewerken' }}</q-toolbar-title>
        <q-btn v-close-popup flat round dense icon="close" />
      </q-toolbar>

      <q-card-section>
        <q-input v-model="service.date" label="Datum" mask="date" :rules="['date']">
          <template #append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="service.date" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input v-model="service.time" label="Starttijd" hint="Meerdere diensten achter elkaar? Gebruik de starttijd van de 1e dienst." mask="time" :rules="['time']" class="q-mb-sm">
          <template #append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="service.time" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input v-model="service.host" label="Host" placeholder="Bijv. Cor van den Belt" :rules="['required']" />
        <q-input v-model="service.preacher" label="Spreker" placeholder="Bijv. Olaf ten Napel" :rules="['required']" />

        <q-file v-model="backgroundImageFile" accept="image/*" label="Achtergrondafbeelding" @update:model-value="updateBackgroundImage">
          <template #prepend>
            <q-icon name="image" />
          </template>
        </q-file>

        <img v-if="backgroundImageUrl" :src="backgroundImageUrl" class="full-width">
      </q-card-section>

      <div class="image-default">
        Toevoegen{{ !isNew ? ' of herstellen' : '' }} standaard sheets:<br>
        <q-checkbox key="nazorg" v-model="service.nazorg" right-label dense label="Nazorg " />
        <q-checkbox key="collecte" v-model="service.collecte" right-label dense label="Collecte " />
        <q-checkbox key="end" v-model="service.end" right-label dense label="Einde dienst / Gezegende Zondag" />
      </div>

      <q-separator />

      <q-card-actions align="right">
        <q-btn color="secondary" label="Opslaan" icon="save" @click="save" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import dayjs from 'dayjs'

export default {
  data () {
    return {
      service: null,
      backgroundImageFile: null
    }
  },
  computed: {
    backgroundImageUrl () {
      return this.$store.media[this.service.backgroundImageId]
    },
    isNew () {
      return !this.service.id
    }
  },
  methods: {
    show (service = null) {
      const defaults = {
        date: dayjs().day(7).format('YYYY/MM/DD'), // Next sunday
        time: '09:30',
        nazorg: false,
        collecte: false,
        end: false
      }

      this.service = service || defaults

      // Check for changes from setlist
      if (!this.isNew) {
        const find = (id) => this.service.presentations.find(t => t.id === id)?.settings || {}

        this.service.time = find('countdown').time || this.service.time
        this.service.host = find('host').text || this.service.host
        this.service.preacher = find('preacher').text || this.service.preacher
        this.service.nazorg = false
        this.service.collecte = false
        this.service.end = false
      }

      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    },
    updateBackgroundImage (file) {
      this.service.backgroundImageId = this.$store.addMedia(file)
    },
    save () {
      this.$store.fillService(this.service)

      this.hide()
    }
  }
}
</script>

<style scoped>
.q-card {
  min-width: 500px;
}
.image-default {
  padding: 5px 20px 5px 20px;
}
</style>
