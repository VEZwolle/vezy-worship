<template>
  <div>
    <q-tabs v-model="tab" class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator :breakpoint="0">
      <q-tab name="countdown" label="Aftelklok" />
      <q-tab name="background" label="Achtergrond" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="countdown">
        <q-card-section>
          <q-input v-model="settings.time" :label="types[settings.type].definition" outlined mask="time" :rules="['time']">
            <template #append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time v-model="settings.time" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-option-group
            v-model="settings.type"
            :options="types"
            color="primary"
            inline
          />
          <q-select
            v-model="settings.position"
            :options="positions"
            emit-value
            map-options
            label="Positie"
            outlined
          />
        </q-card-section>
      </q-tab-panel>
      <q-tab-panel name="background">
        <BackgroundSetting v-model:bgFileId="settings.bgFileId" v-model:bgOpacity="settings.bgOpacity" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import BaseSettings from '../presentation/BaseSettings.vue'
import BackgroundSetting from '../presentation/BackgroundSetting.vue'

export default {
  components: { BackgroundSetting },
  extends: BaseSettings,
  data () {
    return {
      tab: 'countdown',
      types: [
        {
          label: 'Aftelklok',
          value: 0,
          definition: 'Aftellen tot (weergave bij tijd in de toekomst op dezelfde dag)'
        },
        {
          label: 'Klok',
          value: 1,
          definition: 'Klok tot (weergave bij tijd in de toekomst op dezelfde dag)'
        }
      ],
      positions: [
        {
          label: 'Rechts onder (standaard)',
          value: 'RO'
        },
        {
          label: 'Links onder',
          value: 'LO'
        },
        {
          label: 'Links boven',
          value: 'LB'
        },
        {
          label: 'Rechts boven',
          value: 'RB'
        }
      ]
    }
  },
  created () {
    if (!this.settings.time) {
      this.settings.time = this.$store.service.time
    }
    if (this.settings.type === undefined) {
      this.settings.type = 0
    }
  }
}
</script>
