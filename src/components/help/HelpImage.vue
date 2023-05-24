<template>
  <div>
    <div class="text-h4 q-mb-md">
      <img src="../../../public/icons/favicon-32x32.png">
      Afbeeldingen toevoegen / wijzigen
    </div>
    <div class="text-h6 q-mb-md">
      Nieuw afbeelding toevoegen aan setlist:
    </div>
    <p>
      Via de <img src="../../assets/help/setlistadd.png">in het linker vak, onderin; kies je <img src="../../assets/help/setlistaddimage.png">
    </p>
    <p>
      Je zie nu onderstaand scherm verschijnen.<br>
      <img src="../../assets/help/addimagedialog.png"><br>
      Kies hier een afbeeldingbestand door in het vak <img src="../../assets/help/imageselecteerafbeeldingen.png"> te klikken<br>
      Onder zie je nu een voorbeeld van het bestand verschijnen.<br>
      Hierna kan je eventueel de <i>naam</i> nog invullen.<br>
      In basis wordt de afbeelding op de beamer en op de livestream getoond.<br>
      Dit kan je veranderen door op de knop <img src="../../assets/help/imagezelfde.png"> te klikken en dan via <img src="../../assets/help/imageselecteerlivestream.png"> een ander bestand te kiezen.<br>
      Via de knop "Standaard" zijn de standaard sheets uit VezyWorship (extra) toe te voegen.<br>
      Zie onder wat aandachtspunten & andere opties.<br>
      <img src="../../assets/help/imagedialog.png">
    </p>
    <p>
      <b><u>Naam</u></b><br>
      De naam is voor je zelf en wordt nergens op de beamer of livestream getoond.<br>
      Standaard wordt hier de bestandsnaam van de afbeelding geplaatst na inladen afbeelding.
    </p>
    <p>
      <b><u>Selecteer afbeeldingen</u></b><br>
      Hier kan je afbeeldingen selecteren, deze worden tevens ook opgeslagen in de *.vez bestand.
    </p>
    <p>
      <i><u>aandachtspunten / opmerkingen:</u></i>
      <ul>
        <li>
          De bestanden worden ongewijzigd opgeslagen in het *.vez bestand.<br>
          opm. Erg grote bestanden (groter 1920x1080) kunnen het beste vooraf verkleind worden om laadtijd te verkleinen.
        </li>
        <li>
          De transparantie van *.png afbeeldingen wordt herkend en toegepast.<br>
          t.p.v. transparante vlakken wordt de basis achtergrond of de camerabeelden bij de livestream zichtbaar.
        </li>
        <li>
          Er moet altijd een bestand gekozen zijn. <br>
          Leeg bij de livestream betekend: gebruik het zelfde bestand als de beamer.<br>
          Beide leeg: geeft een nietgevonden afbeelding figuur op beamer en livestream weer.
        </li>
        <li>
          Wanneer je op de livestream of beamer geen afbeelding wilt zin kan je de afbeelding via de geavenceerde instellingen buiten beeld schuiven.
        </li>
      </ul>
    </p>
    <p>
      <b><u>knop: zelfde bestand & positie</u></b><br>
      <ul>
        <li>
          <i>Naar rechts geschoven</i> wordt op de livestream hetzelfde als op de beamer getoond. Het terug zetten naar rechts reset dit ook.
        </li>
        <li>
          <i>Naar links geschoven</i> is de livestream verschillend van de beamer.<br>
          Dit kan een verschillende afbeelding zijn; maar hoeft niet.<br>
          via de geavenceerde instellingen kan je ook alleen de positie/grootte wijzigen.
        </li>
      </ul>
    </p>
    <div class="text-h6 q-mb-md">
      Geavenceerde instellingen
    </div>
    <p>
      Onder de voorbeeld afbeelding staat de knop <img src="../../assets/help/imagegeavenceerd.png">.<br>
      Wanneer je deze aan zet (naar rechts) verschijnen een aantal extra schuifbalken.<br>
      <img src="../../assets/help/imagegeavenceerd2.png"><br>
      <q-list bordered separator>
        <q-item borderd dense>
          <q-item-section top side>
            Formaat
          </q-item-section>
          <q-item-section>
            Met de bovenste balk kan je de afbeelding in en uitzoomen waardoor het formaat wijzigd.<br>
            Met de knop ↔ of ↕ kan je de afbeelding passend in breedte of hoogte laten schalen. Deze knop wisseld bij aanklikken.
          </q-item-section>
        </q-item>
        <q-item borderd dense>
          <q-item-section top side>
            Rotatie
          </q-item-section>
          <q-item-section>
            Met de 2e balk kan je de afbeelding naar links of rechts draaien.<br>
            Met de knop 🗘 wordt de afbeelding weer in originele stand geplaatst.
          </q-item-section>
        </q-item>
        <q-item borderd dense>
          <q-item-section top side>
            Positie
          </q-item-section>
          <q-item-section>
            Met de 2 balken link en onder de afbeelding kan je de afbeelding verticaal en horizontaal verplaatsen.<br>
            In het midden staan 9 knoppen waarmee je de afbeelding kan laten uitlijnen naar de randen, hoeken en midden.<br>
          </q-item-section>
        </q-item>
        <q-item borderd dense>
          <q-item-section top side>
            Reset
          </q-item-section>
          <q-item-section>
            Door de knop "Geavenceerde instellingen" weer naar links te zetten wordt alles weer teruggezet in basis waarden.<br>
          </q-item-section>
        </q-item>
      </q-list>
    </p>
    <div class="text-h6 q-mb-md">
      Afwijkende achtergrond
    </div>
    <p>
      Onder het tabblad "achtergrond" kan je eventueel een afwijkende achtergrond kiezen voor dit onderdeel.<br>
      Tevens kan je hier de achtergrond donkerder maken voor bijv. leesbaarheid teksten.<br>
      <img src="../../assets/help/scriptureachtergronddialog.png"><br>
      <img src="../../assets/help/achtergronddonkerder.png">
    </p>
    <div class="text-h6 q-mb-md">
      Controle Voorbeeld / Live bediening
    </div>
    <p>
      Na opslaan/sluiten van het invoerscherm kan je in de basis omgeving een controle uitvoeren door de pagina te bekijken.<br>
      Een afbeelding bestaat uit 1 pagina.<br>
      Bovenin kan je wel kiezen vie 3 tabbladen welke uitvoer (beamer / livestream) je wilt zien in de control. Beide blijven echter wel uitgezenden worden.<br>
      Onder in het scherm zie je een voorbeeld.<br>
      <img src="../../assets/help/imagecontrol.png">
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
