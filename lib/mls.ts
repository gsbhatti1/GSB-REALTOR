/**
 * GSB REALTOR — WFRMLS API CLIENT
 * Connects to Utah Real Estate API (resoapi.utahrealestate.com)
 * RESO Web API certified, OData v4.0
 *
 * IMPORTANT: This file runs SERVER-SIDE ONLY.
 * The bearer token is never exposed to the browser.
 */

const BASE_URL = 'https://resoapi.utahrealestate.com/reso/odata'
const BEARER_TOKEN = process.env.WFRMLS_BEARER_TOKEN

if (!BEARER_TOKEN) {
  console.warn('26a0Fe0f  WFRMLS_BEARER_TOKEN not set')
}

// -----------------------------------------------
// TYPES
// -----------------------------------------------

export interface MLSProperty {
  ListingKey: string
  ListingId: string
  MlsStatus: string
  StandardStatus: string
  PropertyType: string
  PropertySubType: string

  // Address
  UnparsedAddress: string
  StreetNumber: string
  StreetName: string
  City: string
  StateOrProvince: string
  PostalCode: string
  CountyOrParish: string

  // Financials
  ListPrice: number
  OriginalListPrice: number
  ClosePrice?: number

  // Property details
  BedroomsTotal: number
  BathroomsTotalInteger: number
  LivingArea: number
  LotSizeAcres?: number
  LotSizeSquareFeet?: number
  YearBuilt?: number
  GarageSpaces?: number

  // Location
  Latitude: number
  Longitude: number

  // Media
  Media?: MLSMedia[]
  PhotosCount?: number

  // Dates
  ListingContractDate: string
  OnMarketDate?: string
  ModificationTimestamp: string

  // Agent/Office
  ListAgentFullName?: string
  ListOfficeName?: string

  // Description
  PublicRemarks?: string

  // HOA
  AssociationFee?: number
  AssociationFeeFrequency?: string
}

export interface MLSMedia {
  MediaKey: string
  MediaURL: string
  Order: number
  MediaType: string
}

export interface SearchFilters {
  city?: string
  countyOrParish?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  propertyType?: string
  status?: string
  minSqFt?: number
  maxSqFt?: number
  minAcres?: number
  daysBack?: number
  lat?: number
  lng?: number
  radiusMiles?: number
  top?: number
  skip?: number
  orderBy?: string
}

export interface SearchResult {
  properties: MLSProperty[]
  total: number
  hasMore: boolean
}

// -----------------------------------------------
// CORE FETCH
// -----------------------------------------------

async function fetchMLS(endpoint: string, params?: Record<string, string>): Promise<any> {
  const url = new URL(`${BASE_URL}/${endpoint}`)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: BEARER_TOKEN || '',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    // Cache for 5 minutes — listings don't change that fast
    next: { revalidate: 300 },
  })

  if (!response.ok) {
    const error = await response.text()
    console.error(`WFRMLS API Error [${response.status}]:`, error)
    throw new Error(`MLS API request failed: ${response.status}`)
  }

  return response.json()
}

// -----------------------------------------------
// SELECT FIELDS — Only pull what we need
// Reduces payload size and speeds up responses
// -----------------------------------------------

const PROPERTY_SELECT_FIELDS = [
  'ListingKey', 'ListingId', 'MlsStatus', 'StandardStatus',
  'PropertyType', 'PropertySubType',
  'UnparsedAddress', 'StreetNumber', 'StreetName',
  'City', 'StateOrProvince', 'PostalCode', 'CountyOrParish',
  'ListPrice', 'OriginalListPrice',
  'BedroomsTotal', 'BathroomsTotalInteger', 'LivingArea',
  'LotSizeAcres', 'LotSizeSquareFeet', 'YearBuilt', 'GarageSpaces',
  'Latitude', 'Longitude',
  'PhotosCount', 'ListingContractDate', 'OnMarketDate', 'ModificationTimestamp',
  'ListAgentFullName', 'ListOfficeName',
  'PublicRemarks', 'AssociationFee', 'AssociationFeeFrequency'
].join(',')

// -----------------------------------------------
// BUILD ODATA FILTER
// -----------------------------------------------

function buildFilter(filters: SearchFilters): string {
  const conditions: string[] = []

  // Status — default to Active
  const status = filters.status || 'Active'
  conditions.push(`StandardStatus eq '${status}'`)

  // Price range
  if (filters.minPrice) conditions.push(`ListPrice ge ${filters.minPrice}`)
  if (filters.maxPrice) conditions.push(`ListPrice le ${filters.maxPrice}`)

  // Location
  if (filters.city) conditions.push(`City eq '${filters.city}'`)
  if (filters.countyOrParish) conditions.push(`CountyOrParish eq '${filters.countyOrParish}'`)

  // Beds/baths
  if (filters.bedrooms) conditions.push(`BedroomsTotal ge ${filters.bedrooms}`)
  if (filters.bathrooms) conditions.push(`BathroomsTotalInteger ge ${filters.bathrooms}`)

  // Property type
  if (filters.propertyType && filters.propertyType !== 'All') {
    conditions.push(`PropertyType eq '${filters.propertyType}'`)
  }

  // Square feet
  if (filters.minSqFt) conditions.push(`LivingArea ge ${filters.minSqFt}`)
  if (filters.maxSqFt) conditions.push(`LivingArea le ${filters.maxSqFt}`)

  // Acres
  if (filters.minAcres) conditions.push(`LotSizeAcres ge ${filters.minAcres}`)

  // Days back (new listings)
  if (filters.daysBack) {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - filters.daysBack)
    const dateStr = cutoffDate.toISOString().split('T')[0]
    conditions.push(`OnMarketDate ge ${dateStr}`)
  }

  return conditions.join(' and ')
}

// -----------------------------------------------
// SEARCH PROPERTIES
// -----------------------------------------------

export async function searchProperties(filters: SearchFilters = {}): Promise<SearchResult> {
  const top = filters.top || 24
  const skip = filters.skip || 0

  // Geolocation search uses a special endpoint
  if (filters.lat && filters.lng && filters.radiusMiles) {
    return searchByLocation(filters)
  }

  const filterStr = buildFilter(filters)
  const orderBy = filters.orderBy || 'OnMarketDate desc'

  const params: Record<string, string> = {
    '$filter': filterStr,
    '$select': PROPERTY_SELECT_FIELDS,
    '$orderby': orderBy,
    '$top': String(top),
    '$skip': String(skip),
    '$count': 'true',
    '$expand': 'Media($select=MediaKey,MediaURL,Order;$top=1;$orderby=Order asc)',
  }

  const data = await fetchMLS('Property', params)

  return {
    properties: data.value || [],
    total: data['@odata.count'] || 0,
    hasMore: (skip + top) < (data['@odata.count'] || 0),
  }
}

// -----------------------------------------------
// SEARCH BY LOCATION (radius)
// -----------------------------------------------

async function searchByLocation(filters: SearchFilters): Promise<SearchResult> {
  const top = filters.top || 24
  const skip = filters.skip || 0

  // WFRMLS geolocation filter uses geo.distance
  const radiusKm = (filters.radiusMiles || 10) * 1.60934
  const geoFilter = `geo.distance(Location, geography'POINT(${filters.lng} ${filters.lat})') le ${radiusKm}`

  const statusFilter = `StandardStatus eq '${filters.status || 'Active'}'`
  const priceFilter = [
    filters.minPrice ? `ListPrice ge ${filters.minPrice}` : '',
    filters.maxPrice ? `ListPrice le ${filters.maxPrice}` : '',
  ].filter(Boolean).join(' and ')

  const fullFilter = [geoFilter, statusFilter, priceFilter].filter(Boolean).join(' and ')

  const params: Record<string, string> = {
    '$filter': fullFilter,
    '$select': PROPERTY_SELECT_FIELDS,
    '$orderby': 'ListPrice asc',
    '$top': String(top),
    '$skip': String(skip),
    '$count': 'true',
    '$expand': 'Media($select=MediaKey,MediaURL,Order;$top=1;$orderby=Order asc)',
  }

  const data = await fetchMLS('Property', params)

  return {
    properties: data.value || [],
    total: data['@odata.count'] || 0,
    hasMore: (skip + top) < (data['@odata.count'] || 0),
  }
}

// -----------------------------------------------
// GET SINGLE LISTING
// -----------------------------------------------

export async function getProperty(listingKey: string): Promise<MLSProperty | null> {
  try {
    const data = await fetchMLS(`Property('${listingKey}')`, {
      '$expand': 'Media($orderby=Order asc)',
    })
    return data || null
  } catch {
    return null
  }
}

// -----------------------------------------------
// GET FEATURED LISTINGS
// Returns the 6 newest active residential listings
// -----------------------------------------------

export async function getFeaturedListings(): Promise<MLSProperty[]> {
  const result = await searchProperties({
    status: 'Active',
    top: 6,
    orderBy: 'OnMarketDate desc',
  })
  return result.properties
}

// -----------------------------------------------
// GET NEW LISTINGS (last 3 days)
// -----------------------------------------------

export async function getNewListings(limit = 12): Promise<MLSProperty[]> {
  const result = await searchProperties({
    status: 'Active',
    daysBack: 3,
    top: limit,
    orderBy: 'OnMarketDate desc',
  })
  return result.properties
}

// -----------------------------------------------
// GET LISTINGS BY CITY
// -----------------------------------------------

export async function getListingsByCity(city: string, limit = 24): Promise<SearchResult> {
  return searchProperties({
    city,
    status: 'Active',
    top: limit,
    orderBy: 'OnMarketDate desc',
  })
}

// -----------------------------------------------
// MARKET STATS FOR A CITY
// Returns avg price, count, median etc.
// -----------------------------------------------

export async function getMarketStats(city: string): Promise<{
  activeCount: number
  avgPrice: number
  medianPrice: number
  avgDaysOnMarket: number
}> {
  // Pull up to 200 active listings for stats
  const result = await searchProperties({
    city,
    status: 'Active',
    top: 200,
  })

  const prices = result.properties.map(p => p.ListPrice).filter(Boolean).sort((a, b) => a - b)
  const avgPrice = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0
  const medianPrice = prices.length ? prices[Math.floor(prices.length / 2)] : 0

  return {
    activeCount: result.total,
    avgPrice,
    medianPrice,
    avgDaysOnMarket: 0, // Will add DOM field later
  }
}

// -----------------------------------------------
// FORMAT HELPERS
// -----------------------------------------------

export function formatPrice(price: number): string {
  if (!price) return 'Price N/A'
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(2)}M`
  }
  return `$${price.toLocaleString('en-US')}`
}

export function formatSqFt(sqft: number): string {
  if (!sqft) return 'N/A'
  return `${sqft.toLocaleString('en-US')} sq ft`
}

export function getPropertyThumbnail(property: MLSProperty): string {
  if (property.Media && property.Media.length > 0) {
    return property.Media[0].MediaURL
  }
  return '/images/no-photo.jpg'
}

export function getPropertyAddress(property: MLSProperty): string {
  return property.UnparsedAddress ||
    `${property.StreetNumber} ${property.StreetName}, ${property.City}, ${property.StateOrProvince} ${property.PostalCode}`
}
