<template>
  <div>
    <div class="text-h4 q-mb-md">
      <img src="../../../public/icons/favicon-32x32.png">
      Sneltoetsen
    </div>
    <div class="q-pa-md">
      <q-table
        title="Sneltoetsen"
        :rows="rows"
        :columns="columns"
        :rows-per-page-options="[0]"
        row-key="name"
        dense
      />
    </div>
    <div class="text-h6 q-mb-md">
      Quick live
    </div>
    <p>
      Door met de rechtermuisknop op de knop "GO LIVE" te klikken verschijnt een menu met een aantal standaard onderdelen die je direct live kan zetten. <i>(opmerking: dit zijn de standaard versies uit VezyWorship.)</i><br>
      <img src="../../assets/help/quickliverightkey.png">
    </p>
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
  { shortkey: 'ctrl + C of F6', function: 'Live weergave aan/uit zetten (wijzig: clear)' },
  { shortkey: '➡  of  ⬇', function: 'Ga naar volgende regel/onderdeel in live' },
  { shortkey: '⬅  of  ⬆', function: 'Ga naar vorige regel/onderdeel in live' },
  { shortkey: 'ctrl + ➡', function: 'Preview naar live verplaatsen (Go Live)' },
  { shortkey: 'ctrl + N', function: 'Nieuwe dienst aanmaken' },
  { shortkey: 'ctrl + O', function: 'Opgeslagen dienst openen' },
  { shortkey: 'ctrl + S', function: 'Huidige dienst opslaan' }
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
