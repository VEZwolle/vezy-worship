<template>
  <div>
    <div class="text-h4 q-mb-md">
      <img src="../../../public/icons/favicon-32x32.png">
      VezyWorship
    </div>
    <p>
      Presentatiesoftware voor beamer én livestream met afzonderlijke weergave voor beamer en livestream.<br>
      De livestream uitvoer is voorzien van het alpha channel (en kan ook voor chroma key worden gebruikt).
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
          <li>Bij PNG bestanden wordt de transperantie uit de afbeelding meegenomen.</li>
          <li>Via de geavenceerde opties kan de afbeelding verschaald, gedraaid & verplaatst worden.</li>
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
      <li>Titels (naambalk, melding, etc.)
        <ul>
          <li>Ondertitels (naambalk, melding, etc.) voor op de livestream</li>
          <li>Verschillende opmaken om dezelfde teksten op de beamer te tonen.</li>
        </ul>
      </li>
      <li>Aftelklok of tijd tot begin van de dienst</li>
      <li>Importeren gegevens uit <a href="https://planningcenteronline.com" target="_blank">PCO</a>
        <ul>
          <li>Importeren van de onderdelen/setlist tijdens dienst</li>
          <li>Keuze voor import van import naar Song/Titel/Bijbeltekst</li>
          <li>Titel, spreker, host & aanbiddingsteam</li>
        </ul>
      </li>
    </ul>
  </div>
  <div class="text-h6 q-mb-md">
    Basis instellingen output:
  </div>
  <p>
    Via de knop <img src="../../assets/help/buttonsettings.png"> rechts boven in het scherm bij de desktop app kan je instellen naar welk scherm welke uitvoer toe moet.<br>
    Tevens kan je hier eventueel een achtergrond kleur instellen voor de livestream en beamer bijv. voor gebruik van de chroma key (of weer leeg gehaald worden voor standaard waarden).<br>
    Na wijzigen moet de desktop app opnieuw opgestart worden. (de instellingen worden per pc opgeslagen.)<br>
    Bij de web-app is de monitor keuze niet aanwezig; hier zijn 2 knoppen aanwezig <img src="../../assets/help/buttonoutput.png"> om het uitvoerscherm van de beamer & van de livestream te tonen in een nieuw brouwser venster.
  </p>
</template>
