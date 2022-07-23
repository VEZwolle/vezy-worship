<template>
  <div>
    <div class="text-h4 q-mb-md">
      Snelkoppelingen VezyWorship
    </div>
    <div class="q-pa-md">
      <q-table
        title="Snelkoppeningen"
        :rows="rows"
        :columns="columns"
        :rows-per-page-options="[0]"
        row-key="name"
      />
    </div>
  </div>
</template>

<script>
const columns = [
  {
    name: 'shortkey',
    required: true,
    label: 'Toetscombinatie',
    align: 'left',
    field: row => row.shortkey,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'function', align: 'left', label: 'Werking', field: 'function', sortable: true }
]

const rows = [
  { shortkey: 'ctrl + c', function: 'Live weergave aan/uit zetten (wijzig: clear)' },
  { shortkey: '→  of  ↓', function: 'Ga naar volgende regel/onderdeel in live' },
  { shortkey: '←  of  ↑', function: 'Ga naar vorige regel/onderdeel in live' },
  { shortkey: 'ctrl + →', function: 'Preview naar live verplaatsen (Go Live)' },
  { shortkey: 'ctrl + n', function: 'Nieuwe dienst aanmaken' },
  { shortkey: 'ctrl + o', function: 'Opgeslagen dienst openen' },
  { shortkey: 'ctrl + s', function: 'Huidige dienst opslaan' }
]

export default {
  setup () {
    return {
      columns,
      rows
    }
  }
}
</script>
