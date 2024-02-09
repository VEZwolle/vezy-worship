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
  - `npm install`
  - `npm i -g firebase-tools`
- in terminal, in rootmap\api van project uitvoeren:
  - `npm install`
- in terminal, in rootmap van project uitvoeren: 
  - `npm run serve`   --> Start Vezyworship web-app: `https://localhost:8080`
- in terminal, in rootmap van project uitvoeren: 
  - `npm run api:serve`   --> Start Vezyworship-API : `https://127.0.0.1:5002` `https://127.0.0.1:4000/functions`
  - `npm run api:get-data`  --> get firestore export data uit google cloud to local emulator
  - `npm run api:update-data` --> export data firesore to google cloud to local emulator
  - `npm run api:serve-data`   --> Start Vezyworship-API + locale database: `https://127.0.0.1:5002` `https://127.0.0.1:4000/functions`
  - opmerking: locale database bestanden eerst uit firestore halen; zie onder.
- api-key's & secrets los instellen in /api/.. ( niet algemeen toegankelijk, voor testen zelf aanmaken )
  - `.env` bestand in api map: --> ook als secret `FIREBASE_FUNCTIONS_ENV_FILE` in Github secrets plaatsen (Bij deploy wordt dan een .env aangemaakt.)
  ```
    API_URL=.../api
    VEZY_API_TOKEN=...
    PCOCLIENTID=...
    ALGOLIA_APP_ID=...
    ALGOLIA_INDEX_NAME=...
    ALGOLIA_API_KEY_SEARCH=...
    ALGOLIA_USER=...
    ALGOLIA_INDEX_NAME_1=...
    ALGOLIA_API_KEY_EDIT_1=...
    VEZY_API_TOKEN_EDIT_1=...
  ```
  `.secret.local` (deze ook in firebase secrets manager plaatsen | https://console.cloud.google.com/security/secret-manager)
  ```
    DEEPL_API_KEY=...
    PCOCLIENTSECRET=...
    ALGOLIA_API_KEY_EDIT=...
    VEZY_API_TOKEN_EDIT=...
  ```  
  `.env.local` (overruled .env voor local dev.)
  ```
    API_URL=http://localhost:5000/api
  ```
- in terminal, in rootmap van project uitvoeren: (niet gelijk met webapp; wel api benodigd)
  - `npm run electron:serve` --> Start Vezyworship desktop app
  - `npm run electron:build` --> Build desktop
  - `npm run electron:build-debug` --> Build desktop app met debug venster
  - `npm run electron:release` --> Build en release toe github (draft)
### firebase functions:
- Install
  - `npm i -g firebase-tools`
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
- Deploy electron-app install
  - github actions: zie `.github\workflows\electron-deploy.yml`
### google cloud functions:
- Install Google cloud SDK: 
  - https://cloud.google.com/sdk/docs/install-sdk --> windows installatie + standaard instellingen
- Inloggen / uitloggen
  - `gcloud auth login` 
  - `gcloud auth revoke`
- Show google cloud projecten
  - `gcloud projects list`
- Koppel / ontkoppel google cloud project vezy-worship
  - `gcloud config set project vezy-worship`
  - `gcloud config unset project`
### export firestore database to google cloud to local emulator firestore
- Maak storage bucket aan in google cloud voor export van firestore database
  - https://console.cloud.google.com/ --> Cloud Storage --> Buckets --> +create
  - bucket name: `export-import-vezy-worship`
- Export your production data to a Google Cloud Storage bucket
  - `gcloud firestore export gs://export-import-vezy-worship/export-firestore`
- copy this folder to your local machine
  - `cd dev` > `gsutil -m cp -r gs://export-import-vezy-worship/export-firestore .`
- Updaten? eerst map lokaal en storage legen; daarna opnieuw exporteren
  - Remove local map:
    - `cd dev` > `rm -r ./export-firestore`
  - Remove data uit cloud storage (voor nieuwe export):
    - `gsutil -m rm -r gs://export-import-vezy-worship/export-firestore`

### build desktop app:
- in terminal, in rootmap van project uitvoeren: (bij wijziging van dependency)
    `npm install`
- in terminal, in rootmap\api van project uitvoeren: (bij wijziging van dependancy)
    `npm install`
- in terminal, in rootmap van project uitvoeren: 
    - `npm run electron:build`
    - -> installatie bestand: `...\dist\electron\Packaged\...exe`
    - -> gebuikt de firebase api voor connectie met DeepL, PCO, Bible import

### Aanmaken Algolia zoek index:
- via algolia.com
  - index(es) aanmaken
  - json van database lokaal importeren (.vezdb uitpakken = zip)
  - Searchable attributes: title(o) > collection(o) > number (o) > lyrics(u)
  - facets (display): collection, maxFacetHits = 50 (of anders afhankelijk aantal collections)
  - get api-key's
  - ps. onder de /dev/export-algolia-settings.json is een instelling bestand te vinden.
  - Basis gebruikt nu 2 databases, kan je ook 1 of meer van maken; pas hiervoor ondertaande bestanden aan:
    `\api\index.js` > `function algoliaIndexName, algoliaApiKeyEdit, vezApiTokenEdit`
    `\api\.env` > voer hier de in bovestaand gebruikte variabelen in
    `src\components\song\database\algolia.js` > vul de naamgeving van de databases in `algoliaIndexNames` 

### VS-code extentions die ik gebruik:
- es6-string-html
- HTML Format
- Vue Language Features (Volar)

### Git merge branch (in vs-code)
Laatste versie 'dev' branch naar je ontwikkel branch plaatsen:
- Pull de laatste versie van 'dev'
- Ga naar de nieuwe branch '...' waar je 'dev' in wilt mergen
- ctrl + shift + P en typ: "Git: merge branch"
- selecteer 'dev'
- Nu zie je in de git toolbar (links) alle merge confilcts. Dit zijn de zaken die conflecteren met de nieuwe code op 'dev'
- Los de merge conflicts op door op alle confilterende bestanden te klikken en rechts te kiezen welke code "klopt".
- Commit de "merge commit"
