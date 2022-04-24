<template>
  <Modal ref="modal">
    <div class="pointer-events-auto w-screen max-w-md">
      <form class="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
        <div class="h-0 flex-1 overflow-y-auto">
          <div class="bg-indigo-700 py-6 px-4 sm:px-6">
            <div class="flex items-center justify-between">
              <DialogTitle class="text-lg font-medium text-white">
                Nieuwe dienst
              </DialogTitle>
              <div class="ml-3 flex h-7 items-center">
                <button type="button" class="rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none" @click="close">
                  <span class="sr-only">Close panel</span>
                  <XIcon class="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div class="mt-1">
              <p class="text-sm text-indigo-300">
                Vul onderstaande gegevens in om een nieuwe dienst aan te maken.
              </p>
            </div>
          </div>
          <div class="flex flex-1 flex-col justify-between">
            <div class="divide-y divide-gray-200 px-4 sm:px-6">
              <div class="space-y-6 pt-6 pb-5">
                <div>
                  <label for="first-name" class="block text-sm font-medium text-gray-700">Spreker</label>
                  <input id="first-name" v-model="service.preacher" type="text" placeholder="Bijv. Olaf ten Napel" autocomplete="given-name" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                </div>

                <div>
                  <label for="first-name" class="block text-sm font-medium text-gray-700">Host</label>
                  <input id="first-name" v-model="service.host" type="text" placeholder="Bijv. Cor van den Belt" autocomplete="given-name" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-shrink-0 justify-end px-4 py-4">
          <Button secondary @click="close">
            Annuleren
          </Button>
          <Button class="ml-2">
            Dienst aanmaken
          </Button>
        </div>
      </form>
    </div>
  </Modal>
</template>

<script>
import { DialogTitle } from '@headlessui/vue'
import { XIcon } from '@heroicons/vue/outline'

export default {
  components: {
    DialogTitle,
    XIcon
  },
  data () {
    return {
      service: {}
    }
  },
  methods: {
    open () {
      this.$refs.modal.open()
    },
    close () {
      this.$refs.modal.close()
    }
  }
}
</script>
