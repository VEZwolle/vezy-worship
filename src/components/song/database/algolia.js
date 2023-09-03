import { Notify } from 'quasar'

export async function getAlgoliaSearch (api, search, textSearch, collection) {
  if (!search) return []
  try {
    const result = await api.post('/database/search', {
      search,
      textSearch,
      collection
    })
    if (result.hits) {
      return result.hits
    } else {
      console.log(result)
      if (result.status && result.message) Notify.create({ type: 'negative', message: `Algolia error: ${result.status}<br>${result.message}` })
      return []
    }
  } catch {
    // error
    return []
  } finally {
    // gereed
  }
}

export async function getAlgoliaCollections (api) {
  try {
    const result = await api.post('/database/search', {
      getCollections: true
    })
    if (result.facetHits) {
      const collections = []
      result.facetHits.forEach(facetHit => {
        collections.push(facetHit.value)
      })
      collections.push('')
      return collections
    } else {
      console.log(result)
      if (result.status && result.message) Notify.create({ type: 'negative', message: `Algolia error: ${result.status}<br>${result.message}` })
      return ['']
    }
  } catch {
    // error
    return ['']
  } finally {
    // gereed
  }
}

export async function getAlgoliaDatabase (api, fsdb) {
  const result = await api.post('/database/backup', { })
  if (result[0]?.id &&
    result[0]?.title &&
    result[0]?.lyrics
  ) { // ga uit dat database klopt
    const saved = await fsdb.saveSongDatabase(true, result)
    if (!saved) {
      console.log('error save database')
      Notify.create({ type: 'negative', message: 'Opslaan Algolia Database bestand mislukt', position: 'top' })
      return false
    }
    return true
  } else {
    console.log(result)
    if (result.status && result.message) Notify.create({ type: 'negative', message: `Algolia error: ${result.status}<br>${result.message}` })
    return false
  }
}
