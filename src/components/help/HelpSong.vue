<template>
  <div>
    <div class="text-h4 q-mb-md">
      <img src="../../../public/icons/favicon-32x32.png">
      Liederen toevoegen / wijzigen
    </div>
    <div class="text-h6 q-mb-md">
      Nieuw lied toevoegen aan setlist:
    </div>
    <p>
      Via de <img src="../../assets/help/setlistadd.png">in het linker vak, onderin; kies je <img src="../../assets/help/setlistaddsong.png">
    </p>
    <p>
      Je zie nu onderstaand scherm verschijnen.<br>
      Vul hier de <i>titel</i>, de <i>tekst</i> en eventueel de <i>vertaling</i> in de betreffende vakken in.<br>
      De opmaak van de teksten wordt door het programma geregeld. Zie onder wat aandachtspunten.<br>
      <img src="../../assets/help/addsongdialog.png">
    </p>
    <p>
      <b><u>Titel</u></b><br>
      De titel is voor je zelf en wordt nergens op de beamer of livestream getoond.
    </p>
    <p>
      <b><u>Tekst</u></b><br>
      De verdeling voor de beamer bepaal je zelf.<br>
      Gebruik een <i>lege regel</i> voor de verdeling naar een nieuwe pagina.<br>
      VezyWorship zorgt voor verdeling van de beamer tekst naar maximaal 2 regels op de livestream.
    </p>
    <p>
      Voor overzicht kan er een hulpregel worden toegevoegd met een label.
      <ul>
        <li>
          Deze moet dan starten met<br>
          of<i>label</i> en een <i>( { [</i> teken of een <i>getal</i> in de tekst, en daarna kan een willekeurige tekst geplaatst worden.<br>
          of alleen bestaan uit exact het <i>label</i> zonder spaties.<br>
          bijv. "infro", "verse", "refrein", "bridge", "tussenspel" of "eind".<br>
          Zie onderaan deze pagina voor een complete lijst van opties.
        </li>
        <li>
          voorbeelden:<br>
          refrein (2x)
          refrein
          refrein 2
        </li>
        <li>
          De hulpregels krijgen na opslaan in de preview en liveweergave een apparte kleur meegegeven;<br>
          maar worden niet op de beamer en livestream getoond.
        </li>
      </ul>
    </p>
    <p>
      Wanneer je een lege pagina wilt toevoegen kan dat alleen door een label te plaatsen tussen 2 lege regels in. Bijvoorbeeld "tussenspel"
    </p>
    <p>
      <i><u>aandachtspunten / opmerkingen:</u></i>
      <ul>
        <li>
          Bij teksten met een vertaling komt de vertaling onder de liedtekst te staan op de beamer en livestream.<br>
          Halveer het aantal regels per pagina tov van een lied zonder vertaling om het scherm niet te vol te krijgen.
        </li>
        <li>
          Te lange regels verdwijnen buiten het scherm, er wordt niet verkleind of naar een volgende regel gegaan.
        </li>
        <li>
          2 lege regels achter elkaar zorgen voor verspringingen; de 2e lege regel wordt namelijk als "tekstregel" gezien/toegepast.
        </li>
      </ul>
    </p>
    <p>
      <b><u>Vertaling</u></b><br>
      De vertaling dient dezelfde onderverdeling met lege regels te hebben al de originele tekst. De labels mogen ook gebruikt worden uit de lijst.<br>
      De vertaling wordt nu automatisch in apparte opmaak onder de liedteksten geplaatst op de beamer en livestream.
    </p>
    <p>
      Er is een mogelijkheid om de tekst automatisch te laten vertalen. Hiervoor wordt "DeepL Translator" gebruikt.<br>
      De knop hiervoor wordt alleen weergegeven wanneer er geen enkel teken in het vak vertaling staat.<br>
      <i>Let op, dit is een machine vertaling en is niet altijd juist; gebruik bij voorkeur de vertaling gemaakt door een vertaler.</i>
    </p>
    <p>
      <b><u>Bewerkingshulpmiddelen</u></b><br>
      Onder aan het venster ziet u een aantal knoppen staan die kunnen helpen bij het bewerken van de teksten.
      <ul>
        <li>
          <img src="../../assets/help/addsongdialog2to1enter.png"> Deze knop vervangt in de tekst alle dubbele regeleinden door een enkele.
        </li>
        <li>
          <img src="../../assets/help/addsongdialogspaceremove.png"> Deze knop verwijderd alle voorloop en achterloop spaties uit de regels.
        </li>
        <li>
          <img src="../../assets/help/addsongdialoglabel.png"> Met deze knop kan je bij alle onderdelen tegelijk een gekozen label toevoegen; dit gebeurt niet wanneer de zin reeds met een label begint.
        </li>
        <li>
          <img src="../../assets/help/addsongdialogundu.png">
        </li>
        <li>
          <img src="../../assets/help/addsongdialogordenen.png">
        </li>
      </ul>
    </p>
    <div class="text-h6 q-mb-md">
      Controle Voorbeeld / Live bediening
    </div>
    <p>
      Na opslaan/sluiten van het invoerscherm kan je in de basis omgeving een controle uitvoeren door elke pagina te bekijken.<br>
      Je ziet hier de onderverdeling per "beamer" pagina staan, scheiding wordt aangegeven met een horizontale streep of een gekleurd label.<br>
      De pagina van de beamer wordt naar 2 regels gesplitst voor de livestream (of 1 regel + 1 regel vertaling indien van toepassing)<br>
      Je moet per (livestream) pagina doorklikken/doorlopen in de lijst.<br>
      Onder in het scherm zie je een voorbeeld.<br>
      <img src="../../assets/help/songcontrol.png">
    </p>
    <div class="text-h6 q-mb-md">
      Afwijkende achtergrond
    </div>
    <p>
      Onder het tabblad "achtergrond" kan je eventueel een afwijkende achtergrond kiezen voor dit onderdeel.<br>
      <img src="../../assets/help/songachtergronddialog.png">
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
    <div class="text-h6 q-mb-md">
      Lijst toepasbare labels
    </div>
    <q-list bordered separator>
      <q-item v-for="label in labels" :key="label.key" borderd dense :class="`text-white bg-${label.color}`">
        <q-item-section>{{ label.key }}</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import labels from '../song/labels'

export default {
  setup () {
    return {
      labels
    }
  }
}
</script>
