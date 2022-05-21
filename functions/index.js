const functions = require('firebase-functions')
const admin = require('firebase-admin')
const express = require('express')
const cors = require('cors')
const axios = require('axios')

// Initialization
admin.initializeApp()

const app = express()
app.use(cors())

// API endpoints
app.post('/api/translate', (req, res) => {
  const data = new URLSearchParams({
    text: req.body.text,
    target_lang: 'NL'
  })

  axios.post(`https://api-free.deepl.com/v2/translate?auth_key=${process.env.DEEPL_API_KEY}`, data)
    .then((result) => {
      const translation = result.data.translations[0].text
      res.json({ translation })
    })
    .catch((err) => {
      res.status(500).json({ error: err })
    })
})

exports.api = functions
  .runWith({ secrets: ['DEEPL_API_KEY'] })
  .https.onRequest(app)
