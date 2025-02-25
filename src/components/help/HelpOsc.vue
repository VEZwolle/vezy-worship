<template>
  <div>
    <div class="text-h4 q-mb-md">
      <img src="../../assets/help/logo.png">
      OSC (Open Sound Control)
    </div>
    <div class="text-h6 q-mb-md">
      Functies:
    </div>
    <p>
      VezyWorship kan OSC commando's & platte teksten uitsturen naar een andere computer.<br>
      Getest is het gebruik icm Resolume Avenue v7.13.<br>
      <i>OSC werkt alleen in de desktop (electron) versie, en dient in de instellingen aangezet te worden.</i>
    </p>
    <p>
      De commando's worden steeds 1x verstuurd op moment van activeren.<br>
      Bij het live zetten van een item (Go-Live of clear uit, wordt zowel het item geactiveerd als dat de eventuele teksten worden verstuurd).<br>
      Bij het wijzigen van een te tonen tekstregel in een item, worden alleen de tekst commando's met teksten verstuurd.
    </p>
    <p>
      Het gaat hierbij om de volgende commando's met adres en waarde:
    </p>
    <ul>
      <li>
        <b>Clear (leeg halen scherm)</b><br>
        - adres<br>
        - geen waarde
      </li>
      <li>
        <b>Go-Live (Activeren item)</b><br>
        - adres<br>
        - waarde: 1
      </li>
      <li>
        <b>Teksten (diverse teksten zonder opmaak)</b><br>
        - adres<br>
        - waarde: 'tekst'
        <ul>
          <li>
            Lied: Tekst & Vertaling
          </li>
          <li>
            Titel / Bijbeltekst: Tekst & Titel
          </li>
          <li>
            Countdown: Tekst (tijd)
          </li>
        </ul>
      </li>
    </ul>
    <p>
      Instellingen kunnen algemeen gemaakt worden, maar ook per item, overrullend, in de setlist ingesteld worden.<br>
    </p>
    <p class="text-h6 q-mb-md">
      Algemene instellingen:
    </p>
    <p>
      <img src="../../assets/help/oscsettingsdialogmain.png">
    </p>
    <ul>
      <li>
        Aan/Uit van de OSC functie
      </li>
      <li>
        Adres: Vul hier het IP nummer of DNS naam in van de ontvangende computer
      </li>
      <li>
        Port: Vul hier het poort nummer in van het programma op de ontvangende computer
      </li>
      <li>
        Standaard bestemmingen: Vul hier per item in welke commando (bestemming) gebruikt moet worden.<br>
        - clear:  clear<br>
        - Go-Live:  song, caption[opmaaktype], countdown, image[defaulttype]<br>
        - Tekst, Title, Vertaling: [..]text, [..]title, [..]translation 
      </li>
    </ul>
    <p>
      De bovestaande lijst kan ook geexporteerd worden als gezipt json file, of weer geimporteerd;<br>
      daarnaast kan er een default voorbeeld in geplaatst worden die samen werkt met het <a href="https://github.com/VEZwolle/vezy-worship/blob/dev/dev/VezyResolumeOSC.avc" target="_blank">voorbeeldestand</a> in resolume.<br>
    </p>
    <p class="text-h6 q-mb-md">
      Instellingen per item
    </p>
    <p>
      Dit is alleen beschikbaar in de desktop versie, waarbij OSC is aangezet in de instellingen<br>
      Ga tijdens bewerken van het item naar het tabblad OSC en vul onderstaande waarden in.<br>
      Afhankelijk item type zijn er 1 of meerdere instellingen mogelijk.<br><br>
      clip: te activeren item<br>
      text, title, translation: bestemming waar de tekst heen gestuurd word.<br>
      <img src="../../assets/help/oscsetttingsitem.png">
    </p>
    <p class="text-h6 q-mb-md">
      Output OSC aan
    </p>
    <p>
      In de uitvoer weergave onderin wordt aangegeven of de osc commando's worden verstuurd.<br>
      <img src="../../assets/help/oscaanmelding.png">
    </p>
    <div class="text-h6 q-mb-md">
      Lijst instelbare waarden per item (algemeen)
    </div>
    <q-list bordered separator>
      <q-item v-for="(value, name) in oscOutputs" :key="name" borderd dense>
        <q-item-section>{{ name }}</q-item-section>
      </q-item>
    </q-list>
    
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import oscOutputs from '../osc-output-settings.js'

export default defineComponent({
  name: 'HelpSong',
  setup () {
    return {
      oscOutputs
    }
  }
})
</script>
