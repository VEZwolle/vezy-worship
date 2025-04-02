<template>
  <div class="col">
    <div>
      Output: OSC (Open Sound Control)<br><br>
      Onderstaand kunt u een afwijkend doel adres opgeven voor dit item in de setlist.<br>
      Wanneer niets ingevuld dan wordt de standaard gebruikt uit de algemene instellingen.<br><br>
    </div>
    <q-list dense bordered padding>
      <q-item-label header>Bestemmingen</q-item-label>

      <q-item v-for="(value, name) in settingsOsc" :key="name" clickable v-ripple>
        <q-item-section>
          <q-input v-model="settingsOsc[name]" :label="name" label-color="secondary" stack-label dense>
            <template #append>
              <q-icon v-if="value" name="cancel" class="cursor-pointer" @click="settingsOsc[name] = null" />
            </template>
          </q-input>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'OscSetting',
  props: {
    osc: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      settingsOsc: this.osc
    }
  }
})
</script>

<style scoped>
</style>
