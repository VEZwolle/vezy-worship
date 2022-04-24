const functions = require('firebase-functions')
const admin = require('firebase-admin')
const express = require('express')
const cors = require('cors')

admin.initializeApp()
const db = admin.firestore()

const app = express()
app.use(cors())

app.get('/api/services', async (req, res) => {
  const snapshot = await db.collection('services').get()
  const services = snapshot.docs.map(doc => doc.data())

  res.json(services)
})

app.post('/api/services', async (req, res) => {
  const data = req.body

  const { id } = await db.collection('services').add(data)

  res.json({ id })
})

exports.api = functions.https.onRequest(app)
