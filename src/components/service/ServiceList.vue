<template>
  <ul role="list" class="divide-y divide-gray-200">
    <li v-for="(service, i) in services" :key="i">
      <div class="relative group py-5 px-6 flex items-start space-x-3">
        <div class="flex-shrink-0">
          <span :class="[colors[i % 3], 'inline-flex items-center justify-center h-10 w-10 rounded-lg']">
            <CalendarIcon class="h-6 w-6 text-white" aria-hidden="true" />
          </span>
        </div>
        <div class="min-w-0 flex-1">
          <div class="text-sm font-medium text-gray-900">
            <a href="#" @click.prevent="select(service)">
              <span class="absolute inset-0" aria-hidden="true" />
              <span class="capitalize">{{ $date(service.date) }}</span>
            </a>
          </div>
          <p class="text-sm text-gray-500">
            {{ service.preacher }}
            <span v-if="service.theme">- “{{ service.theme }}”</span>
          </p>
        </div>
        <div class="flex-shrink-0 self-center">
          <ChevronRightIcon class="h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import { ChevronRightIcon } from '@heroicons/vue/solid'
import { CalendarIcon } from '@heroicons/vue/outline'

export default {
  components: {
    ChevronRightIcon,
    CalendarIcon
  },
  emits: ['select'],
  data () {
    return {
      services: []
    }
  },
  computed: {
    colors () {
      return ['bg-pink-500', 'bg-purple-500', 'bg-yellow-500']
    }
  },
  created () {
    this.load()
  },
  methods: {
    async load () {
      this.services = await this.$api.get('/services')
    },
    select (service) {
      this.$emit('select', service)
    }
  }
}
</script>
