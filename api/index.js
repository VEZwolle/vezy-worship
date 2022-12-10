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

exports.api = functions
  .runWith({ secrets: ['DEEPL_API_KEY'] })
  .https.onRequest(app)
