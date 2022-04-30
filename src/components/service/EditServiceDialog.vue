<template>
  <q-dialog ref="dialog" square>
    <q-card>
      <q-card-section class="bg-secondary text-white">
        <div class="text-h6">
          Nieuwe dienst
        </div>
        <div class="text-subtitle2">
          Vul onderstaande gegevens in om een nieuwe dienst aan te maken.
        </div>
      </q-card-section>

      <q-card-section>
        <q-input v-model="service.date" label="Datum" stack-label mask="date" :rules="['date']">
          <template #append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="service.date" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input v-model="service.time" label="Starttijd" stack-label hint="Meerdere diensten achter elkaar? Gebruik de starttijd van de 1e dienst." mask="time" :rules="['time']">
          <template #append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="service.time" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input v-model="service.host" label="Host" placeholder="Bijv. Cor van den Belt" stack-label :rules="['required']" />
        <q-input v-model="service.preacher" label="Spreker" placeholder="Bijv. Olaf ten Napel" stack-label :rules="['required']" />
        <q-input v-model="service.theme" label="Thema" stack-label prefix="“" suffix="”" :rules="['required']" />
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn color="secondary" label="Opslaan" icon="save" :loading="isSaving" @click="save" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import useServiceStore from 'stores/service'
import dayjs from 'dayjs'

export default {
  setup () {
    const store = useServiceStore()
    return { store }
  },
  data () {
    const nextSunday = dayjs().day(7).format('YYYY/MM/DD')

    return {
      service: {
        date: nextSunday,
        time: '09:30',
        songs: []
      },
      isSaving: false
    }
  },
  methods: {
    show () {
      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    },
    async save () {
      this.isSaving = true

      this.$api.post('/services', this.service)
        .then(({ id }) => {
          this.store.loadService(id)
          this.hide()
        })
        .finally(() => {
          this.isSaving = false
        })
    }
  }
}
</script>
