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

// Generate or get a persistent anonymous session ID
function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem('gsb_session_id')
  if (!id) {
    id = 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
    localStorage.setItem('gsb_session_id', id)
  }
  return id
}

export function getSavedProperties(): SavedProperty[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch { return [] }
}

// Save to localStorage immediately, then sync to Supabase in background
export async function saveProperty(property: SavedProperty): Promise<void> {
  // Local storage for immediate UI response
  const saved = getSavedProperties()
  const exists = saved.find(p => p.listingKey === property.listingKey)
  if (!exists) {
    saved.unshift({ ...property, savedAt: new Date().toISOString() })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved.slice(0, 50)))
  }

  // Sync to Supabase (fail silently — localStorage is the fallback)
  try {
    await fetch('/api/saved-properties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': getSessionId(),
      },
      body: JSON.stringify({
        listingKey: property.listingKey,
        address: property.address,
        city: property.city,
        listPrice: property.price,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        photoUrl: property.photoUrl,
      }),
    })
  } catch {
    // fail silently
  }
}

// Remove from localStorage, then sync removal to Supabase in background
export async function unsaveProperty(listingKey: string): Promise<void> {
  // Remove from localStorage
  const saved = getSavedProperties().filter(p => p.listingKey !== listingKey)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))

  // Remove from Supabase
  try {
    await fetch('/api/saved-properties', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': getSessionId(),
      },
      body: JSON.stringify({ listingKey }),
    })
  } catch {
    // fail silently
  }
}

export function isPropertySaved(listingKey: string): boolean {
  return getSavedProperties().some(p => p.listingKey === listingKey)
}
