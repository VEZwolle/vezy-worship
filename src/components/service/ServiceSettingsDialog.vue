<template>
  <q-dialog ref="dialog" persistent square>
    <q-card :class="pcoDialog ? 'q-card-breed' : ''">
      <q-toolbar class="bg-secondary text-white">
        <q-toolbar-title>{{ isNew ? 'Nieuwe dienst' : 'Dienst bewerken' }}</q-toolbar-title>
        <q-btn v-close-popup flat round dense icon="close" />
      </q-toolbar>

      <q-separator />

      <div class="row">
        <div class="col">
          <q-card-section>
            <div class="row">
              <div class="col q-pr-md">
                <q-input v-model="service.date" label="Datum" mask="date" :rules="['date']">
                  <template #append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="service.date" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col q-pl-md">
                <q-input v-model="service.time" label="Starttijd" hint="Meerdere diensten achter elkaar? Gebruik de starttijd van de 1e dienst." mask="time" :rules="['time']" class="q-mb-sm">
                  <template #append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time v-model="service.time" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <q-input v-model="service.theme" label="Thema" :rules="['required']" />
            <q-input v-model="service.host" label="Host" :rules="['required']" />
            <q-input v-model="service.preacher" label="Spreker" :rules="['required']" />
            <q-input v-model="service.worshiplead" label="Aanbiddingsleider" :rules="['required']" />

            <div class="row">
              <q-file v-model="backgroundImageFile" accept="image/*" label="Achtergrondafbeelding" class="col" @update:model-value="updateBackgroundImage">
                <template #prepend>
                  <q-icon name="image" />
                </template>
                <template v-if="service.backgroundImageId" #append>
                  <q-icon name="cancel" class="cursor-pointer" @click="resetBackgroundImage" />
                </template>
              </q-file>
              <q-btn-dropdown v-if="imageIds.length && !isNew" :disable="!imageIds.length" flat>
                <q-list>
                  <q-item v-for="id in imageIds" :key="id" v-close-popup clickable @click="setMedia(id)">
                    <q-item-section>
                      <q-img :src="$store.getMediaUrl(id)" loading="lazy" fit="contain" height="8vh" width="16vh">
                        <q-tooltip>{{ id }}</q-tooltip>
                      </q-img>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>

            <img v-if="backgroundImageUrl" :src="backgroundImageUrl" class="full-width">
          </q-card-section>
        </div>
        <div v-show="pcoDialog" class="col">
          <Pco
            ref="pco"
            v-model:pcoId="service.pcoId"
            v-model:theme="service.theme"
            v-model:host="service.host"
            v-model:preacher="service.preacher"
            v-model:worshiplead="service.worshiplead"
            v-model:date="service.date"
            v-model:time="service.time"
            v-model:isNew="isNew"
          />
        </div>
      </div>

      <q-separator />

      <q-card-actions align="right">
        <q-btn v-if="!pcoDialog" color="secondary" label="Importeer PCO" icon="list" @click="pco(true)" />
        <q-btn v-else label="PCO Logout" icon="list" @click="pco(false)" />
        <q-btn color="secondary" label="Opslaan" icon="save" @click="save" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import dayjs from 'dayjs'
import Pco from './Pco.vue'

export default {
  components: { Pco },
  data () {
    return {
      service: null,
      backgroundImageFile: null,
      pcoDialog: false
    }
  },
  computed: {
    backgroundImageUrl () {
      return this.$store.getMediaUrl(this.service.backgroundImageId)
    },
    isNew () {
      return !this.service.id
    },
    imageIds () {
      return this.$store.getImageIds()
    }
  },
  methods: {
    show (service = null) {
      const defaults = {
        date: dayjs().day(7).format('YYYY/MM/DD'), // Next sunday
        time: '09:30',
        pcoId: ''
      }

      this.service = service || defaults

      // Check for changes from setlist
      if (!this.isNew) {
        const find = (id) => this.service.presentations.find(t => t.id === id)?.settings || {}

        this.service.time = find('countdown').time || this.service.time
        this.service.host = find('host').text?.replace(/<.+?>/g, '') || this.service.host
        this.service.preacher = find('preacher').text?.replace(/<.+?>/g, '') || this.service.preacher
        this.service.theme = find('info').title || this.service.theme
      }

      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    },
    updateBackgroundImage (file) {
      if (!file) {
        this.service.backgroundImageId = null
        return
      }
      this.service.backgroundImageId = this.$store.addMedia(file)
    },
    resetBackgroundImage () {
      this.backgroundImageFile = null
      this.service.backgroundImageId = null
    },
    setMedia (id) {
      this.backgroundImageFile = null
      this.service.backgroundImageId = id
    },
    save () {
      if (this.isNew) {
        this.$fs.fileHandle = null
        this.$store.cleanMedia(this.service.backgroundImageId, false)
      }
      this.$store.fillService(this.service)
      this.$refs.pco.addItems()
      this.hide()
    },
    pco (load) {
      if (load) {
        this.pcoDialog = true
        this.$refs.pco.pco()
      } else {
        this.$refs.pco.pcoLogout()
      }
    }
  }
}
</script>

<style scoped>
.q-card {
  min-width: 500px;
}
.q-card-breed {
  min-width: 1000px;
}
</style>
