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
 * Translate text into Dutch.
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
 * PCO.
 */
const oAuthConfig = {
  URLBase: 'https://api.planningcenteronline.com',
  oAuthCode: "",
  clientID: 'Hier de link naar client ID invullen',
  clientSecret: 'Hier de link naar client Secret invullen',
  redirectURI: 'http://localhost:5000/api/pco/auth/complete',
  refreshToken: '',
  tokenExpiry: 0,
  token: ''
};
/** PCO, Oauth
 * Goto: `${oAuthConfig.URLBase}/oauth/authorize?client_id=${oAuthConfig.clientID}&redirect_uri=${oAuthConfig.redirectURI}&response_type=code&scope=people services`
 * werkt niet vanaf hier...  ivm redirect niet mag.... en window.open werkt ook niet --> via vezy kant nu gedaan.
 */
// PCO, redirectURI
app.get('/api/pco/auth/complete', async (req, res) => {
  oAuthConfig.oAuthCode = req.query.code
	const params = new URLSearchParams()
  params.append('grant_type', 'authorization_code')
  params.append('code', oAuthConfig.oAuthCode)
  params.append('client_id', oAuthConfig.clientID)
  params.append('client_secret', oAuthConfig.clientSecret)
  params.append('redirect_uri', oAuthConfig.redirectURI)

  try {
    const response = await axios.post(`${oAuthConfig.URLBase}/oauth/token`, params)
    console.log(response.data)
    oAuthConfig.token = `Bearer ${response.data.access_token}`
    // Token lifetime is given in seconds, so multiply by 1000, also subtract 60 seconds from lifetime on our end so we know to refresh the token early
    oAuthConfig.tokenExpiry = (response.data.created_at * 1000) + ((response.data.expires_in - 60) * 1000)
    oAuthConfig.refreshToken = response.data.refresh_token
    // const scopes = response.data.scope.split(' ') // onderdelen van PCO waar je toegang toe hebt gekregen met Vezy.
    if (oAuthConfig.refreshToken) return res.send('VezyWorship is ingelogd op PCO; u kunt dit venster sluiten & verdergaan met ophalen gegevens uit PCO')
    res.send('Could not log in to Planning Center API using oAuth')
  } catch {
    res.status(500).json({ error: 'Could not log in to Planning Center API using oAuth' })
  }
})

async function oauthRefresh(refreshToken = null) {
  const params = {
    grant_type: 'refresh_token',
    client_id: oAuthConfig.clientID,
    client_secret: oAuthConfig.clientSecret,
    refresh_token: refreshToken || oAuthConfig.refreshToken,
  }

  try {
    const response = await axios({ method: 'POST', url: `${oAuthConfig.URLBase}/oauth/token`, headers: { 'content-type': 'application/json' }, data: params })
    console.log(response.data)
    oAuthConfig.token = `Bearer ${response.data.access_token}`
    oAuthConfig.tokenExpiry = (response.data.created_at * 1000) + ((response.data.expires_in - 60) * 1000)
    oAuthConfig.refreshToken = response.data.refresh_token
  } catch {
    // 'Could not refresh oAuth Token with Planning Center API')
    oAuthConfig.token = ''
    oAuthConfig.tokenExpiry = 0
    oAuthConfig.refreshToken = ''
  }
}

// no logout in api PCO? --> clean token's
app.get('/api/pco/auth/logout', async (req, res) => {
  oAuthConfig.token = ''
  oAuthConfig.tokenExpiry = 0
  oAuthConfig.refreshToken = ''

  res.json({ logout : true })
})

app.post('/api/pco', async (req, res) => {
  console.log(req.body.serviceType)  
  console.log(req.body.plan)
  console.log(req.body.itemCount)
  console.log(req.body.item)

  // check if loginauth
  if (!oAuthConfig.refreshToken) { // first login
    return res.json({ URL : `${oAuthConfig.URLBase}/oauth/authorize?client_id=${oAuthConfig.clientID}&redirect_uri=${oAuthConfig.redirectURI}&response_type=code&scope=people services` }) // Inlog link
  }
  if (Date.now() > oAuthConfig.tokenExpiry) { // tokenHasExpired --> Refresh token
    await oauthRefresh(oAuthConfig.refreshToken)
    if (!oAuthConfig.refreshToken) { // refresh error --> first login
      return res.json({ URL : `${oAuthConfig.URLBase}/oauth/authorize?client_id=${oAuthConfig.clientID}&redirect_uri=${oAuthConfig.redirectURI}&response_type=code&scope=people services` }) // Inlog link
    }
  }
  // set get data url
  let URLAdd = 'services/v2/service_types'
  if (req.body.item === 'team') { // get team_members       : ../services/v2/service_types/ID/plans/DIENST/team_members?per_page=50
    URLAdd += `/${req.body.serviceType}/plans/${req.body.plan}/team_members?per_page=50`
  } else if (req.body.item) { // get item notes             : ../services/v2/service_types/ID/plans/DIENST/items/ITEM?include=item_notes
    URLAdd += `/${req.body.serviceType}/plans/${req.body.plan}/items/${req.body.item}?include=item_notes`
  } else if (req.body.plan) { // get items plan             : ../services/v2/service_types/ID/plans/DIENST/items?per_page=COUNT
    if (req.body.itemCount) {
      URLAdd += `/${req.body.serviceType}/plans/${req.body.plan}/items?per_page=${req.body.itemCount}`
    } else {
      URLAdd += `/${req.body.serviceType}/plans/${req.body.plan}/items` // default 25st/page
    }
  } else if (req.body.serviceType) { // get plans in future   : ../services/v2/service_types/ID/plans?order=sort_date&filter=future
    URLAdd += `/${req.body.serviceType}/plans?order=sort_date&filter=future`
  } // get service_types                                      : ../services/v2/service_types

  // get data
  try {
    const response = await axios.get(`${oAuthConfig.URLBase}/${URLAdd}`, {
      headers: {
        'Authorization': oAuthConfig.token
      }
    });
    console.log(response.data)
    const data = response.data
    res.json({ data })
  } catch {
    res.status(500).json({ error: 'pco_error .../api/pco' })
  }
})


exports.api = functions
  .runWith({ secrets: ['DEEPL_API_KEY'] })
  .https.onRequest(app)
