<template>
  <div 
    class="layout-column droparea items-center justify-center text-grey-5"
    :class="dragClass"
    @dragover = dragover
    @dragleave = dragleave
    @drop = drop
  >
    <p v-if="!isLoading">
      Open linksboven een dienst om verder te gaan.<br>
      Of sleep een *.vez bestand in dit vak.
    </p>
    <q-spinner v-else color="primary" size="xl" />
  </div>
</template>

<script>

export default {
  data () {
    return {
      isLoading: false,
      dragClass: ''
    }
  },
  computed: {
    saved () {
      return (JSON.stringify(this.$store.service) === this.$store.serviceSaved) || !this.$store.service
    }
  },
  methods: {
    dragover (e) {
      // Prevent navigation.
      e.preventDefault()
      this.dragClass = 'bg-secondary'
    },
    dragleave () {
      this.dragClass = ''
    },

    async drop (e) {
      e.preventDefault()
      // filter file (& directory)
      let fileHandlesPromises = [...e.dataTransfer.items]
        .filter((item) => item.kind === 'file') // 'file' or 'string'
        .map((item) => item.getAsFileSystemHandle())
      // open first *.vez
      for await (const handle of fileHandlesPromises) {
        if (handle.kind === 'file') { // 'directory' or 'file'
          if (handle.name.split('.').pop().toLowerCase() === 'vez') {
            if (this.saved || confirm('Aangebrachte wijzigingen worden niet opgeslagen.')) {
              this.isLoading = true
              this.$fs.open(false, handle)
                .finally(() => {
                  this.isLoading = false
                })
            }
            break
          } else {
            console.log('geen vezy bestand')
          }
        } else {
          console.log(`Directory: ${handle.name}`)
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.droparea {
  width: 100%;
}
</style>