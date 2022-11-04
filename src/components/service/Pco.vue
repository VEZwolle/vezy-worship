<template>
  <q-btn
    stack
    label="PCO Logout"
    :loading="isPcoLogoutLoading"
    @click="pcoLogout"
  />
  <q-btn
    v-if="!serviceTypes"
    stack
    color="primary"
    label="PCO Login / Gegevens ophalen"
    :loading="isPcoLoading"
    @click="pco"
  />
  <q-fab
    v-else
    v-model="serviceTypesShow"
    :label="serviceTypesLabel"
    vertical-actions-align="left"
    color="primary"
    padding="none xl"
    icon="keyboard_arrow_down"
    direction="down"
    :loading="isPcoLoading"
  >
    <template v-for="serviceType in serviceTypes" :key="serviceType.id">
      <q-fab-action
        padding="5px"
        external-label
        color="primary"
        :label="serviceType.attributes.name"
        @click="pcoServiceType(serviceType.id, serviceType.attributes.name)"
      />
    </template>
  </q-fab>
  <br>
  <q-fab
    v-if="plans"
    v-model="plansShow"
    :label="plansLabel"
    vertical-actions-align="left"
    color="primary"
    padding="none xl"
    icon="keyboard_arrow_down"
    direction="down"
    :loading="isPcoLoading"
  >
    <template v-for="plan in plans" :key="plan.id">
      <q-fab-action
        padding="5px"
        external-label
        color="primary"
        :label="plan.attributes.dates"
        @click="pcoPlan(plan.id, plan.attributes.short_dates, plan.attributes.sort_date, plan.attributes.items_count, plan.attributes.title)"
      />
    </template>
  </q-fab>
  <q-list v-if="items" bordered>
    <template v-for="item in items" :key="item.id">
      <q-item v-if="item.attributes.service_position === 'during' && item.attributes.item_type === 'item'" v-ripple clickable>
        <q-item-section avatar>
          <q-icon color="primary" name="music_note" />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            {{ item.attributes.title }}
          </q-item-label>
          <q-item-label overline>
            {{ item.attributes.description }}
          </q-item-label>
          <q-item-label caption lines="5">
            {{ item.attributes.html_details }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-list>
  <q-input
    v-model="pcoOutput"
    outlined
    label="pco"
    type="textarea"
  />
</template>

<script>
export default {
  data () {
    return {
      pcoOutput: 'testwaarde',
      isPcoLoading: false,
      isPcoLogoutLoading: false,
      serviceTypes: '',
      serviceTypesShow: true,
      serviceTypesLabel: 'Dienst type',
      serviceTypeId: '', // 1150700 "05 VEZ-hallen zondagochtend"
      plans: '',
      plansShow: true,
      plansLabel: 'Datum dienst',
      planId: '',
      itemCount: '',
      items: '',
      itemId: '',
      itemsnotes: '',
      teamMembers: '',
      planDate: '',
      planTime: '',
      planTitle: '',
      planHost: '',
      planPreacher: '',
      planWorshipLead: ''
    }
  },
  computed: {
  },
  methods: {
    planMembers () {
      for (let i = 0; i < this.teamMembers.length; i++) {
        if (this.teamMembers[i].attributes.status !== 'D') { // D = Declined
          switch (this.teamMembers[i].attributes.team_position_name) {
            /**
             * Floormanager
             * 01 Coördinator van dienst
             * 05 Oudste van Dienst
             */
            case 'Aanbiddingsleider':
              this.planWorshipLead = this.teamMembers[i].attributes.name
              break
            case '02 Host':
              this.planHost = this.teamMembers[i].attributes.name
              break
            case '03 Spreker':
              this.planPreacher = this.teamMembers[i].attributes.name
              break
            default:
              // skip
          }
        }
      }
      this.pcoOutput = `ServiceType: ${this.serviceTypesLabel}\nDatum: ${this.planDate}\nTitel: ${this.planTitle}\nAanbiddingsleider: ${this.planWorshipLead}\nHost: ${this.planHost}\nSpreker: ${this.planPreacher}\n`
    },
    async pcoServiceType (serviceTypeId, serviceTypeName) {
      this.itemId = ''
      this.items = ''
      this.teamMembers = ''
      this.planId = ''
      this.plans = ''
      this.plansShow = true
      this.serviceTypeId = serviceTypeId
      this.serviceTypesShow = false
      this.serviceTypesLabel = serviceTypeName
      await this.pco()
    },
    async pcoPlan (planid, planDates, planDate, planItemsCount, planTitle) {
      this.itemId = ''
      this.items = ''
      this.teamMembers = ''
      this.planId = planid
      this.itemCount = planItemsCount
      this.planDate = planDate // "2022-11-06T09:30:00Z"
      this.plansLabel = planDates
      this.planTitle = planTitle
      this.plansShow = false
      await this.pco() // get items
      this.itemId = 'team'
      await this.pco() // get teammembers
    },
    async pco () {
      this.isPcoLoading = true

      try {
        const result = await this.$api.post('/pco', {
          serviceType: this.serviceTypeId,
          plan: this.planId,
          itemCount: this.itemCount,
          item: this.itemId
        })
        if (result.URL) { // first login
          this.pcoOutput = result.URL
          window.open(result.URL, '_blank')
        } else { // get data from response
          this.pcoOutput = result.data.data[0].id
          // return data diferent inputs
          if (this.itemId === 'team') { // return team_members
            console.log('--team members--')
            console.log(result.data.data)
            this.teamMembers = result.data.data
            this.planMembers()
          } else if (this.itemId) { // return item notes
            console.log('--item notes--')
            console.log(result.data.data)
            this.itemsnotes = result.data.data // nog wijzigen nu elke keer overschreven
          } else if (this.planId) { // return items plan
            console.log('--items--')
            console.log(result.data.data)
            this.items = result.data.data
          } else if (this.serviceTypeId) { // return plans in future
            console.log('--plans--')
            console.log(result.data.data)
            this.plans = result.data.data
          } else { // returns serviceTypes
            console.log('--serviceTypes--')
            console.log(result.data.data)
            this.serviceTypes = result.data.data
          }
        }
      } catch {
        this.$q.notify({ type: 'negative', message: 'Er is iets fout gegaan met PCO. Probeer het later opnieuw.' })
      } finally {
        this.isPcoLoading = false
      }
    },

    async pcoLogout () {
      this.isPcoLogoutLoading = true

      try {
        const result = await this.$api.get('/pco/auth/logout')
        if (result.logout) {
          this.$q.notify({ type: 'positive', message: 'Uitgelogd bij PCO.' })
        } else { // fout
          this.$q.notify({ type: 'negative', message: 'Er is iets fout gegaan met uitloggen bij PCO. Probeer het later opnieuw.' })
        }
      } catch {
        this.$q.notify({ type: 'negative', message: 'Er is iets fout gegaan met uitloggen bij PCO. Probeer het later opnieuw.' })
      } finally {
        this.isPcoLogoutLoading = false
      }
    }
  }
}
</script>

<style scoped>
</style>
