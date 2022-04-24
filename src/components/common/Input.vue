<template>
  <div>
    <label :for="`input-${name}`" class="block text-sm font-medium text-gray-700">{{ name }}</label>
    <input :id="`input-${name}`" :value="modelValue" v-bind="$attrs" type="text" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" @input="onInput">
  </div>
</template>

<script>
export default {
  name: 'Input',
  props: {
    name: String,
    modelValue: String
  },
  emits: ['update:modelValue'],
  methods: {
    onInput (e) {
      this.$emit('update:modelValue', e.target.value)
    }
  }
}
</script>
