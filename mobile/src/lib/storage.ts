import AsyncStorage from '@react-native-async-storage/async-storage'

const SAVED_KEY = 'gsb_saved_properties'
const LANG_KEY  = 'gsb_lang'

export interface SavedProperty {
  listingKey:   string
  address:      string
  city:         string
  listPrice:    number
  bedrooms:     number
  bathrooms:    number
  photoUrl:     string
  propertyType: string
  savedAt:      string
}

export async function getSavedProperties(): Promise<SavedProperty[]> {
  try {
    const raw = await AsyncStorage.getItem(SAVED_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export async function saveProperty(prop: SavedProperty): Promise<void> {
  const current = await getSavedProperties()
  const exists  = current.find(p => p.listingKey === prop.listingKey)
  if (!exists) {
    await AsyncStorage.setItem(SAVED_KEY, JSON.stringify([prop, ...current]))
  }
}

export async function unsaveProperty(listingKey: string): Promise<void> {
  const current = await getSavedProperties()
  const updated = current.filter(p => p.listingKey !== listingKey)
  await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(updated))
}

export async function isPropertySaved(listingKey: string): Promise<boolean> {
  const current = await getSavedProperties()
  return current.some(p => p.listingKey === listingKey)
}

export async function getLang(): Promise<string> {
  try {
    return (await AsyncStorage.getItem(LANG_KEY)) || 'en'
  } catch { return 'en' }
}

export async function setLang(lang: string): Promise<void> {
  await AsyncStorage.setItem(LANG_KEY, lang)
}
