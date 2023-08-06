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
 * Get language from array lines.
 */
 app.post('/api/language', async (req, res) => {
  const textLines = req.body.textLines
  const resultLanguage = []
  for (let k=0; k<textLines.length; k += 50) { // max 50/sessie
    const data = new URLSearchParams({
      target_lang: 'NL'
    })  
    for (let i=k; i < Math.min(textLines.length, k+50); i++) {
      data.append('text', textLines[i])  
    }
    try {
      const result = await axios.post(`https://api-free.deepl.com/v2/translate?auth_key=${process.env.DEEPL_API_KEY}`, data)
      const translations = result.data.translations
      for (let translation of translations) {
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
  urlBase: 'https://api.planningcenteronline.com',
  redirectUri: `${process.env.API_URL}/pco/auth/complete`
};
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
  };

  try {
    const response = await axios.post(`${oAuthConfig.urlBase}/oauth/token`, params)
    pcoTokens.token = response.data.access_token
    // Token lifetime is given in seconds, so multiply by 1000, also subtract 60 seconds from lifetime on our end so we know to refresh the token early
    pcoTokens.tokenExpiry = (response.data.created_at * 1000) + ((response.data.expires_in - 60) * 1000)
    pcoTokens.refreshToken = response.data.refresh_token
    if (pcoTokens.refreshToken) return res.send(`
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
    res.json({ status: status})
  } catch {
    res.status(500).json({ error: 'Could not logout to Planning Center API' })
  }
})

async function oauthRefresh(refreshToken = null) {
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
  };

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
  };

  // check if loginauth
  if (!pcoTokens.refreshToken) { // first login
    return res.json({ url : `${oAuthConfig.urlBase}/oauth/authorize?client_id=${process.env.PCOCLIENTID}&redirect_uri=${oAuthConfig.redirectUri}&response_type=code&scope=services` }) // Inlog link
  }
  if (Date.now() > pcoTokens.tokenExpiry) { // tokenHasExpired --> Refresh token
    const responsePcoTokens = await oauthRefresh(pcoTokens.refreshToken)
    pcoTokens.refreshToken = responsePcoTokens.refreshToken
    pcoTokens.tokenExpiry = responsePcoTokens.tokenExpiry
    pcoTokens.token = responsePcoTokens.token
    if (!pcoTokens.refreshToken) { // refresh error --> first login
      return res.json({ url : `${oAuthConfig.urlBase}/oauth/authorize?client_id=${process.env.PCOCLIENTID}&redirect_uri=${oAuthConfig.redirectUri}&response_type=code&scope=services` }) // Inlog link
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
        'Authorization': `Bearer ${pcoTokens.token}`
      }
    });
    const data = response.data
    res.json({ data: data, pcoTokens: { refreshToken: pcoTokens.refreshToken, tokenExpiry: pcoTokens.tokenExpiry, token: pcoTokens.token } })
  } catch (error) {
    if (error.response) { //       The request was made and the server responded with a status code that falls out of the range of 2xx
      const status = error.response.data.errors[0].status
      res.json({ errorStatus : `${status}`, pcoTokens: { refreshToken: pcoTokens.refreshToken, tokenExpiry: pcoTokens.tokenExpiry, token: pcoTokens.token } })
    } else if (error.request) { // The request was made but no response was received
      res.status(500).json({ error: 'pco_error geen response .../api/pco' })
    } else { //                    Something happened in setting up the request that triggered an Error
      res.status(500).json({ error: 'pco_error .../api/pco' })
    }
  }
})

const secrets = [
  'PCOCLIENTID',
  'PCOCLIENTSECRET',
  'DEEPL_API_KEY',
  'API_URL'
]

exports.api = functions
  .region('europe-west1')
  .runWith({ secrets })
  .https.onRequest(app)
