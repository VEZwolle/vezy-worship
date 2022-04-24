<template>
  <button type="button" class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
    <component :is="getIcon(icon)" v-if="icon" class="mr-2 h-4 w-4" aria-hidden="true" />
    <slot />
  </button>
</template>

<script>
import { defineAsyncComponent } from 'vue'

export default {
  name: 'Button',
  props: {
    icon: String
  },
  methods: {
    getIcon (icon) {
      return defineAsyncComponent(() => import(`@heroicons/vue/outline/${icon}Icon`))
    }
  }
}
</script>
