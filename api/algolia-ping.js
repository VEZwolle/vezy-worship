// The Cloud Functions for Firebase SDK to set up triggers and logging.
import { onSchedule } from 'firebase-functions/v2/scheduler'
import { logger } from 'firebase-functions'

import admin from 'firebase-admin'
import axios from 'axios'

// Initialization
admin.initializeApp()

// '00 01 10,25 * *' elke 10e en 25e van de maand om 01:00
export const algoliaPing = onSchedule('00 01 10,25 * *', async () => {
  const search = 'Jesus'

  try {
    const headers = {
      Authorization: process.env.VEZY_API_TOKEN
    }

    const result = await axios.post(process.env.API_URL + '/database/search', {
      search
    }, { headers })

    if (result.hits) {
      return logger.log('Song search Algolia finished, resultaten gevonden')
    }
    
    return logger.log('Song search Algolia finished, geen resultaten gevonden')
  } catch {
    return logger.log('Error Song search Algolia')
  }
})
