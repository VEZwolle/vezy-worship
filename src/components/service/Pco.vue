<template>
  <q-btn
    stack
    dense
    color="primary"
    label="PCO Logout"
    :loading="isPcoLogoutLoading"
    @click="pcoLogout"
  />
  <q-btn
    v-if="!serviceTypes"
    stack
    dense
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
    square
    glossy
    padding="none"
    icon="keyboard_arrow_down"
    direction="down"
    :loading="isPcoLoading"
  >
    <template v-for="serviceType in serviceTypes" :key="serviceType.id">
      <q-fab-action
        padding="none"
        square
        glossy
        color="secondary"
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
    square
    glossy
    padding="none"
    icon="keyboard_arrow_down"
    direction="down"
    :loading="isPcoLoading"
  >
    <template v-for="plan in plans" :key="plan.id">
      <q-fab-action
        padding="none"
        square
        glossy
        color="secondary"
        :label="plan.attributes.dates"
        @click="pcoPlan(plan.id, plan.attributes.short_dates, plan.attributes.sort_date, plan.attributes.items_count, plan.attributes.title)"
      />
    </template>
  </q-fab>
  <q-list v-if="planItems" bordered>
    <template v-for="(item, index) in planItems" :key="index">
      <q-item v-ripple clickable>
        <q-item-section avatar>
          <q-checkbox v-model="planItems[index].import" />
        </q-item-section>
        <q-item-section avatar>
          <q-icon v-if="item.type === 'song'" color="blue" name="music_note" @click="toggleImportType(index)" />
          <q-icon v-else-if="item.type === 'caption'" color="primary" name="short_text" @click="toggleImportType(index)" />
          <q-icon v-else color="brown" name="menu_book" @click="toggleImportType(index)" />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            {{ item.title }}
          </q-item-label>
          <q-item-label overline lines="2">
            {{ item.description }}
          </q-item-label>
          <q-item-label caption lines="2">
            {{ item.html_details }}
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
      serviceTypeId: '', // default: 1150700 "05 VEZ-hallen zondagochtend"
      plans: '',
      plansShow: true,
      plansLabel: 'Datum dienst',
      planId: '',
      itemCount: '',
      planItems: '',
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
    toggleImportType (index) {
      switch (this.planItems[index].type) {
        case 'song' :
          this.planItems[index].type = 'caption'
          break
        case 'caption' :
          this.planItems[index].type = 'scripture'
          break
        case 'scripture' :
        default :
          this.planItems[index].type = 'song'
      }
    },
    setDateTime (startDate) { // format: "2022-11-06T09:30:00Z"
      this.planDate = startDate.slice(0, 10).replaceAll('-', '/')
      this.planTime = startDate.slice(11, 16)
    },
    htmlToText () {
      for (let i = 0; i < this.planItems.length; i++) {
        if (this.planItems[i].html_details) {
          this.planItems[i].html_details = this.planItems[i].html_details.replace(/(?:<br\s*[/]?>|<[/]p>)/g, '\n').replace(/<[^>]*>/g, '')
        } else { // replace null with ''
          this.planItems[i].html_details = ''
        }
      }
    },
    setPlanItems (pItems) {
      this.planItems = []
      for (let i = 0; i < pItems.length; i++) {
        if (pItems[i].attributes.service_position === 'during' && (pItems[i].attributes.item_type === 'item' || pItems[i].attributes.item_type === 'song')) {
          let itemtype = 'song'
          if (!pItems[i].attributes.html_details) {
            itemtype = 'caption'
          }
          this.planItems.push({
            id: pItems[i].id,
            title: pItems[i].attributes.title,
            description: pItems[i].attributes.description,
            html_details: pItems[i].attributes.html_details,
            import: true,
            type: itemtype
          })
        }
      }
      this.htmlToText()
    },
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
      if (this.planPreacher === '') { this.planPreacher = this.planTitle }
      this.pcoOutput = `ServiceType: ${this.serviceTypesLabel}\nDatum: ${this.planDate}\nTijd: ${this.planTime}\nTitel: ${this.planTitle}\nAanbiddingsleider: ${this.planWorshipLead}\nHost: ${this.planHost}\nSpreker: ${this.planPreacher}\n`
    },
    async pcoServiceType (serviceTypeId, serviceTypeName) {
      this.itemId = ''
      this.planItems = ''
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
      this.planItems = ''
      this.teamMembers = ''
      this.planId = planid
      this.itemCount = planItemsCount
      // this.planDate = planDate // "2022-11-06T09:30:00Z"
      this.setDateTime(planDate)
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
          console.log(result.data)
          if (result.data.meta.count !== 0) {
            this.pcoOutput = result.data.data[0].id
            // return data diferent inputs
            if (this.itemId === 'team') { // return team_members
              // console.log('--team members--')
              // console.log(result.data.data)
              this.teamMembers = result.data.data
              this.planMembers()
            } else if (this.itemId) { // return item notes
              // console.log('--item notes--')
              // console.log(result.data.data)
              this.itemsnotes = result.data.data // nog wijzigen nu elke keer overschreven
            } else if (this.planId) { // return items plan
              // console.log('--items--')
              // console.log(result.data.data)
              const pItems = result.data.data
              this.setPlanItems(pItems)
            } else if (this.serviceTypeId) { // return plans in future
              // console.log('--plans--')
              // console.log(result.data.data)
              this.plans = result.data.data
            } else { // returns serviceTypes
              // console.log('--serviceTypes--')
              // console.log(result.data.data)
              this.serviceTypes = result.data.data
            }
          } else { // no data --> error message
            if (this.itemId === 'team') { // return team_members
              this.$q.notify({ type: 'negative', message: 'Er zijn geen ingeplande mensen gevonden voor de dienst in PCO.' })
              this.itemId = ''
            } else if (this.itemId) { // return item notes
              this.$q.notify({ type: 'negative', message: `Er zijn geen aanvullende onderdeelgegevens gevonden in PCO (id: ${this.itemId}).` })
              this.itemId = ''
            } else if (this.planId) { // return items plan
              this.$q.notify({ type: 'negative', message: `Er zijn geen onderdelen van de dienst gevonden in PCO (id: ${this.plansLabel}).` })
              this.planId = ''
            } else if (this.serviceTypeId) { // return plans in future
              this.$q.notify({ type: 'negative', message: `Er zijn geen toekomstige dienst gevonden in PCO (id: ${this.serviceTypesLabel}).` })
              this.serviceTypeId = ''
            } else { // returns serviceTypes
              this.$q.notify({ type: 'negative', message: 'Er zijn geen dienst typen gevonden in PCO.' })
            }
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
