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
          of <i>label</i> en een <i>( { [ : ; / \ |</i> teken of een <i>getal</i> in de tekst, en daarna kan een willekeurige tekst geplaatst worden.<br>
          of alleen bestaan uit exact het <i>label</i> zonder spaties.<br>
          bijv. "intro", "verse", "refrein", "bridge", "tussenspel" of "eind".<br>
          Zie onderaan deze pagina voor een complete lijst van opties.
        </li>
        <li>
          voorbeelden:<br>
          refrein (2x)
          refrein
          refrein 2
        </li>
        <li>
          De hulpregels krijgen na opslaan in de preview en liveweergave een aparte kleur meegegeven;<br>
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
      De vertaling wordt nu automatisch in aparte opmaak onder de liedteksten geplaatst op de beamer en livestream.
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
          <img src="../../assets/help/addsongdialogspaceremove.png"> Deze knop verwijderd alle voorloop en achterloop spaties uit de regels.<br>
          <i>Dit voorkomt vaak vreemde fouten in de splitsing van liederen of uitlijningsverschillen van dezelfde teksten.</i>
        </li>
        <li>
          <img src="../../assets/help/addsongdialogspaceinterpunctieremove.png"> Deze knop verwijderd alle voorloop en achterloop spaties uit de regels en daarna de " . , ; " die aan einde van een regel staan.
        </li>
        <li>
          <img src="../../assets/help/addsongdialoglabel.png"> Met deze knop kan je bij alle onderdelen tegelijk een gekozen label toevoegen;<br>
          Dit gebeurt niet wanneer de zin reeds met een label begint.
        </li>
        <li>
          <img src="../../assets/help/addsongdialogundu.png"> Met deze knop kan je 1 van de gebruikte tools, 1x ongedaan maken.<br>
          <i>opm.: Bewerkingen in het tekstvak zelf kunnen meestal met "ctrl + z" hersteld worden.</i>
        </li>
        <li>
          <img src="../../assets/help/addsongdialogordenen.png"> Hiermee start je het tekst ordenen dialoog op.<br>
          Zie onder voor verdere uitleg.
        </li>
      </ul>
    </p>
    <p>
      <b><u>Bewerkingshulpmiddel - Ordenen</u></b><br>
      Deze tool is via de knop "ordenen" op te starten.<br>
      Bij het opstarten worden gelijk alle voor en achterloop spaties verwijderd. Tevens worden alleen de labels van de tekst gebruikt, zowel voor tekst als voor de vertaling.<br>
      <img src="../../assets/help/songdialogordenen.png">
      <ul>
        <li>
          <img src="../../assets/help/songdialogordenen1kolom.png"> & <img src="../../assets/help/songdialogordenen2kolom.png"> Hiermee kan je switchen tussen de 1 & 2 kolommen weergave. In de 1 kolom weergave staat de tekst en vertaling onder elkaar en kan je ook de verwijderde regels zien (en herstellen). (het symbool geeft aan wat het is.)
        </li>
        <li>
          Wanneer je met de muis boven een regel staat krijg je een aantal opties te zien.<img src="../../assets/help/songdialogordenenoptiesregel.png"><br>
          - voeg een lege regel in.<br>
          - verwijder de regel<br>
          - verplaats naar de tekst<br>
          - verplaats naar de vertaling<br>
          - pas bei beide toe<br>
        </li>
        <li>
          Wanneer je met de rechter muisknop op een regel klikt krijg je de onderstaande opties te zien.<br>
          <img src="../../assets/help/songdialogordenenoptiesregelright.png"><br>
          - Door met rechts op de optie "label..." te klikken krijg je de andere labels te zien om uit te kiezen<br>
          - Lege regel invoegen is alleen voor de huidige kolom; bij (beide) voor beide kolommen
          - Kopiëren van onderdeel kopieert het geheel; hierna kan je op een andere positie uit het menu kiezen voor plakken (met of zonder het label)<br>
          - de onderste opties zijn gelijk aan bovenstaande knoppen wanneer je de muis boven de regel houdt.<br>
        </li>
        <li>
          <img src="../../assets/help/songdialogordenenzoektaal.png"> Deze knop haalt de nederlandse tekst uit de liedtekst en verplaatst deze naar de vertaling van het lied. Dit gebeurt via taalherkenning van DeepL. Hierdoor wordt 95-100% in de juiste kolom geplaatst. De labels blijven ongewijzigd in beide kolommen staan.
        </li>
        <li>
          <img src="../../assets/help/songdialogordenenswitch.png"> Door deze switch om te zetten kan je de tekst in de regel bewerken. Dubbel klik met de muis op de regel activeert deze bewerkmodus ook. Met "enter" ga je weer uit de bewerkmodes.
        </li>
      </ul>
      Alleen na gebruik van de knop "toepassen" wordt de bewerking opgeslagen naar je liedtekst in de setlist; "annuleren" sluit het venster zonder opslaan.
    </p>
    <div class="text-h6 q-mb-md">
      Invoegen lied vanuit (online) database
    </div>
    <p>
      <img src="../../assets/help/addsongdialogadddatabase.png"><br>
      Er kunnen via de databaseknop ook liederen uit de lokale of online (Angolia) database toegevoegd worden.<br>
      Met de switch voor de databaseknop kan je wisselen tussen de lokale en de online database.<br>
      Er zijn meerdere online (Algolia) databases; rechts onderaan kun je deze kiezen/wisselen door aanklikken of via rechtermuisknop uit het menu te kiezen welke database je wilt gebruiken.<br>
      opm. de Algolia database(s) ondersteund ook zoeken met kleine typefouten, de lokale database niet.
    </p>
    <p>
      <img src="../../assets/help/addsongdatabasedialog.png"><br>
      - Links boven kan je wisselen tussen de lokale en online database.<br>
      - Vul in het zoekvak je zoektekst in.<br>
      - Kies eventueel een collectie om je resultaten te beperken.<br>
      - Standaard wordt alleen in de titel, collectie en nummer gezocht. Onderin kan je aangeven of je ook in de liedtekst wilt zoeken.<br>
      - Voor de lokale database kan je ook aanvinken dat je alleen liederen wilt vinden die een vertaling hebben.<br>
      - met de knop toepassen wordt het lied uit de database gekopieerd naar het actieve liedvenster.<br>
      - In dit venster kan je ook liederen in de database bewerken of verwijderen; online alleen wanneer je hier de rechten voor hebt. (met de ongedaan maak knop kan je bepaalde wijzigingen weer ongedaan maken zolang je in dit venster zit.)<br>
      - Rechts kan je een voorbeeld zien van het geselecteerde lied in de database.
    </p>
    <p>
      Met de knop <img src="../../assets/help/filesaveas.png"> naast de database knop kan je ook de huidige liedtekst vergelijken met de liedtekst in database.<br>
      Je krijgt dan 0 of meerdere liederen in een lijst te zien met de hoeveelheid overeenkomst. In het voorbeeld er onder kan je dan de verschillen zien.<br>
      Mocht je de database versie willen gebruiken kan je dit via de knop "gebruik database versie" doen.<br>
      <img src="../../assets/help/addsongdatabasecomparedialog.png">
    </p>
    <p>
      Liederen importeren uit de setlist naar de database kan via het uitklapvenster naast dienst opslaan.<br>
      De liederen worden dan vergeleken met de database en je kan dan kiezen tussen, vervangen, toevoegen of niets doen..<br>
      Ook hier zoekt hij naar liederen die het meest op de liederen uit de setlist in de database lijken.<br>
      <i>opm.: toevoegen aan de cloud database kan alleen wanneer je daarvoor de bewerk api-key in de instellingen hebt opgegeven van de actieve online database.</i><br>
      <img src="../../assets/help/addsetlistsongtodatabase.png"><br>
      <img src="../../assets/help/addsetlistsongtodatabasedialog.png">
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
      Automatische splitsing aantal regels beamer
    </div>
    <p>
      Onder het tabblad "instellingen" kan je eventueel de automatische splitsing naar 4 regels op de beamer uit zetten.<br>
      (Onder de programma instellingen zijn deze 4 regels ingesteld of algemeen aanpasbaar.)<br>
      <img src="../../assets/help/addsongsettings.png">
    </p>
    <div class="text-h6 q-mb-md">
      Afwijkende achtergrond
    </div>
    <p>
      Onder het tabblad "achtergrond" kan je eventueel een afwijkende achtergrond kiezen voor dit onderdeel.<br>
      Tevens kan je hier de achtergrond donkerder maken voor bijv. leesbaarheid teksten. (nvt tijdens clear)<br>
      <img src="../../assets/help/songachtergronddialog.png"><br>
      <img src="../../assets/help/achtergronddonkerder.png">
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
      <i>Let op dat alle wijzigingen die je aanbrengt direct worden toegepast in de setlist.</i> (excl. het onderdeel in live).<br>
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
