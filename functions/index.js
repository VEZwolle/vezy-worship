const functions = require('firebase-functions')
const admin = require('firebase-admin')
const express = require('express')
const cors = require('cors')

admin.initializeApp()

const app = express()
app.use(cors())

app.post('/translate', async (req, res) => {
  // TODO
})

exports.api = functions.https.onRequest(app)
