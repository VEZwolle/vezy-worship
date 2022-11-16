<template>
  <q-btn
    v-if="!serviceTypes && !plans"
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
    color="secondary"
    square
    glossy
    padding="none"
    icon="keyboard_arrow_down"
    direction="down"
  >
    <template v-for="serviceType in serviceTypes" :key="serviceType.id">
      <q-fab-action
        padding="none"
        square
        glossy
        color="primary"
        :label="serviceType.attributes.name"
        @click="pcoServiceType(serviceType.id, serviceType.attributes.name)"
      />
    </template>
    <q-fab-action
      v-if="!serviceTypes"
      padding="none"
      square
      glossy
      color="primary"
      label="Dienst types inladen"
      @click="pcoServiceType('', 'Dienst type')"
    />
  </q-fab>
  <q-fab
    v-if="plans"
    v-model="plansShow"
    :label="plansLabel"
    vertical-actions-align="left"
    color="secondary"
    square
    glossy
    padding="none"
    icon="keyboard_arrow_down"
    direction="down"
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
  <q-list v-if="planItems" bordered class="pco-set-list">
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
        <q-item-section @dblclick="addPcoItemToService(index)">
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
  <!--
  <q-list v-if="teamMembers" bordered>
    <q-item v-ripple clickable>
      <q-item-section avatar>
        <q-checkbox />
      </q-item-section>
      <q-item-section avatar>
        <q-icon color="primary" name="short_text" />
      </q-item-section>
      <q-item-section>
        <q-item-label>
          {{ planTitle }}
        </q-item-label>
        <q-item-label caption>
          Spreker: {{ planPreacher }}
          Host: {{ planHost }}
          Aanbidding: {{ planWorshipLead }}
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item v-ripple clickable>
      <q-item-section avatar>
        <q-checkbox />
      </q-item-section>
      <q-item-section avatar>
        <q-icon color="primary" name="short_text" />
      </q-item-section>
      <q-item-section>
        <q-item-label>
          Host
        </q-item-label>
        <q-item-label caption>
          {{ planHost }}
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item v-ripple clickable>
      <q-item-section avatar>
        <q-checkbox />
      </q-item-section>
      <q-item-section avatar>
        <q-icon color="primary" name="short_text" />
      </q-item-section>
      <q-item-section>
        <q-item-label>
          Spreker
        </q-item-label>
        <q-item-label caption>
          {{ planPreacher }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
  -->
  <q-input
    v-model="pcoOutput"
    outlined
    label="pco"
    type="textarea"
  />
  <q-btn
    stack
    dense
    label="PCO Logout"
    :loading="isPcoLogoutLoading"
    @click="pcoLogout"
  />
  <q-inner-loading
    :showing="isPcoLoading"
    label="Bezig met laden..."
    label-class="text-teal"
    label-style="font-size: 1.1em"
  />
</template>

<script>
export default {
  props: {
    pcoId: String,
    theme: String,
    host: String,
    preacher: String,
    worshiplead: String,
    date: String,
    time: String,
    isNew: Boolean
  },
  emits: [
    'update:pcoId',
    'update:theme',
    'update:host',
    'update:preacher',
    'update:worshiplead',
    'update:date',
    'update:time'
  ],
  data () {
    return {
      pcoOutput: 'testwaarde',
      isPcoLoading: false,
      isPcoLogoutLoading: false,
      serviceTypes: '',
      serviceTypesShow: false, //                          default false                        | true
      serviceTypesLabel: '05 VEZ-hallen zondagochtend', // default: 05 VEZ-hallen zondagochtend | Dienst type
      serviceTypeId: '1150700', //                         default: 1150700                     | ''
      plans: '',
      plansShow: true,
      plansLabel: 'Datum dienst',
      planId: '55984013', // 55984013 // use for find this plan with serviceTypeId; do not use itemCount on the same time. | empty first plan of serviceTypeId will used
      itemCount: '',
      planItems: '',
      itemId: '',
      itemsNotes: '',
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
  created () {
    if (this.pcoId) {
      const i = this.pcoId.search('-')
      if (i > 1 && this.pcoId.length > i) {
        this.serviceTypeId = this.pcoId.substring(0, i)
        if (this.pcoId.length > i) {
          this.planId = this.pcoId.substring(i + 1)
        }
      }
    }
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
    async updateService () {
      this.$emit('update:pcoId', `${this.serviceTypeId}-${this.planId}`)
      this.$emit('update:date', this.planDate)
      this.$emit('update:time', this.planTime)
      this.$emit('update:theme', this.planTitle)
      this.$emit('update:host', this.planHost)
      this.$emit('update:preacher', this.planPreacher)
      this.$emit('update:worshiplead', this.planWorshipLead)
    },
    setDateTime (startDate) { // format: "2022-11-06T09:30:00Z"
      this.planDate = startDate.slice(0, 10).replaceAll('-', '/')
      this.planTime = startDate.slice(11, 16)
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
            title: pItems[i].attributes.title || '',
            description: pItems[i].attributes.description || '',
            html_details: pItems[i].attributes.html_details || '',
            import: this.isNew,
            type: itemtype
          })
        }
      }
      // htmlToText
      for (let i = 0; i < this.planItems.length; i++) {
        if (this.planItems[i].html_details) {
          this.planItems[i].html_details = this.planItems[i].html_details.replace(/(?: *<br\s*[/]?> *| *<[/]p> *)/gi, '\n').replace(/<[^>]*>/g, '')
          this.planItems[i].description = this.planItems[i].description.replace(/<[^>]*>/g, '')
        }
      }
    },
    planMembers () {
      this.planWorshipLead = ''
      this.planHost = ''
      this.planPreacher = ''
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
      this.pcoOutput = `ServiceType: ${this.serviceTypesLabel}<br>Datum: ${this.planDate}<br>Tijd: ${this.planTime}\nTitel: ${this.planTitle}\nAanbiddingsleider: ${this.planWorshipLead}\nHost: ${this.planHost}\nSpreker: ${this.planPreacher}\n`
    },
    async pcoServiceType (serviceTypeId, serviceTypeName) {
      this.itemId = ''
      this.planItems = ''
      this.teamMembers = ''
      this.planId = ''
      this.plans = ''
      this.plansShow = true
      this.serviceTypeId = serviceTypeId
      this.serviceTypesShow = serviceTypeId === ''
      this.serviceTypesLabel = serviceTypeName
      await this.pco()
    },
    onceFirstPlan () {
      if (!this.serviceTypes && this.plans) {
        this.pcoPlan(this.plans[0].id, this.plans[0].attributes.short_dates, this.plans[0].attributes.sort_date, this.plans[0].attributes.items_count, this.plans[0].attributes.title)
      }
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
      this.updateService()
    },
    async pco () {
      this.isPcoLoading = true

      try {
        // console.log(`serviceType: ${this.serviceTypeId}\nplan: ${this.planId}`)
        const result = await this.$api.post('/pco', {
          serviceType: this.serviceTypeId,
          plan: this.planId,
          itemCount: this.itemCount,
          item: this.itemId
        })
        // console.log(result.data)
        if (result.url) { // first login
          this.pcoOutput = result.url
          window.open(result.url, '_blank')
        } else { // get data from response
          if (typeof result.data.meta.count === 'undefined') {
            if (result.data.data.type === 'Plan') { // no array data --> one plan
              this.plans = [result.data.data] // use array so it is the same al more services get back.
              this.onceFirstPlan()
            } else if (this.planId && !this.itemCount) {
              this.$q.notify({ type: 'negative', message: `De dienst is niet gevonden in PCO (id: ${this.planId}).` })
              this.planId = ''
            } else { // notify | if perhapse her | no clou of the data came back
              this.$q.notify({ type: 'negative', message: 'Error PCO.' })
            }
          } else if (result.data.meta.count !== 0) {
            this.pcoOutput = result.data.data[0].id
            // return data diferent inputs
            if (this.itemId === 'team') { // return team_members
              this.teamMembers = result.data.data
              this.planMembers()
            } else if (this.itemId) { // return item notes
              this.itemsNotes = result.data.data // nog wijzigen nu elke keer overschreven
            } else if (this.planId) { // return items plan
              const pItems = result.data.data
              this.setPlanItems(pItems)
            } else if (this.serviceTypeId) { // return plans in future
              this.plans = result.data.data
              this.onceFirstPlan()
            } else { // returns serviceTypes
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
    },
    addPcoItemToService (id) {
      if (id < this.planItems.length) {
        switch (this.planItems[id].type) {
          case 'song' :
            this.$store.upsertPresentation({
              id: '', // `pcoSong${this.planItems[id].id}`,
              type: 'song',
              settings: {
                title: this.planItems[id].title,
                text: `${this.planItems[id].html_details}`,
                translation: '',
                fileId: null
              }
            })
            break
          case 'caption' :
            this.$store.upsertPresentation({
              id: '', // `pcoCapt${this.planItems[id].id}`,
              type: 'caption',
              settings: {
                title: this.planItems[id].title,
                text: `${this.planItems[id].description}${this.planItems[id].html_details}`
              }
            })
            break
          case 'scripture' :
            this.$store.upsertPresentation({
              id: '', // `pcoScri${this.planItems[id].id}`,
              type: 'scripture',
              settings: {
                bible: 'nbv21',
                book: 'GEN',
                chapter: null,
                verseFrom: null,
                verseTo: null,
                text: `${this.planItems[id].title}\n${this.planItems[id].description}${this.planItems[id].html_details}`
              }
            })
            break
          default :
            console.log(`error not found id:${this.planItems[id].id} type:${this.planItems[id].type}`)
            // type not found
        }
      }
    },
    addItems () {
      for (let i = 0; i < this.planItems.length; i++) {
        if (this.planItems[i].import) {
          this.addPcoItemToService(i)
        }
      }
    }
  }
}
</script>

<style scoped>
.pco-set-list {
  max-height: 60vh;
  overflow-y: scroll;
}

</style>
