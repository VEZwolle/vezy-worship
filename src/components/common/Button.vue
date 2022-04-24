<template>
  <button type="button" :disabled="isLoading" class="inline-flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm focus:outline-none disabled:opacity-50" :class="classes" @click="onClick">
    <component :is="getIcon(icon)" v-if="icon" class="mr-2 h-4 w-4" aria-hidden="true" />
    <slot />
  </button>
</template>

<script>
import { defineAsyncComponent } from 'vue'

export default {
  name: 'Button',
  props: {
    icon: String,
    secondary: Boolean,

    /** Like @click event, but auto updates state (based on promise state) */
    click: Function
  },
  emits: ['click'],
  data () {
    return {
      isLoading: false
    }
  },
  computed: {
    classes () {
      if (this.secondary) {
        return ['bg-white', 'border-gray-300', 'hover:bg-gray-50', 'text-gray-700']
      }

      return ['bg-indigo-600', 'border-transparent', 'hover:bg-indigo-700', 'text-white']
    }
  },
  methods: {
    getIcon (icon) {
      return defineAsyncComponent(() => import(`@heroicons/vue/outline/${icon}Icon`))
    },
    onClick (e) {
      if (!this.click) {
        return this.$emit('click', e)
      }

      this.isLoading = true
      this.click(e)
        .finally(() => {
          this.isLoading = false
        })
    }
  }
}
</script>
