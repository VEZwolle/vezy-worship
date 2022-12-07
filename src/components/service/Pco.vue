<template>
  <q-card-section>
    <q-icon name="list" color="primary" size="3vh" />
    Planning center online:<br>
    <q-btn
      v-if="!serviceTypes && !plans"
      stack
      dense
      color="primary"
      label="Login / Gegevens ophalen"
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
          color="secondary"
          :label="serviceType.attributes.name"
          @click="pcoServiceType(serviceType.id, serviceType.attributes.name)"
        />
      </template>
      <q-fab-action
        v-if="!serviceTypes"
        padding="none"
        square
        glossy
        color="secondary"
        label="Dienst types inladen"
        @click="pcoServiceType('', 'Dienst type')"
      />
      <q-fab-action
        v-if="serviceTypeId"
        padding="none"
        square
        glossy
        color="secondary"
        label="diensten dmv PCO id inladen uit actief service type"
        @click="askPcoPlanId()"
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
      <q-fab-action
        v-if="plans.length <= 1"
        padding="none"
        square
        glossy
        color="secondary"
        label="diensten inladen (toekomst)"
        @click="pcoServiceType(serviceTypeId , serviceTypesLabel)"
      />
      <q-fab-action
        padding="none"
        square
        glossy
        color="secondary"
        label="diensten dmv PCO id inladen"
        @click="askPcoPlanId()"
      />
    </q-fab>
    <div v-if="teamMembers">
      <q-toolbar class="q-py-none bg-primary text-white">
        <q-toolbar-title>Algemene gegevens</q-toolbar-title>
        <q-btn stack dense color="primary" label="← Update gegevens" @click="addPlanGlobal()">
          <q-tooltip>Algemene gegevens updaten</q-tooltip>
        </q-btn>
      </q-toolbar>
      <q-list bordered dense>
        <template v-for="(item, index) in planGlobal" :key="index">
          <q-item v-ripple clickable>
            <q-item-section @dblclick="addPlanGlobal(index)">
              <q-item-label>
                {{ item.name }}: {{ item.value }}
              </q-item-label>
              <q-tooltip>Dubbelklik om te updaten</q-tooltip>
            </q-item-section>
            <q-item-section avatar>
              <q-icon color="grey" :name="planGlobal[index].import ? 'task_alt' : 'highlight_off'" />
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </div>
    <div v-if="planItems && !isPcoItemsLoading">
      <q-toolbar class="q-py-none bg-primary text-white">
        <q-toolbar-title shrink>
          Onderdelen
        </q-toolbar-title>
        <q-tooltip>Selectie wordt geimporteerd</q-tooltip>
      </q-toolbar>
      <q-list bordered class="pco-set-list">
        <template v-for="(item, index) in planItems" :key="index">
          <q-item v-ripple clickable>
            <q-item-section avatar>
              <q-checkbox v-model="planItems[index].import" />
              <q-tooltip>Geselecteerd wordt geimporteerd</q-tooltip>
            </q-item-section>
            <q-item-section avatar>
              <q-icon v-if="item.type === 'song'" color="blue" name="music_note" @click="toggleImportType(index)" />
              <q-icon v-else-if="item.type === 'caption'" color="primary" name="short_text" @click="toggleImportType(index)" />
              <q-icon v-else color="brown" name="menu_book" @click="toggleImportType(index)" />
              <q-tooltip>Wijzig type onderdeel</q-tooltip>
            </q-item-section>
            <q-item-section @dblclick="addPcoItemToService(index)">
              <q-item-label>{{ item.title }}</q-item-label>
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
      <div class="bg-grey-2 rounded-borders q-px-md">
        aan/uit:
        <template v-for="(type, index) in itemTypesSelect" :key="index">
          <q-checkbox v-model="itemTypesSelect[index].selected" :label="type.label" @click="togglePlanItems(type.type, type.selected)" />
        </template>
      </div>
    </div>
  </q-card-section>
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
      // dienst met song + tekst: 1043892 | 48347531 of 50034522 of 48080844
      // dienst met song + geen tekst: 1043892 | 50034546
      isPcoLoading: false,
      isPcoItemsLoading: false,
      serviceTypes: '', // array of serviceTypes
      serviceTypesShow: false, // collaps dropdownbox      default false                        | true
      serviceTypesLabel: '05 VEZ-hallen zondagochtend', // default: 05 VEZ-hallen zondagochtend | Dienst type
      serviceTypeId: '1150700', //                         default: 1150700                     | ''
      plans: '', // array op plans
      plansShow: true, // collaps dropdownbox
      plansLabel: 'Datum dienst', // label dropdownbox
      planId: '', // use for find this plan with serviceTypeId; do not use itemCount & itemId on the same time. | empty first plan of serviceTypeId will used
      itemCount: '', // count items of plan
      planItems: '', // array of plan items
      itemId: '',
      itemsNotes: '', // array of item notes
      teamMembers: '', // array of teammembers
      planDate: '',
      planTime: '',
      planGlobal: [
        {
          id: 'planTitle',
          name: 'Thema',
          import: this.isNew,
          value: ''
        },
        {
          id: 'planHost',
          name: 'Host',
          import: this.isNew,
          value: ''
        },
        {
          id: 'planPreacher',
          name: 'Spreker',
          import: this.isNew,
          value: ''
        },
        {
          id: 'planWorshipLead',
          name: 'Aanbiddingsleider',
          import: this.isNew,
          value: ''
        }
      ],
      itemTypesSelect: [
        {
          type: null,
          label: 'Alle',
          selected: true
        },
        {
          type: 'song',
          label: 'Liederen',
          selected: true
        },
        {
          type: 'caption',
          label: 'Titels',
          selected: true
        },
        {
          type: 'scripture',
          label: 'Bijbeltekst',
          selected: true
        }
      ],
      isCreated: !this.isNew
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
    getPlanGlobalId (id) {
      return this.planGlobal.findIndex(p => p.id === id)
    },
    getPlanGlobalValue (id) {
      return this.planGlobal.find(p => p.id === id).value
    },
    getPlanGlobalImport (id) {
      return this.planGlobal.find(p => p.id === id).import
    },
    setPlanGlobalValue (id, value) {
      this.planGlobal[this.getPlanGlobalId(id)].value = value
    },
    setPlanGlobalImport (id, value) {
      this.planGlobal[this.getPlanGlobalId(id)].import = value
    },
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
    togglePlanItems (type, selected) {
      if (type) {
        for (let i = 0; i < this.planItems.length; i++) {
          if (this.planItems[i].type === type) { this.planItems[i].import = selected }
        }
      } else {
        for (let i = 0; i < this.planItems.length; i++) {
          this.planItems[i].import = selected
        }
        for (let i = 0; i < this.itemTypesSelect.length; i++) {
          this.itemTypesSelect[i].selected = selected
        }
      }
    },
    addPlanGlobal (index) {
      if (index !== undefined) {
        this.planGlobal[index].import = true
      } else {
        for (let i = 0; i < this.planGlobal.length; i++) {
          this.planGlobal[i].import = true
        }
      }
      this.updateService()
    },
    checkPlanGlobal () {
      if (!this.isNew) {
        this.setPlanGlobalImport('planTitle', this.theme === this.getPlanGlobalValue('planTitle'))
        this.setPlanGlobalImport('planHost', this.host === this.getPlanGlobalValue('planHost'))
        this.setPlanGlobalImport('planPreacher', this.preacher === this.getPlanGlobalValue('planPreacher'))
        this.setPlanGlobalImport('planWorshipLead', this.worshiplead === this.getPlanGlobalValue('planWorshipLead'))
      }
    },
    async updateService () {
      this.$emit('update:pcoId', `${this.serviceTypeId}-${this.planId}`)
      this.$emit('update:date', this.planDate)
      this.$emit('update:time', this.planTime)
      if (this.getPlanGlobalImport('planTitle')) { this.$emit('update:theme', this.getPlanGlobalValue('planTitle')) }
      if (this.getPlanGlobalImport('planHost')) { this.$emit('update:host', this.getPlanGlobalValue('planHost')) }
      if (this.getPlanGlobalImport('planPreacher')) { this.$emit('update:preacher', this.getPlanGlobalValue('planPreacher')) }
      if (this.getPlanGlobalImport('planWorshipLead')) { this.$emit('update:worshiplead', this.getPlanGlobalValue('planWorshipLead')) }
    },
    setDateTime (startDate) { // format: "2022-11-06T09:30:00Z"
      this.planDate = startDate.slice(0, 10).replaceAll('-', '/')
      this.planTime = startDate.slice(11, 16)
    },
    async setPlanItems (pItems) {
      this.isPcoItemsLoading = true
      this.planItems = []
      for (let i = 0; i < pItems.length; i++) {
        if (pItems[i].attributes.service_position === 'during' && (pItems[i].attributes.item_type === 'item' || pItems[i].attributes.item_type === 'song')) {
          let itemtype = 'song'
          let songArrangement = ''
          if (pItems[i].attributes.item_type === 'song' && pItems[i].relationships.arrangement.data !== null) {
            songArrangement = await this.pcoSongArrangement(pItems[i].id)
            if (songArrangement) {
              songArrangement = `tag PCO song lyrics:\n\n${songArrangement}`
              if (pItems[i].attributes.html_details) {
                songArrangement = `tag PCO Details:\n\n${pItems[i].attributes.html_details}\n \n\n${songArrangement}`
              }
            }
          }
          if (!pItems[i].attributes.html_details && !songArrangement) {
            itemtype = 'caption'
          }
          this.planItems.push({
            id: pItems[i].id,
            title: pItems[i].attributes.title || '',
            description: pItems[i].attributes.description || '',
            html_details: songArrangement || pItems[i].attributes.html_details || '',
            import: this.isNew && itemtype === 'song',
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
      this.isPcoItemsLoading = false
    },
    planMembers () {
      this.setPlanGlobalValue('planWorshipLead', '')
      this.setPlanGlobalImport('planWorshipLead', this.isNew)
      this.setPlanGlobalValue('planHost', '')
      this.setPlanGlobalImport('planHost', this.isNew)
      this.setPlanGlobalValue('planPreacher', '')
      this.setPlanGlobalImport('planPreacher', this.isNew)
      for (let i = 0; i < this.teamMembers.length; i++) {
        if (this.teamMembers[i].attributes.status !== 'D') { // D = Declined
          switch (this.teamMembers[i].attributes.team_position_name) {
            /**
             * Floormanager
             * 01 Coördinator van dienst
             * 05 Oudste van Dienst
             */
            case 'Aanbiddingsleider':
              this.setPlanGlobalValue('planWorshipLead', this.teamMembers[i].attributes.name)
              break
            case '02 Host':
              this.setPlanGlobalValue('planHost', this.teamMembers[i].attributes.name)
              break
            case '03 Spreker':
              this.setPlanGlobalValue('planPreacher', this.teamMembers[i].attributes.name)
              break
            default:
              // skip
          }
        }
      }
      if (this.getPlanGlobalValue('planPreacher') === '') { this.setPlanGlobalValue('planPreacher', this.getPlanGlobalValue('planTitle')) }
    },
    async pcoServiceType (serviceTypeId, serviceTypeName) {
      this.itemId = ''
      this.planItems = ''
      this.teamMembers = ''
      this.planId = ''
      this.plans = ''
      this.plansLabel = 'Datum dienst'
      this.plansShow = true
      this.serviceTypeId = serviceTypeId
      this.serviceTypesShow = serviceTypeId === ''
      this.serviceTypesLabel = serviceTypeName
      await this.pco()
    },
    onceFirstPlan () {
      if (!this.serviceTypes && this.plans && (this.isNew || this.plans.length === 1)) {
        this.pcoPlan(this.plans[0].id, this.plans[0].attributes.short_dates, this.plans[0].attributes.sort_date, this.plans[0].attributes.items_count, this.plans[0].attributes.title)
      }
    },
    async pcoPlan (planid, planDates, planDate, planItemsCount, planTitle) {
      this.itemId = ''
      this.planItems = ''
      this.teamMembers = ''
      this.planId = planid
      this.itemCount = planItemsCount
      this.setDateTime(planDate)
      this.plansLabel = planDates
      this.setPlanGlobalValue('planTitle', planTitle)
      this.setPlanGlobalImport('planTitle', this.isNew)
      this.plansShow = false
      this.itemId = 'team'
      await this.pco() // get teammembers
      this.itemId = ''
      await this.pco() // get planitems
      await this.updateService()
      this.checkPlanGlobal()
    },
    async pcoSongArrangement (itemId) {
      this.itemId = `${itemId}/arrangement`
      await this.pco() // get arrangement
      this.itemId = '' // reset when data is return
      if (this.itemsNotes.length) {
        return this.itemsNotes[0].attributes.lyrics || '' // this.itemsNotes[0].attributes.chord_chart
      }
      return ''
    },
    // error steeds 1 minder ingevuld nog verwerken..... nu alles direct leeg gedaan.
    errorReturn () {
      if (this.serviceTypeId) {
        if (this.planId) {
          if (this.itemId) {
            if (this.itemId === 'team') {
              this.$q.notify({ type: 'negative', message: "Onderdeel gegevens 'ingeplande mensen' niet gevonden in PCO." })
            } else {
              this.$q.notify({ type: 'negative', message: `Onderdeel gegevens '${this.itemId}' niet gevonden in PCO.` })
            }
            this.itemId = ''
          } else {
            this.$q.notify({ type: 'positive', message: `Dienst '${this.plansLabel}' niet gevonden in PCO. We resetten en proberen het opnieuw. (id: ${this.planId})` })
            this.pcoServiceType(this.serviceTypeId, this.serviceTypesLabel) // reset plan data and run from empty
          }
        } else {
          this.$q.notify({ type: 'positive', message: `ServiceType '${this.serviceTypesLabel}' niet gevonden in PCO. We resetten en proberen het opnieuw. (id: ${this.serviceTypeId})` })
          this.pcoServiceType('', 'Dienst type') // reset all data and run from empty
        }
      } else {
        this.$q.notify({ type: 'negative', message: 'Onderdeel niet gevonden in PCO. Probeer het later opnieuw.' })
      }
    },
    async pco () {
      this.isPcoLoading = true

      /*
      localStorage.setItem('pcoToken', '....')
      localStorage.setItem('pcoTokenExpiry', 0)
      localStorage.setItem('pcoRefreshToken', '....')
      */

      const pcoToken = localStorage.getItem('pcoToken') || ''
      const pcoTokenExpiry = localStorage.getItem('pcoTokenExpiry') || 0
      const pcoRefreshToken = localStorage.getItem('pcoRefreshToken') || ''

      try {
        const result = await this.$api.post('/pco', {
          serviceType: this.serviceTypeId,
          plan: this.planId,
          itemCount: this.itemCount,
          item: this.itemId,
          token: pcoToken,
          tokenExpiry: pcoTokenExpiry,
          refreshToken: pcoRefreshToken
        })
        // console.log(result)
        if (result.pcoTokens) {
          localStorage.setItem('pcoToken', result.pcoTokens.token)
          localStorage.setItem('pcoTokenExpiry', result.pcoTokens.tokenExpiry)
          localStorage.setItem('pcoRefreshToken', result.pcoTokens.refreshToken)
        }
        if (result.url) { // first login
          window.open(result.url, '_blank')
        } else if (result.errorStatus) { // Error return PCO API
          switch (result.errorStatus) {
            case '401': // Unauthorized
              this.pcoLogout()
              this.$q.notify({ type: 'negative', message: 'De gebruikte inloggegevens kloppen niet, log opnieuw in.' })
              break
            case '403': // Forbidden
              this.$q.notify({ type: 'negative', message: 'U heeft geen toegang / rechten tot deze gegevens in PCO.' })
              break
            case '404': // not Found
              this.errorReturn()
              break
            case '429': // Too Many Requests
              this.$q.notify({ type: 'negative', message: 'Teveel verzoeken aan PCO, even geduld en probeer het later opnieuw.' })
              break
            case '500': // Internal Server Error
              this.$q.notify({ type: 'negative', message: 'Er is een probleem met de server van PCO. Probeer het later opnieuw.' })
              break
            case '503': // Service Unavailable
              this.$q.notify({ type: 'negative', message: 'Er wordt onderhoud aan de server van PCO gevoerd. Probeer het later opnieuw.' })
              break
            case '400': // Bad Request
            case '409': // Conflict
            case '422': // Validation Error
            default:
              this.errorReturn()
              break
          }
        } else { // get data from response
          if (typeof result.data.meta.count === 'undefined') { // no array data --> one plan
            if (result.data.data.type === 'Plan') {
              this.plans = [result.data.data] // use array so it is the same al more services get back.
              this.onceFirstPlan()
            } else if (result.data.data.type === 'Arrangement') { // using to get PCO song item arrangement
              this.itemsNotes = [result.data.data]
            } else { // notify | if perhapse her | no clou of the data came back
              this.$q.notify({ type: 'negative', message: 'Error PCO.' })
              this.errorReturn()
            }
          } else if (result.data.meta.count !== 0) {
            if (this.itemId === 'team') { // return team_members
              this.teamMembers = result.data.data
              this.planMembers()
            } else if (this.itemId) { // return item notes
              this.itemsNotes = result.data.data // not used for now her, only one count for get PCO song item arrangement
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
            } else { // returns serviceTypes
              this.$q.notify({ type: 'negative', message: 'Er zijn geen dienst typen gevonden in PCO.' })
            }
          }
        }
      } catch {
        this.errorReturn()
      } finally {
        this.isPcoLoading = false
      }
    },
    askPcoPlanId () {
      const PcoPlanId = prompt('Geef PCO dienst id (zie einde url): \nbijv. https://services.planningcenteronline.com/plans/55984013', '55984013')
      this.planId = Number(PcoPlanId)
      this.itemCount = ''
      this.itemId = ''
      if (this.planId) {
        this.pco()
      }
    },
    async pcoLogout () {
      this.isPcoLoading = true
      localStorage.removeItem('pcoToken')
      localStorage.removeItem('pcoTokenExpiry')
      localStorage.removeItem('pcoRefreshToken')
      this.$q.notify({ type: 'positive', message: 'Uitgelogd bij PCO.' })
      this.isPcoLoading = false
    },
    addPcoItemToService (id) {
      // no PCO id item to service to update by accent ; maby in futer bij live add
      if (this.isCreated) {
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
            default : // type not found
              console.log(`error not found id:${this.planItems[id].id} type:${this.planItems[id].type}`)
          }
        }
      }
    },
    addItems () {
      this.isCreated = true
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
  max-height: 40vh;
  overflow-y: scroll;
}

</style>
