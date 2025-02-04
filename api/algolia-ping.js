// The Cloud Functions for Firebase SDK to set up triggers and logging.
import { onSchedule } from 'firebase-functions/v2/scheduler'
import { logger } from 'firebase-functions'

import axios from 'axios'

// Test: onSchedule functions in firebase emulator locally
// NOTE: Please ensure you are running the firebase emulator locally, or the shell may call the functions in Production !!
// - Start firebase emulator
// - firebase functions:shell
// - firebase > setInterval(() => yourScheduledFunc(), 60000)
// - Logout: cntr+C cntr+C

// '00 01 10,25 * *' elke 10e en 25e van de maand om 01:00 | minuut uur dag maand jaar
export const algoliaPing = onSchedule({
  schedule: '00 01 10,25 * *',
  region: 'europe-west1'
}, async () => {
  const search = 'Jesus'

  console.log('algoliaPing start')
  try {
    const headers = {
      Authorization: process.env.VEZY_API_TOKEN
    }

    const result = await axios.post(process.env.API_URL + '/database/search', {
      search
    }, { headers })

    if (result.data.hits) {
      return logger.log('Song search Algolia finished, resultaten gevonden')
    }
    return logger.log('Song search Algolia finished, geen resultaten gevonden')
  } catch {
    return logger.log('Error Song search Algolia')
  }
})
