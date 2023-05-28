# ![VezyWorship](/public/icons/favicon-32x32.png) VezyWorship

## Code opmaak afspraken / Notaties:
- PascalCase : <MessageControl /> (ook bestandsnaam)
  - eigen componenten
  - _Voor eigen componenten is de conventie om ze als PascalCase te noteren: <MessageControl />. Ook de bestandsnaam daarop aanpassen. (met een hoofdletter beginnen)_
- kebab-case : message-input
  - classes
  - id's
  - _Voor classes en id's is het de conventie om ze als kebab-case te noteren: message-input_
- camelCase : messageText
  - variabelen
  - methoden
  - _Voor variabelen en methoden is het de conventie om ze als camelCase te noteren. Bijv. messageText (hoofdletter T)_

## Ontwikkelaar Installatie:
- vs-code: https://code.visualstudio.com
- nodejs: https://nodejs.org
- Java jdk: https://jdk.java.net/19 / https://www.oracle.com/eg/java/technologies/downloads/#jdk19-windows
- git: https://git-scm.com

### Start vs-code:
in terminal:
```
  git config --global user.name "...github username..."
  git config --global user.email "...github mailadres..."
  npm install -g @vue/cli
```
### Inladen VezyWorship project:
- in VS-code, Get-Started ==> Clone Git Repository
  - `https://github.com/VEZwolle/vezy-worship`
  - Selecteer map waar bestanden komen.
  - Open --> cloned repository
- in terminal, in rootmap van project uitvoeren:
  `npm install`
  `npm i-g firebase-tools`
- in terminal, in rootmap\api van project uitvoeren:
  `npm install`
- in terminal, in rootmap van project uitvoeren: 
  `npm run serve`   --> Start Vezyworship web-app: `https://localhost:8080`
- in terminal, in rootmap van project uitvoeren: 
  `npm run api:serve`   --> Start Vezyworship-API : `https://127.0.0.1:5002` `https://127.0.0.1:4000/functions`
  - opmerking: api-key's & secrets los instellen ( niet algemeen toegankelijk, voor testen zelf aanmaken )
    `.env` bestand in api map: (deze ook in firebase secrets voor api zijde deploy)
    ```
      PCOCLIENTID=...
      PCOCLIENTSECRET=...
      DEEPL_API_KEY=...
      API_URL=http://localhost:5000/api of .../api
    ```
- in terminal, in rootmap van project uitvoeren: (niet gelijk met webapp; wel api benodigd)
  `npm run electron:serve`   --> Start Vezyworship desktop app
### firebase functions:
- Inloggen / uitloggen
  - `firebase login` 
  - `firebase logout`
- Show firebase projecten
  - `firebase projects:list`
- Koppel / ontkoppel firebase project vezy-worship
  - `firebase use vezy-worship`
  - `firebase use --clear`

- Stel secrets in in firebase en controleer ze (kan ook in google cloud via security manager)
  - `firebase functions:secrets:set API_URL`
  - `firebase functions:secrets:access API_URL`
- Deploy firebase functions (api) [gebruikt voor web-app en desktop app]
  - `firebase login` 
  - `firebase use vezy-worship`
  - `firebase deploy --only functions`
- Deploy web-app
  - github actions: zie `.github\workflows\firebase-deploy.yml`

### build desktop app:
- in terminal, in rootmap van project uitvoeren: (bij wijziging van dependency)
    `npm install`
- in terminal, in rootmap\api van project uitvoeren: (bij wijziging van dependancy)
    `npm install`
- in terminal, in rootmap van project uitvoeren: 
    `npm run electron:build`
    --> installatie bestand: `...\dist\electron\Packaged\...exe`
    --> gebuikt de firebase api voor connectie met DeepL, PCO, Bible import

### VS-code extentions die ik gebruik:
- es6-string-html
- HTML Format
- Vue Language Features (Volar)

### Git merge branch (in vs-code)
Laatste versie 'main' branch naar je ontwikkel branch plaatsen:
- Pull de laatste versie van 'main'
- Ga naar de nieuwe branch '...' waar je 'main' in wilt mergen
- ctrl + shift + P en typ: "Git: merge branch"
- selecteer 'main'
- Nu zie je in de git toolbar (links) alle merge confilcts. Dit zijn de zaken die conflecteren met de nieuwe code op 'main'
- Los de merge conflicts op door op alle confilterende bestanden te klikken en rechts te kiezen welke code "klopt".
- Commit de "merge commit"
