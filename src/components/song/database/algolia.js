import { Notify } from 'quasar'
import dayjs from 'dayjs'
import { nanoid } from 'nanoid'
import { api } from '../../../boot/api'
import { fsdb } from '../../../boot/filesystemdb'

export const algoliaIndexNames = [
  { value: 0, label: 'VEZ projectie', apiKeyEdit: 'database.apiKeyEdit' },
  { value: 1, label: 'HvGeA', apiKeyEdit: 'database.apiKeyEdit1' }
]

export async function getAlgoliaSearch (indexId = 0, search, textSearch, collection) {
  // return [hits] || false by error
  if (!search) return []
  try {
    const result = await api.post('/database/search', {
      indexId,
      search,
      textSearch,
      collection
    })
    if (result.hits) {
      return result.hits
    } else {
      if (result.status && result.message) Notify.create({ type: 'negative', message: `Algolia error: ${result.message}` })
      return false
    }
  } catch {
    Notify.create({ type: 'negative', message: 'Netwerk error naar cloud database' })
    return false
  } finally {
    // gereed
  }
}

export async function getAlgoliaCollections (indexId = 0) {
  // return [facehits + ''] || [''] by error
  try {
    const result = await api.post('/database/search', {
      indexId,
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

export async function GetAlgoliaDatabase (indexId = 0) {
  // return true || false by error
  try {
    const result = await api.post('/database/backup', { indexId })
    if (result[0]?.objectID &&
      result[0]?.title &&
      result[0]?.lyrics
    ) { // ga uit dat database klopt
      const saved = await fsdb.saveSongDatabase(true, result)
      if (!saved) {
        Notify.create({ type: 'negative', message: 'Opslaan algolia database bestand mislukt' })
        return false
      }
      return true
    } else { // error
      if (result.status && result.message) Notify.create({ type: 'negative', message: `Algolia error: ${result.message}` })
      return false
    }
  } catch (error) {
    Notify.create({ type: 'negative', message: 'Netwerk error naar cloud database' })
    return false
  }
}

export function ApiKeyEdit (indexId = 0, key = false) {
  // return key or true || false by no key
  const localStorageItem = algoliaIndexNames.find(t => t.value === indexId)?.apiKeyEdit || 'database.apiKeyEdit'
  if (key) return localStorage.getItem(localStorageItem)
  return !!localStorage.getItem(localStorageItem)
}

export async function ConvertToAlgoliaRecord (indexId = 0, settings, creator, objectID = null) {
  // return {db.record partical of full by no ID} || false by error or no editKey
  const apiKeyEdit = ApiKeyEdit(indexId, true)
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

export async function AddToAlgoliaDatabase (indexId = 0, records, partUpdate = false) {
  // return {objectIDs} || false by error
  if (records?.length === 0) return false
  const apiKeyEdit = ApiKeyEdit(indexId, true)
  if (!apiKeyEdit) return false

  try {
    const result = await api.post('/database/edit', {
      indexId,
      apiKeyEdit,
      records,
      partUpdate
    })
    if (result.objectIDs || result.objectID) {
      Notify.create({ type: 'positive', message: 'Algolia gegevens aangepast: Het duurt vaak even voor dit zichtbaar is.' })
      return result.objectIDs || result.objectID
    } else {
      if (result.status && result.message) Notify.create({ type: 'negative', message: `Algolia error: ${result.message}` })
      return false
    }
  } catch (error) {
    Notify.create({ type: 'negative', message: 'Netwerk error naar cloud database' })
    return false
  } finally {
    // gereed
  }
}

export async function RemoveFromAlgoliaDatabase (indexId = 0, objectIDs) {
  // return {objectIDs or taskID if no objectID} || false by error
  if (objectIDs?.length === 0) return false
  const apiKeyEdit = ApiKeyEdit(indexId, true)
  if (!apiKeyEdit) return false

  try {
    const result = await api.post('/database/delete', {
      indexId,
      apiKeyEdit,
      objectIDs
    })
    if (result.objectIDs || result.objectID || result.taskID) {
      Notify.create({ type: 'positive', message: 'Algolia gegevens verwijderd: Het duurt vaak even voor dit zichtbaar is.' })
      return result.objectIDs || result.objectID || result.taskID
    } else {
      if (result.status && result.message) Notify.create({ type: 'negative', message: `Algolia error: ${result.status}<br>${result.message}` })
      return false
    }
  } catch {
    Notify.create({ type: 'negative', message: 'Netwerk error naar cloud database' })
    return false
  } finally {
    // gereed
  }
}
