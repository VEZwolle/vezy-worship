import { Notify } from 'quasar'
import dayjs from 'dayjs'
import { nanoid } from 'nanoid'

export async function getAlgoliaSearch (api, search, textSearch, collection) {
  // return [hits] || false by error
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
      if (result.status && result.message) Notify.create({ type: 'negative', message: `Algolia error: ${result.message}`, position: 'top' })
      return false
    }
  } catch {
    Notify.create({ type: 'negative', message: 'Netwerk error naar cloud database', position: 'top' })
    return false
  } finally {
    // gereed
  }
}

export async function getAlgoliaCollections (api) {
  // return [facehits + ''] || [''] by error
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
    } else { // error
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
  // return true || false by error
  try {
    const result = await api.post('/database/backup', { })
    if (result[0]?.objectID &&
      result[0]?.title &&
      result[0]?.lyrics
    ) { // ga uit dat database klopt
      const saved = await fsdb.saveSongDatabase(true, result)
      if (!saved) {
        Notify.create({ type: 'negative', message: 'Opslaan algolia database bestand mislukt', position: 'top' })
        return false
      }
      return true
    } else { // error
      if (result.status && result.message) Notify.create({ type: 'negative', message: `Algolia error: ${result.message}`, position: 'top' })
      return false
    }
  } catch (error) {
    Notify.create({ type: 'negative', message: 'Netwerk error naar cloud database', position: 'top' })
    return false
  }
}

export function ApiKeyEdit (key = false) {
  // return key or true || false by no key
  if (key) return localStorage.getItem('database.apiKeyEdit')
  return !!localStorage.getItem('database.apiKeyEdit')
}

export async function ConvertToAlgoliaRecord (settings, creator, objectID = null) {
  // return {db.record partical of full by no ID} || false by error or no editKey
  const apiKeyEdit = ApiKeyEdit(true)
  if (!apiKeyEdit) return false

  const now = dayjs().format('YYYY-MM-DD HH:mm:ss')

  if (objectID) {
    return {
      objectID, // = nanoid() // creare uniek objectID
      title: settings.title,
      collection: settings.collection,
      number: settings.number,
      lyrics: settings.text,
      lyricstranslate: settings.translation,
      creator,
      // created_at: now,
      updated_at: now
    }
  }
  return {
    objectID: nanoid(), // creare uniek objectID
    title: settings.title,
    collection: settings.collection,
    number: settings.number,
    lyrics: settings.text,
    lyricstranslate: settings.translation,
    creator,
    created_at: now,
    updated_at: now
  }
}

export async function AddToAlgoliaDatabase (api, records, partUpdate = false) {
  // return {objectIDs} || false by error
  if (records?.length === 0) return false
  const apiKeyEdit = ApiKeyEdit(true)
  if (!apiKeyEdit) return false

  try {
    const result = await api.post('/database/edit', {
      apiKeyEdit,
      records,
      partUpdate
    })
    if (result.objectIDs || result.objectID) {
      Notify.create({ type: 'positive', message: 'Algolia gegevens aangepast: Het duurt vaak even voor dit zichtbaar is.' })
      return result.objectIDs || result.objectID
    } else {
      if (result.status && result.message) Notify.create({ type: 'negative', message: `Algolia error: ${result.message}`, position: 'top' })
      return false
    }
  } catch (error) {
    Notify.create({ type: 'negative', message: 'Netwerk error naar cloud database', position: 'top' })
    return false
  } finally {
    // gereed
  }
}

export async function RemoveFromAlgoliaDatabase (api, objectIDs) {
  // return {objectIDs} || false by error
  if (objectIDs?.length === 0) return false
  const apiKeyEdit = ApiKeyEdit(true)
  if (!apiKeyEdit) return false

  try {
    const result = await api.post('/database/delete', {
      apiKeyEdit,
      objectIDs
    })
    if (result.objectIDs || result.objectID) {
      Notify.create({ type: 'positive', message: 'Algolia gegevens verwijderd: Het duurt vaak even voor dit zichtbaar is.' })
      return result.objectIDs || result.objectID
    } else {
      if (result.status && result.message) Notify.create({ type: 'negative', message: `Algolia error: ${result.status}<br>${result.message}` })
      return false
    }
  } catch {
    Notify.create({ type: 'negative', message: 'Netwerk error naar cloud database', position: 'top' })
    return false
  } finally {
    // gereed
  }
}
