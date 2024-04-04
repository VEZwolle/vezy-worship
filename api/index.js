const functions = require('firebase-functions')
const admin = require('firebase-admin')
const express = require('express')
const cors = require('cors')
const axios = require('axios')

// Initialization
admin.initializeApp()

const db = admin.firestore()

const app = express()
app.use(cors())

/**
 * Check authorization
 */
app.use((req, res, next) => {
  switch (true) {
    case req.originalUrl.startsWith('/api/pco/auth/complete'):
    case req.originalUrl.startsWith('/api/pco/auth/logout'):
      break
    default: {
      if (req.headers.authorization !== process.env.VEZY_API_TOKEN) {
        return res.status(401).json({ api: 'VezyWorshipApi' })
      }
    }
  }
  next()
})

/**
 * Load verse(s) from selected Bible.
 */
app.post('/api/scripture', async (req, res) => {
  const { bible, book, chapter, verseFrom, verseTo } = req.body

  const query = db.collection(bible)
    .where('book', '==', book)
    .where('chapter', '==', chapter)
    .where('verse', '>=', verseFrom)
    .where('verse', '<=', verseTo || verseFrom)

  const result = await query.get()

  const verses = result.docs.map(doc => doc.data())

  res.json({ verses })
})

/**
 * Get language from array lines.
 */
app.post('/api/language', async (req, res) => {
  const textLines = req.body.textLines
  const resultLanguage = []
  for (let k = 0; k < textLines.length; k += 50) { // max 50/sessie
    const data = new URLSearchParams({
      target_lang: 'NL'
    })
    for (let i = k; i < Math.min(textLines.length, k + 50); i++) {
      data.append('text', textLines[i])
    }
    try {
      const result = await axios.post(`https://api-free.deepl.com/v2/translate?auth_key=${process.env.DEEPL_API_KEY}`, data)
      const translations = result.data.translations
      for (const translation of translations) {
        resultLanguage.push(translation.detected_source_language)
      }
    } catch {
      res.status(500).json({ error: 'deepl_error' })
      return
    }
  }
  res.json({ resultLanguage })
})

/**
 * Translate text into Dutch.
 * used in old version < 1.9.6
 */
app.post('/api/translate', async (req, res) => {
  const data = new URLSearchParams({
    text: req.body.text,
    target_lang: 'NL',
    formality: 'more'
  })

  try {
    const result = await axios.post(`https://api-free.deepl.com/v2/translate?auth_key=${process.env.DEEPL_API_KEY}`, data)
    const translation = result.data.translations[0].text
    res.json({ translation })
  } catch {
    res.status(500).json({ error: 'deepl_error' })
  }
})

/**
 * Translate textArray into Dutch.
 */
app.post('/api/translatearray', async (req, res) => {
  const textArray = req.body.textArray
  const resultTranslations = []
  for (let k = 0; k < textArray.length; k += 50) { // max 50/sessie
    const data = new URLSearchParams({
      target_lang: 'NL',
      formality: 'more'
    })
    for (let i = k; i < Math.min(textArray.length, k + 50); i++) {
      data.append('text', textArray[i])
    }
    try {
      const result = await axios.post(`https://api-free.deepl.com/v2/translate?auth_key=${process.env.DEEPL_API_KEY}`, data)
      const translations = result.data.translations
      for (const translation of translations) {
        resultTranslations.push(translation.text)
      }
    } catch {
      res.status(500).json({ error: 'deepl_error' })
      return
    }
  }
  res.json({ resultTranslations })
})

/**
 * PCO.
 */
const oAuthConfig = {
  urlBase: 'https://api.planningcenteronline.com',
  redirectUri: `${process.env.API_URL}/pco/auth/complete`
}
/** PCO, Oauth
 * Goto: `${oAuthConfig.urlBase}/oauth/authorize?client_id=${process.env.PCOCLIENTID}&redirect_uri=${oAuthConfig.redirectUri}&response_type=code&scope=people services`
 */
// PCO, redirectUri
app.get('/api/pco/auth/complete', async (req, res) => {
  const oAuthCode = req.query.code
  const params = new URLSearchParams()
  params.append('grant_type', 'authorization_code')
  params.append('code', oAuthCode)
  params.append('client_id', process.env.PCOCLIENTID)
  params.append('client_secret', process.env.PCOCLIENTSECRET)
  params.append('redirect_uri', oAuthConfig.redirectUri)

  const pcoTokens = {
    refreshToken: '',
    tokenExpiry: 0,
    token: ''
  }

  try {
    const response = await axios.post(`${oAuthConfig.urlBase}/oauth/token`, params)
    pcoTokens.token = response.data.access_token
    // Token lifetime is given in seconds, so multiply by 1000, also subtract 60 seconds from lifetime on our end so we know to refresh the token early
    pcoTokens.tokenExpiry = (response.data.created_at * 1000) + ((response.data.expires_in - 60) * 1000)
    pcoTokens.refreshToken = response.data.refresh_token
    if (pcoTokens.refreshToken) {
      return res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>VezyWorship inlog Planning center online</title></head>
        <body>
          <script>
            const pcoTokens = {
              token: '${pcoTokens.token}',
              tokenExpiry: ${pcoTokens.tokenExpiry},
              refreshToken: '${pcoTokens.refreshToken}'
            };
            window.opener.postMessage(pcoTokens, '*');
            window.close();
          </script>
          <h1>VezyWorship is ingelogd op PCO</h1>
          <p>u kunt dit venster sluiten & verdergaan met ophalen gegevens uit PCO</p>
        </body>
      </html>
    `)
    }
    res.send('Could not log in to Planning Center API using oAuth')
  } catch {
    res.status(500).json({ error: 'Could not log in to Planning Center API using oAuth' })
  }
})

app.post('/api/pco/auth/logout', async (req, res) => {
  const token = req.body.token || ''
  const params = new URLSearchParams()
  params.append('token', token)
  params.append('client_id', process.env.PCOCLIENTID)
  params.append('client_secret', process.env.PCOCLIENTSECRET)

  try {
    const response = await axios.post(`${oAuthConfig.urlBase}/oauth/revoke`, params)
    const status = response.status
    res.json({ status })
  } catch {
    res.status(500).json({ error: 'Could not logout to Planning Center API' })
  }
})

async function oauthRefresh (refreshToken = null) {
  const params = {
    grant_type: 'refresh_token',
    client_id: process.env.PCOCLIENTID,
    client_secret: process.env.PCOCLIENTSECRET,
    refresh_token: refreshToken
  }
  const pcoTokens = {
    refreshToken: '',
    tokenExpiry: 0,
    token: ''
  }

  try {
    const response = await axios({ method: 'POST', url: `${oAuthConfig.urlBase}/oauth/token`, headers: { 'content-type': 'application/json' }, data: params })
    pcoTokens.token = response.data.access_token
    pcoTokens.tokenExpiry = (response.data.created_at * 1000) + ((response.data.expires_in - 60) * 1000)
    pcoTokens.refreshToken = response.data.refresh_token
  } catch {
    // 'Could not refresh oAuth Token with Planning Center API'
    pcoTokens.token = ''
    pcoTokens.tokenExpiry = 0
    pcoTokens.refreshToken = ''
  }
  return pcoTokens
}

app.post('/api/pco', async (req, res) => {
  /*
  console.log(req.body.serviceType)
  console.log(req.body.plan)
  console.log(req.body.itemCount)
  console.log(req.body.item)
  console.log(req.body.token)
  console.log(req.body.tokenExpiry)
  console.log(req.body.refreshToken)
  */
  const pcoTokens = {
    refreshToken: req.body.refreshToken || '',
    tokenExpiry: req.body.tokenExpiry || 0,
    token: req.body.token || ''
  }

  // check if loginauth
  if (!pcoTokens.refreshToken) { // first login
    return res.json({ url: `${oAuthConfig.urlBase}/oauth/authorize?client_id=${process.env.PCOCLIENTID}&redirect_uri=${oAuthConfig.redirectUri}&response_type=code&scope=services` }) // Inlog link
  }
  if (Date.now() > pcoTokens.tokenExpiry) { // tokenHasExpired --> Refresh token
    const responsePcoTokens = await oauthRefresh(pcoTokens.refreshToken)
    pcoTokens.refreshToken = responsePcoTokens.refreshToken
    pcoTokens.tokenExpiry = responsePcoTokens.tokenExpiry
    pcoTokens.token = responsePcoTokens.token
    if (!pcoTokens.refreshToken) { // refresh error --> first login
      return res.json({ url: `${oAuthConfig.urlBase}/oauth/authorize?client_id=${process.env.PCOCLIENTID}&redirect_uri=${oAuthConfig.redirectUri}&response_type=code&scope=services` }) // Inlog link
    }
  }
  // set get data url
  let urlAdd = 'services/v2/service_types'
  if (req.body.item === 'team') { //    get team_members
    urlAdd += `/${req.body.serviceType}/plans/${req.body.plan}/team_members?per_page=50`
  } else if (req.body.item) { //        get item notes
    urlAdd += `/${req.body.serviceType}/plans/${req.body.plan}/items/${req.body.item}?include=item_notes`
  } else if (req.body.plan) { //        get items plan
    if (req.body.itemCount) {
      urlAdd += `/${req.body.serviceType}/plans/${req.body.plan}/items?per_page=${req.body.itemCount}`
    } else { //                         get global plan items
      urlAdd += `/${req.body.serviceType}/plans/${req.body.plan}`
    }
  } else if (req.body.serviceType) { // get plans in future
    urlAdd += `/${req.body.serviceType}/plans?order=sort_date&filter=future&per_page=10`
  } else { //                           get service_types
    urlAdd += `/${req.body.serviceType}?order=name`
  }
  // get data
  try {
    const response = await axios.get(`${oAuthConfig.urlBase}/${urlAdd}`, {
      headers: {
        Authorization: `Bearer ${pcoTokens.token}`
      }
    })
    const data = response.data
    res.json({ data, pcoTokens: { refreshToken: pcoTokens.refreshToken, tokenExpiry: pcoTokens.tokenExpiry, token: pcoTokens.token } })
  } catch (error) {
    if (error.response) { //       The request was made and the server responded with a status code that falls out of the range of 2xx
      const status = error.response.data.errors[0].status
      res.json({ errorStatus: `${status}`, pcoTokens: { refreshToken: pcoTokens.refreshToken, tokenExpiry: pcoTokens.tokenExpiry, token: pcoTokens.token } })
    } else if (error.request) { // The request was made but no response was received
      res.status(500).json({ error: 'pco_error geen response .../api/pco' })
    } else { //                    Something happened in setting up the request that triggered an Error
      res.status(500).json({ error: 'pco_error .../api/pco' })
    }
  }
})

/**
 * Algolia - Search
 */
function algoliaIndexName (id = 0) {
  switch (id) {
    case 1:
      return process.env.ALGOLIA_INDEX_NAME_1
    default:
      return process.env.ALGOLIA_INDEX_NAME
  }
}
function algoliaApiKeyEdit (id = 0) {
  switch (id) {
    case 1:
      return process.env.ALGOLIA_API_KEY_EDIT_1
    default:
      return process.env.ALGOLIA_API_KEY_EDIT
  }
}
function vezApiTokenEdit (id = 0) {
  switch (id) {
    case 1:
      return process.env.VEZY_API_TOKEN_EDIT_1
    default:
      return process.env.VEZY_API_TOKEN_EDIT
  }
}

app.post('/api/database/search', async (req, res) => {
  const indexId = req.body.indexId || 0
  const getCollections = req.body.getCollections || false
  const query = req.body.search
  const textSearch = req.body.textSearch || false
  const collection = req.body.collection || ''
  // Niet (goed) mogelijk om op "" te filteren [controle op met/zonder vertaling weg laten] --> moet extra atribuut of tag in database zetten; nu weg laten
  // https://support.algolia.com/hc/en-us/articles/15072471836561-Can-I-filter-by-an-attribute-value-which-is-null-or-an-empty-string-
  // const isTranslation = req.body.isTranslation || false

  const algoliasearch = require('algoliasearch')
  // Start the API client
  const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY_SEARCH, {
    headers: {
      'X-Algolia-UserToken': process.env.ALGOLIA_USER
    }
  })
  // Create an index (or connect to it, if an index with the name `ALGOLIA_INDEX_NAME` already exists)
  const algoliaIndex = client.initIndex(algoliaIndexName(indexId))
  // Search the index for...
  // https://www.algolia.com/doc/api-reference/api-methods/search/
  try {
    let result = null
    switch (true) {
      case getCollections:
        result = await algoliaIndex.searchForFacetValues('collection')
        break
      case !textSearch && collection !== '':
        result = await algoliaIndex.search(query, {
          hitsPerPage: 100,
          restrictSearchableAttributes: [
            'title',
            'collection',
            'number'
          ],
          filters: `collection:${collection}`
        })
        break
      case !textSearch:
        result = await algoliaIndex.search(query, {
          hitsPerPage: 100,
          restrictSearchableAttributes: [
            'title',
            'collection',
            'number'
          ]
        })
        break
      case collection !== '':
        result = await algoliaIndex.search(query, {
          hitsPerPage: 100,
          filters: `collection:${collection}`
        })
        break
      default: // search in 'title', 'collection', 'number', 'lyrics'
        result = await algoliaIndex.search(query, {
          hitsPerPage: 100
        })
    }

    res.json(result) // data onder 'hits' or 'facetHit'
    /* errors JSON:
    {
      "message":"Invalid Application ID",
      "status":404
    } */
  } catch {
    res.status(500).json({ error: 'algolia_error' })
  }
})

app.post('/api/database/backup', async (req, res) => {
  const indexId = req.body.indexId || 0
  const algoliasearch = require('algoliasearch')
  const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY_SEARCH, {
    headers: {
      'X-Algolia-UserToken': process.env.ALGOLIA_USER
    }
  })
  const algoliaIndex = client.initIndex(algoliaIndexName(indexId))
  // Download all records for the index...
  // https://www.algolia.com/doc/api-reference/api-methods/browse/

  let result = []
  algoliaIndex.browseObjects({
    batch: batch => {
      result = result.concat(batch)
    }
  }).then(() => {
    res.json(result) // all data records
  }).catch(() => res.status(500).json({ error: 'algolia_error' }))
})

app.post('/api/database/edit', async (req, res) => {
  const indexId = req.body.indexId || 0
  const apiKeyEdit = req.body.apiKeyEdit || false
  if (apiKeyEdit !== vezApiTokenEdit(indexId)) return res.status(401).json({ error: 'Geen rechten voor wijzigen data' })

  const records = req.body.records || [] // array of full reccords
  const partUpdate = req.body.partUpdate || false // array of full reccords
  if (records?.length === 0) return res.status(204).json({ error: 'Geen wijzigingsdata ontvangen' })

  const algoliasearch = require('algoliasearch')
  const client = algoliasearch(process.env.ALGOLIA_APP_ID, algoliaApiKeyEdit(indexId), {
    headers: {
      'X-Algolia-UserToken': process.env.ALGOLIA_USER
    }
  })
  const algoliaIndex = client.initIndex(algoliaIndexName(indexId))
  // Add or Edit (if exist) by objectID
  // https://www.algolia.com/doc/api-reference/api-methods/save-objects/
  try {
    let result
    switch (true) {
      case partUpdate && records.length === 1:
        result = await algoliaIndex.partialUpdateObject(records[0], {
          createIfNotExists: true
        })
        break
      case partUpdate:
        result = await algoliaIndex.partialUpdateObjects(records, {
          createIfNotExists: true
        })
        break
      case records.length === 1:
        result = await algoliaIndex.saveObject(records[0], {
          autoGenerateObjectIDIfNotExist: true
        })
        break
      default: // add or full replace
        result = await algoliaIndex.saveObjects(records, {
          autoGenerateObjectIDIfNotExist: true
        })
    }

    res.json(result) // data onder 'objectIDs' --> array of saved objectID
    /* errors JSON:
    {
      "message":"Invalid Application ID",
      "status":404
    } */
  } catch {
    res.status(500).json({ error: 'algolia_error' })
  }
})

app.post('/api/database/delete', async (req, res) => {
  const indexId = req.body.indexId || 0
  const apiKeyEdit = req.body.apiKeyEdit || false
  if (apiKeyEdit !== vezApiTokenEdit(indexId)) return res.status(401).json({ error: 'Geen rechten voor wijzigen data' })

  const objectIDs = req.body.objectIDs // array of objectID
  if (objectIDs?.length === 0) return res.status(204).json({ error: 'Geen wijzigingsdata ontvangen' })

  const algoliasearch = require('algoliasearch')
  const client = algoliasearch(process.env.ALGOLIA_APP_ID, algoliaApiKeyEdit(indexId), {
    headers: {
      'X-Algolia-UserToken': process.env.ALGOLIA_USER
    }
  })
  const algoliaIndex = client.initIndex(algoliaIndexName(indexId))
  // Add or Edit  by objectID
  // https://www.algolia.com/doc/api-reference/api-methods/delete-objects/
  try {
    let result
    switch (true) {
      case objectIDs.length === 1:
        result = await algoliaIndex.deleteObject(objectIDs[0])
        break
      default: // add or full replace
        result = await algoliaIndex.deleteObjects(objectIDs)
    }

    res.json(result) // data onder 'objectIDs' --> array of saved objectID
    /* errors JSON:
    {
      "message":"Invalid Application ID",
      "status":404
    } */
  } catch {
    res.status(500).json({ error: 'algolia_error' })
  }
})

const secrets = [
  'DEEPL_API_KEY',
  'PCOCLIENTSECRET',
  'ALGOLIA_API_KEY_EDIT',
  'VEZY_API_TOKEN_EDIT'
]

exports.api = functions
  .region('europe-west1')
  .runWith({ secrets })
  .https.onRequest(app)
