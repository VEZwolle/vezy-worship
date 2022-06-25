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
 * Load bible verse(s) from selected bible.
 */
app.get('/api/bible', async (req, res) => {
  const { bible, book, chapter, from, to } = req.params

  const verses = await db.collection(bible)
    .where('book', '==', book)
    .where('chapter', '==', chapter)
    .where('verse', '>=', from)
    .where('verse', '<=', to)
    .get()

  const data = verses.docs.map(doc => doc.data())

  res.json(data)
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

exports.api = functions
  .runWith({ secrets: ['DEEPL_API_KEY'] })
  .https.onRequest(app)
