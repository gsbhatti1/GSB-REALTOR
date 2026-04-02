import { SITE_URL } from './supabase'

export interface Property {
  ListingKey:             string
  ListPrice:              number
  UnparsedAddress:        string
  City:                   string
  StateOrProvince:        string
  PostalCode:             string
  BedroomsTotal:          number
  BathroomsTotalInteger:  number
  LivingArea:             number
  LotSizeAcres:           number
  YearBuilt:              number
  PropertyType:           string
  PropertySubType:        string
  StandardStatus:         string
  PublicRemarks:          string
  ListAgentFullName:      string
  ListOfficeName:         string
  ModificationTimestamp:  string
  OnMarketDate:           string
  DaysOnMarket:           number
  Media?:                 { MediaURL: string }[]
}

export interface SearchResult {
  properties: Property[]
  total:      number
  hasMore:    boolean
}

export async function searchProperties(params: {
  city?:        string
  minPrice?:    number
  maxPrice?:    number
  beds?:        number
  baths?:       number
  type?:        string
  orderBy?:     string
  top?:         number
  skip?:        number
}): Promise<SearchResult> {
  const q = new URLSearchParams()
  if (params.city)     q.set('city',     params.city)
  if (params.minPrice) q.set('minPrice', String(params.minPrice))
  if (params.maxPrice) q.set('maxPrice', String(params.maxPrice))
  if (params.beds)     q.set('beds',     String(params.beds))
  if (params.baths)    q.set('baths',    String(params.baths))
  if (params.type)     q.set('type',     params.type)
  q.set('orderBy', params.orderBy  || 'ListPrice desc')
  q.set('top',     String(params.top  ?? 20))
  q.set('skip',    String(params.skip ?? 0))

  const res  = await fetch(`${SITE_URL}/api/search?${q}`)
  if (!res.ok) return { properties: [], total: 0, hasMore: false }
  const data = await res.json()
  return {
    properties: data.properties || [],
    total:      data.total      || 0,
    hasMore:    data.hasMore    || false,
  }
}

export async function getPropertyPhotos(listingKey: string): Promise<string[]> {
  try {
    const res  = await fetch(`${SITE_URL}/api/property-media?key=${listingKey}`)
    if (!res.ok) return []
    const data = await res.json()
    return (data.photos || []) as string[]
  } catch { return [] }
}

export async function submitLead(lead: {
  name:     string
  email?:   string
  phone:    string
  type:     string
  message?: string
  city?:    string
  source?:  string
}): Promise<boolean> {
  try {
    const res = await fetch(`${SITE_URL}/api/leads`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        first_name:       lead.name.split(' ')[0] || lead.name,
        last_name:        lead.name.split(' ').slice(1).join(' ') || '',
        phone:            lead.phone,
        email:            lead.email || '',
        lead_type:        lead.type,
        message:          lead.message || '',
        source:           lead.source || 'mobile_app',
        property_address: lead.city ? `${lead.city}, UT` : '',
      }),
    })
    return res.ok
  } catch { return false }
}

export async function submitListingAlert(alert: {
  name:      string
  email:     string
  phone?:    string
  cities:    string[]
  minPrice?: number
  maxPrice?: number
  minBeds?:  number
}): Promise<boolean> {
  try {
    const res = await fetch(`${SITE_URL}/api/listing-alerts`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(alert),
    })
    return res.ok
  } catch { return false }
}

export function formatPrice(n: number): string {
  if (!n) return '—'
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000)     return `$${Math.round(n / 1_000)}K`
  return `$${n.toLocaleString()}`
}

export function getFirstPhoto(property: Property): string | null {
  return property.Media?.[0]?.MediaURL || null
}
