import { WFRMLS_TOKEN, WFRMLS_BASE, SITE_URL } from './supabase'

export interface Property {
  ListingKey: string
  ListPrice: number
  UnparsedAddress: string
  City: string
  StateOrProvince: string
  PostalCode: string
  BedroomsTotal: number
  BathroomsTotalInteger: number
  LivingArea: number
  PropertyType: string
  StandardStatus: string
  PublicRemarks: string
  ListAgentFullName: string
  ModificationTimestamp: string
  GeoLocation?: { coordinates: [number, number] }
}

export async function searchProperties(params: {
  city?: string
  minPrice?: number
  maxPrice?: number
  beds?: number
  type?: string
  orderBy?: string
  top?: number
  skip?: number
}): Promise<{ properties: Property[]; total: number; hasMore: boolean }> {
  const query = new URLSearchParams({
    city:     params.city     || '',
    minPrice: params.minPrice?.toString() || '',
    maxPrice: params.maxPrice?.toString() || '',
    beds:     params.beds?.toString()     || '',
    type:     params.type     || '',
    orderBy:  params.orderBy  || 'ListPrice desc',
    top:      (params.top  ?? 20).toString(),
    skip:     (params.skip ?? 0).toString(),
  })
  const res  = await fetch(`${SITE_URL}/api/search?${query}`)
  const data = await res.json()
  return {
    properties: data.properties || [],
    total:      data.total      || 0,
    hasMore:    data.hasMore    || false,
  }
}

export async function getPropertyMedia(listingKey: string): Promise<string[]> {
  try {
    const res  = await fetch(`${SITE_URL}/api/property-media?key=${listingKey}`)
    const data = await res.json()
    return data.photos || []
  } catch {
    return []
  }
}

export async function submitLead(lead: {
  name: string
  email: string
  phone: string
  type: 'buyer' | 'seller' | 'commercial' | 'contact'
  message?: string
  city?: string
}): Promise<boolean> {
  try {
    const res = await fetch(`${SITE_URL}/api/leads`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(lead),
    })
    return res.ok
  } catch {
    return false
  }
}
