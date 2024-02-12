<template>
  <div>
    <div class="text-h4 q-mb-md">
      <img src="../../../public/icons/favicon-32x32.png">
      Dienst & onderdelen lijst
    </div>
    <div class="text-h6 q-mb-md">
      Openen / opslaan dienst
    </div>
    <p>
      De diensten worden opgeslagen met de *.vez extensie.<br>Afbeeldingen, teksten, video's worden alle in dit bestand mee opgeslagen.<br>
      Openen van een opgeslagen dienst kan door op de knop <img src="../../assets/help/fileopen.png"> te klikken, of je kan via <img src="../../assets/help/filesaveas.png"> kiezen voor toevoegen aan huidige setlist.<br>
      Opslaan naar een bestand gebeurd met de knop <img src="../../assets/help/filesave.png"> of je kan via <img src="../../assets/help/filesaveas.png"> kiezen voor opslaan als een nieuw bestand.
    </p>
    <p>
      Let op! Er wordt niet automatische opgeslagen tijdens bewerken of sluiten van het programma, dit moet je zelf handmatig doen.
    </p>
    <div class="text-h6 q-mb-md">
      Nieuwe dienst maken
    </div>
    <p>
      Klik bovenin op de knop <img src="../../assets/help/newservice.png"> en vul in het scherm de verschillende gegevens in en klik daarna op opslaan:<br>
      Zie onderaan voor uitleg importeren gegevens uit planningcenteronline (PCO).
    </p>
    <ul>
      <li>
        Datum en starttijd van de dienst. (Standaard wordt hier de eerstvolgende zondag voor aangehouden).<br>
        <i>Op basis van de tijd wordt een aftelklok toegevoegd voor de livestream.</i>
      </li>
      <li>
        Thema(titel) dienst, Naam van de host, spreker & het aanbiddingsteam.<br>
        <i>Hier worden titelbalken voor aangemaakt. (alleen wanneer ingevuld)</i>
      </li>
      <li>
        Kies een achtergrond afbeelding uit een bestand (in formaat uitvoerscherm 1920x1080).<br>
        <i>
          Deze afbeelding wordt standaard tijdens de dienst als achtergrond op de beamer getoond.
          (achteraf ook aan te passen)<br>
          Let op wanneer je gebruik maakt van de beamer alpha uitvoer, kies hier dan geen afbeelding!
        </i>
      </li>
      <li>
        Onderstaande onderdelen worden standaard toegevoegd aan de dienst.
        <ul>
          <li>Collecte</li>
          <li>Nazorg</li>
          <li>Einde dienst / gezegende zondag</li>
        </ul>
      </li>
    </ul>
    <img src="../../assets/help/newservicedialog.png">
    <p>
      Je ziet nu onderstaande onderdelen lijst van de dienst in beeld komen.<br>
      Door op het potloodje te klikken kan je bovenstaande bewerken.<br>
      <img src="../../assets/help/newservicesetliststart.png">
    </p>
    <div class="text-h6 q-mb-md">
      Onderdelen toevoegen
    </div>
    <p>
      Via de <img src="../../assets/help/setlistadd.png">In het linker vak, onderin kan je onderdelen toevoegen.<br>
      Kies uit de lijst wat voor onderdeel je wilt toevoegen. (zie voor verdere info het betreffende onderdeel). Het onderdeel wordt dan onder in de lijst toegevoegd.<br>
      <img src="../../assets/help/setlistaddchoice.png"><br>
      Ook via de resultaten in het zoekvenster kunnen liederen door dubbelklik of de setlist knop toegevoegd worden.<br>
      <img src="../../assets/help/quicksearch2.png">
    </p>
    <div class="text-h6 q-mb-md">
      Onderdelen bewerken
    </div>
    <p>
      Optie 1: Selecteer het onderdeel en kies aan het einde van de regel het potloodje.<br>
      Optie 2: Klik met de rechtermuisknop op het onderdeel; er verschijnt een menu en kies dan bewerken.<br>
      <img src="../../assets/help/setlistedit.png">
    </p>
    <div class="text-h6 q-mb-md">
      Onderdelen verwijderen uit de lijst
    </div>
    <p>
      Optie 1: Selecteer het onderdeel en kies aan het einde van de regel het kruisje.<br>
      Optie 2: Klik met de rechtermuisknop op het onderdeel; er verschijnt een menu en kies dan verwijderen.<br>
    </p>
    <div class="text-h6 q-mb-md">
      Onderdelen verplaatsen in de lijst
    </div>
    <p>
      Selecteer het onderdeel met de linkermuisknop (ingedrukt houden) en sleep hem naar de plak waar je hem wilt hebben waarna je de muisknop weer los laat.
    </p>
    <div class="text-h6 q-mb-md">
      Gegevens importeren uit planningcenteronline (PCO)
    </div>
    <p>
      Wanneer u een account op PCO hebt kan je de dienst onderdelen importeren.<br>
      Klik hiervoor in het "Nieuwe/bewerken dienst" dialoog venster op <img src="../../assets/help/importknoppco.png">.<br>
      De eerste keer wordt u gevraagd worden om in te loggen, en toestemming te geven dat VezyWorship toegang heeft via uw account.<img src="../../assets/help/pcoaccess.png">
    </p>
    <p>
      Nadat u ingelogd bent krijgt u direct de eerstvolgende dienst te zien (waar u toegang tot hebt)
      of u moet opnieuw vragen om de gegevens (na inloggen) op te halen uit PCO via de knop <img src="../../assets/help/importknoppco2.png">.
      Kies daarna het diensttype en daarna de dienstdatum om de dienst te laden.<br>
      <img src="../../assets/help/pcodiensttype.png"> <img src="../../assets/help/pcodienstdatum.png"><br>
      Wanneer u de dienst niet ziet staan kunt u deze ook inladen via het PCO id, kies hiervoor de knop <img src="../../assets/help/pcoidknop.png"> onder aan de lijst met toekomstige datums.
      U kan daarna het ID vanaf de PCO site invoeren om die dienst in te laden.<br>
      <img src="../../assets/help/importpco.png">
    </p>
    <p>
      Nu u de gegevens uit PCO zit kunt u:
      <ul>
        <li>
          Bovenin dubbelklik op de namen deze toevoegen aan VezyWorship, of via de knop "Update gegevens" alle gelijk.<br>
          Achter de namen kunt u met een vinkje of kruisje zien welke gegevens reeds overgenomen zijn.
        </li>
        <li>
          In het onderste deel kunt u aanvinken welke onderdelen geïmporteerd moeten worden naar VezyWorship.<br>
          Via de knoppen onderin kunt u in 1x alles aan/uit of alleen alle liederen e.d. aan/uit zetten.<br>
          Mocht het type niet juist herkend zijn kunt u dat aanpassen door op het symbool voor het onderdeel te klikken om te wisselen.<br>
        </li>
        <li>
          De gegevens uit de titel, de beschrijving, de details en bij liederen ook eventueel uit de lyrics worden overgenomen.<br>
          Mocht hier overlap in zitten bijv. zowel details als ook lyrics worden ze beiden geimporteerd in 1 onderdeel met een appart label hier boven.
        </li>
        <li>
          Alleen de onderdelen die tijdens de dienst voorkomen worden weergegeven; onderdelen voor of na de dienst niet.
        </li>
      </ul>
      En aan het einde klikt u op Opslaan.<br>
      Via bewerken van de dienst kunt u eventueel ook later weer onderdelen vanuit PCO toevoegen; reeds geïmporteerde worden niet overschreven.
    </p>
  </div>
</template>
