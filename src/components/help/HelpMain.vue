<template>
  <div>
    <div class="text-h4 q-mb-md">
      <img src="../../../public/icons/favicon-32x32.png">
      VezyWorship
    </div>
    <p>
      Presentatiesoftware voor beamer én livestream met afzonderlijke weergave voor beamer en livestream.<br>
      De beamer & livestream uitvoer zijn tevens voorzien van het alpha channel (en kan ook voor chroma key worden gebruikt).<br>
      Tevens is er een stage & PCO live weergave aanwezig mogelijk.
    </p>
    <p>De dienst is thuis voor te bereiden via de web app. En in de kerk te openen op de desktop met uitvoer naar de verschillende schermen.</p>
    <p>Tijdens de dienst kunnen er mededelingen/oproepen boven in het scherm weergeven worden.</p>
    <div class="text-h6 q-mb-md">
      Verschillende presentatie-types:
    </div>
    <ul>
      <li>
        Liederen
        <ul>
          <li>Liederen als 2-regel op livestream en bijvoorbeeld 4-regel op beamer.</li>
          <li>Automatische liedvertaling d.m.v. <a href="https://www.deepl.com/whydeepl" target="_blank">DeepL</a>.</li>
          <li>Diverse song bewerk hulpmiddelen; o.a. automatisch splitsen liedtekst en vertaling.</li>
          <li>Liederen database lokaal en online (gedeeld) via <a href="https://www.algolia.com/" target="_blank">Algolia</a>.</li>
        </ul>
      </li>
      <li>
        Bijbelteksten
        <ul>
          <li>Teksten worden automatisch op kortere lengte gesplitst voor de livestream tov de beamer.</li>
          <li>Teksten kunnen vanuit een database worden toegevoegd vanaf verschillende vertalingen. (NBV21/NBV/HSV/NBG/BGT)</li>
        </ul>
      </li>
      <li>
        Afbeeldingen
        <ul>
          <li>Er kunnen verschillende afbeeldingen voor beamer & livestream worden gebruikt.</li>
          <li>Bij PNG bestanden wordt de transparantie uit de afbeelding meegenomen.</li>
          <li>Via de geavanceerde opties kan de afbeelding verschaald, gedraaid & verplaatst worden.</li>
          <li>Standaard zijn de sheets voor de collecte, nazorg en einde dienst aanwezig.</li>
        </ul>
      </li>
      <li>
        Video's
        <ul>
          <li>Er is een aftel klok zichtbaar met nog af te spelen tijd.</li>
          <li>Er kan vooraf een start en eindpunt worden ingesteld voor afspelen van een deel</li>
        </ul>
      </li>
      <li>
        Titels & tekst (naambalk, melding, etc.)
        <ul>
          <li>Ondertitels (naambalk, melding, etc.) voor op de livestream incl. mogelijkheid tot automatische splitsing tov beamer tekst.</li>
          <li>Verschillende opmaken om dezelfde teksten op de beamer te tonen.</li>
        </ul>
      </li>
      <li>Aftelklok of tijd tot begin van de dienst</li>
      <li>
        Importeren gegevens uit <a href="https://planningcenteronline.com" target="_blank">PCO</a>
        <ul>
          <li>Importeren van de onderdelen/setlist tijdens dienst</li>
          <li>Keuze voor import van import naar Song/Titel/Bijbeltekst</li>
          <li>Titel, spreker, host & aanbiddingsteam</li>
        </ul>
      </li>
    </ul>
  </div>
  <div class="text-h6 q-mb-md">
    Basis instellingen:
  </div>
  <p>
    Via de knop <img src="../../assets/help/buttonsettings.png"> rechts boven in het scherm kan je diverse instellingen doen.<br>
    Na wijzigen moet de desktop app opnieuw opgestart worden. (de instellingen worden per pc opgeslagen.)<br>
    <ul>
      <li>
        Bij de desktop app kan je instellen naar welk scherm welke uitvoer toe moet.
      </li>
      <li>
        Bij de web-app is de monitor keuze niet aanwezig; hier zijn 3 knoppen aanwezig <img src="../../assets/help/buttonoutput.png"> om het uitvoerscherm van de beamer, de livestream & de stageweergave te tonen in een nieuw browser venster.
      </li>
      <li>
        De PCO live weergave kan je starten met de knop <img src="../../assets/help/pcolive.png"> , met de rechter muisknop op deze knop kan je dit scherm ook leeg maken of een andere live dienst uit PCO kiezen via de id.
      </li>
      <li>
        Een achtergrond kleur instellen voor de livestream en beamer bijv. voor gebruik van de chroma en/of alpha key (of weer leeg gehaald worden voor standaard waarden).
      </li>
      <li>
        Welk thema je wilt gebruiken voor (liederen) weergave: Standaard bovenin of Glow (gecentreerd in midden met capitalen).
      </li>
      <li>
        Hoeveel regels de liedtekst standaard gesplitst moet worden op de beamer.
      </li>
      <li>
        Welke liederen database gebruikt moet worden standaard, de lokale of een van de cloud versies.<br>
        In welke collectie je standaard wilt zoeken.<br>
        Welk lokale database bestand je wilt gebruiken.<br>
        De cloud database downloaden voor lokaal gebruik.<br>
        En je kunt de lokale database hier bewerken evenals de cloud versie mits je de juiste rechten hebt.
      </li>
      <li>
        De app in donkere modes wilt weergeven ipv de standaard lichte weergave versie.
      </li>
    </ul>
  </p>
  <div class="text-h6 q-mb-md">
    Gebruik cloud functies:
  </div>
  <p>
    Voor het gebruik van onderstaande functies is een api - key nodig.<br>
    (op te vragen bij de makers van VezyWorship & in het teams kanaal van projectie)<br>
    <q-list dense>
      <q-item v-for="(apiFunction, index) in apiFunctions" :key="`api${index}`">
        <q-item-section avatar>
          <q-icon color="primary" :name="apiFunction.icon" />
        </q-item-section>
        <q-item-section>{{ apiFunction.name }}</q-item-section>
      </q-item>
    </q-list>
    Via de knop <img src="../../assets/help/buttonsettings.png"> rechts boven in het scherm kan je de api-key instellen.<br>
    Na wijzigen moet de desktop app opnieuw opgestart worden. (de instellingen worden per pc/browser opgeslagen.)<br>
  </p>
</template>

<script>
export default {
  data () {
    return {
      apiFunctions: [
        {
          name: 'Inladen verzen uit de bijbel vertalingen',
          icon: 'menu_book'
        },
        {
          name: 'Inladen planning / liederen uit planning center online (PCO)',
          icon: 'list'
        },
        {
          name: 'Vertaling & taal splitsen via DeepL',
          icon: 'translate'
        },
        {
          name: 'Zoeken & downloaden liederen via cloud (Algolia)',
          icon: 'img:images/algolia-mark.svg'
        }
      ]
    }
  }
}
</script>
