'use client'

const STORAGE_KEY = 'gsb_saved_properties'

export interface SavedProperty {
  listingKey: string
  address: string
  city: string
  price: number
  bedrooms: number
  bathrooms: number
  photoUrl: string
  savedAt: string
}

export function getSavedProperties(): SavedProperty[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch { return [] }
}

export function saveProperty(property: SavedProperty): void {
  const saved = getSavedProperties()
  const exists = saved.find(p => p.listingKey === property.listingKey)
  if (!exists) {
    saved.unshift({ ...property, savedAt: new Date().toISOString() })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved.slice(0, 50)))
  }
}

export function unsaveProperty(listingKey: string): void {
  const saved = getSavedProperties().filter(p => p.listingKey !== listingKey)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
}

export function isPropertySaved(listingKey: string): boolean {
  return getSavedProperties().some(p => p.listingKey === listingKey)
}
