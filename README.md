# VezyWorship - Presentatiesoftware voor beamer én livestream

## Features
- Afzonderlijke weergave op beamer en livestream, bijvoorbeeld:
  - Liederen als 2-regel op livestream en 4-regel op beamer
  - Bijbeltekst als overlay op livestream en volledig scherm op beamer
  - Naambalk wel weergeven op livestream en niet op beamer
- Verschillende presentatie-types:
  - Liederen
  - Bijbelteksten
  - Afbeeldingen en video's
  - Ondertitels (naambalk, melding, etc.)
- Preset slides (collecte, nazorg, naambalk spreker, etc.)
- Automatische liedvertaling d.m.v. DeepL
- Countdown tot begin van de dienst

## Lokale ontwikkelomgeving opstarten
### Front-end
```
npm run serve
```
> Of `npm run electron:serve` voor de desktop app.

### Back-end
```
npm run firebase:serve
```
> De back-end is alleen nodig als je online features wilt gebruiken, zoals Google Translate.

## TO DO
### Must haves
- Achtergrondafbeelding instelbaar
- Countdown timer
- Bijbeltekst

### Should haves
- Preset "slides" (spreker, host, nazorg, collecte)
- Lied-database
- Bijbel-koppeling om Bijbelteksten gemakkelijk in te laden

### Could haves
- Koppeling met Planning Center Online
- Automatisch livestream klaarzetten via Youtube API
- Koppeling met Musixmatch API om snel liedteksten te vinden
