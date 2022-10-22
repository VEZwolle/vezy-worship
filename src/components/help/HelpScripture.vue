<template>
  <div>
    <div class="text-h4 q-mb-md">
      <img src="../../../public/icons/favicon-32x32.png">
      Bijbelteksten toevoegen / wijzigen
    </div>
    <div class="text-h6 q-mb-md">
      Nieuwe bijbeltekst toevoegen aan setlist:
    </div>
    <p>
      Via de <img src="../../assets/help/setlistadd.png">in het linker vak, onderin; kies je <img src="../../assets/help/setlistaddsong.png">
    </p>
    <p>
      Je zie nu onderstaand scherm verschijnen.<br>
      Vul hier de <i>bijbel</i>vertaling, het <i>boek</i>, het <i>hoofdstuk</i> en het <i>vers vanaf</i> & <i>t/m</i> in de betreffende vakken in.<br>
      Klik hiernaa op de knop <img src="../../assets/help/scripturetekstinladen.png"> om de tekst in het tekstveld te zetten vanuit de database.<br>
      De opmaak van de teksten wordt grotendeels door het programma geregeld. Zie onder wat aandachtspunten.<br>
      <img src="../../assets/help/addscripturedialog.png">
    </p>
    <p>
      <b><u>Bijbelvertaling</u></b><br>
      Standaard zijn de volgende vertalingen aanwezig:
      <q-list>
        <q-item v-for="bible in bibleOptions" :key="bible.id" borderd dense>
          <q-item-section>{{ bible.label }}</q-item-section>
        </q-item>
      </q-list>
    </p>
    <p>
      <b><u>Tekst</u></b><br>
      De verdeling voor de beamer bepaal je zelf (aantal regels per pagina).<br>
      Gebruik een <i>lege regel</i> voor de verdeling naar een nieuwe pagina.<br>
      VezyWorship zorgt voor verdeling van de beamer tekst op de livestream aan de hand van regels & een maximale lengte aan tekens.
    </p>
    <p>
      Eventueel kunnen delen van de tekst vet, cursief, onderstreept worden en daarnaast kan de tekst verkleind aan de bovenzijde geplaatst worden.<br>
      <img src="../../assets/help/scripturefontsetting.png">
    </p>
    <p>
      <i><u>aandachtspunten / opmerkingen:</u></i>
      <ul>
        <li>
          Er is een internet verbinding nodig om de tekst vanuit de database te kunnen inladen.
        </li>
        <li>
          Het gebruik van de knop "tekst inladen" vervangt de bestaande tekst.
        </li>
        <li>
          Het gekozen boek & vertaling, hoofdstuk e.d. wordt als titel op de beamer en livestream weergegeven.
        </li>
        <li>
          Er zitten nog een aantal <a href="https://github.com/VEZwolle/vezy-worship/issues?q=is%3Aissue+is%3Aopen+label%3Ascripture" target="_blank">fouten</a> in deze module wanneer je zelf tekst invult;<br>
          controleer jezelf met het voorbeeld in de bedienging of het juiste wordt weergegeven.<br>
        </li>
      </ul>
    </p>
    <div class="text-h6 q-mb-md">
      Controle Voorbeeld / Live bediening
    </div>
    <p>
      Na opslaan/sluiten van het invoerscherm kan je in de basis omgeving een controle uitvoeren door elke pagina te bekijken.<br>
      Je ziet hier de onderverdeling per "beamer" pagina staan, scheiding wordt aangegeven met een horizontale streep<br>
      De pagina van de beamer wordt naar maximaal x tekens gesplitst op basis van zinnen voor de livestream.<br>
      Je moet per (livestream) pagina doorklikken/doorlopen in de lijst.<br>
      Onder in het scherm zie je een voorbeeld.<br>
      <img src="../../assets/help/scripturecontrol.png">
    </p>
    <div class="text-h6 q-mb-md">
      Afwijkende achtergrond
    </div>
    <p>
      <i>Dit onderdeel werkt nog niet in de output naar de beamer.</i><br>
      Onder het tabblad "achtergrond" kan je eventueel een afwijkende achtergrond kiezen voor dit onderdeel.<br>
      <img src="../../assets/help/scriptureachtergronddialog.png">
    </p>
    <div class="text-h6 q-mb-md">
      Onderdeel uit setlist bewerken
    </div>
    <p>
      Optie 1: Selecteer het onderdeel en kies aan het einde van de regel het potloodje.<br>
      Optie 2: Klik met de rechtermuisknop op het onderdeel; er verschijnt een menu en kies dan bewerken.<br>
      <img src="../../assets/help/setlistedit.png">
    </p>
    <p>
      Je komt nu weer terug in het zelfde scherm als je hebt gebruikt bij toevoegen van het onderdeel.<br>
      <i>Let op dat alle wijzigingen die je aanbrengd direct worden toegepast in de setlist.</i> (excl. het onderdeel in live).<br>
    </p>
  </div>
</template>

<script>
import bibles from '../scripture/bibles'

export default {
  computed: {
    bibleOptions () {
      return bibles.map(b => ({
        label: b.name,
        value: b.id
      }))
    }
  }
}
</script>
