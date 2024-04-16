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
      <br>
      <p>Opm.: de toetsen tussen ( ... ) werken alleen in de stand afstandsbediening.</p>
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
  { shortkey: 'Ctrl + C of F6 of spatie of (.)', function: 'Live weergave aan/uit zetten (wijzig: clear)' },
  { shortkey: '➡  of  ⬇ of (page down)', function: 'Ga naar volgende regel/onderdeel in live' },
  { shortkey: '⬅  of  ⬆ of (page up)', function: 'Ga naar vorige regel/onderdeel in live' },
  { shortkey: 'Ctrl + ➡', function: 'Preview naar live verplaatsen (Go Live)' },
  { shortkey: 'Ctrl + N', function: 'Nieuwe dienst aanmaken' },
  { shortkey: 'Ctrl + O', function: 'Opgeslagen dienst openen' },
  { shortkey: 'Ctrl + S', function: 'Huidige dienst opslaan' },
  { shortkey: '(F5 of esc)', function: 'Play/Stop van film' }
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
