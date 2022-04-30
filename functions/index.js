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
  const services = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))

  res.json(services)
})

app.get('/api/services/:id', async (req, res) => {
  const id = req.params.id

  const doc = await db.collection('services').doc(id).get()

  if (!doc.exists) {
    res.sendStatus(404)
  }

  res.json({
    id: doc.id,
    ...doc.data()
  })
})

app.post('/api/services', async (req, res) => {
  const data = req.body

  const { id } = await db.collection('services').add(data)

  res.json({ id })
})

app.patch('/api/services/:id', async (req, res) => {
  const id = req.params.id
  const data = req.body

  const doc = db.collection('services').doc(id)

  const result = await doc.update(data)

  res.json(result)
})

exports.api = functions.https.onRequest(app)
