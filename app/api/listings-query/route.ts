/**
 * GSB REALTOR — WFRMLS MCP-Style Natural Language Query API (Phase 4)
 *
 * POST /api/listings-query
 * Body: { query: string, limit?: number }
 *
 * This is the foundation of the WFRMLS MCP Server concept from the Udemy course.
 * It accepts natural language queries about Utah real estate and returns
 * structured listing data + a natural language summary.
 *
 * Example:
 *   POST { "query": "3 bedroom homes in Draper under $600,000", "limit": 5 }
 *   → { listings: [...], summary: "Found 8 active 3-bed homes in Draper under $600K. Avg price: $543,000." }
 */

import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const GROQ_API_KEY  = process.env.GROQ_API_KEY
const WFRMLS_TOKEN  = process.env.WFRMLS_BEARER_TOKEN || '45d62db98f00d4ba2d3b80507f9c5811'
const WFRMLS_BASE   = 'https://resoapi.utahrealestate.com/reso/odata'

// ── Types ────────────────────────────────────────────────────────────────────

interface ParsedFilters {
  city?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  propertyType?: string
  minSqFt?: number
  maxSqFt?: number
  status?: string
}

interface ListingResult {
  listingKey: string
  address: string
  city: string
  price: number
  beds: number
  baths: number
  sqft?: number
  yearBuilt?: number
  lotAcres?: number
  status: string
  listDate?: string
  url: string
}

// ── Step 1: Parse natural language query with Groq ───────────────────────────

async function parseQueryWithGroq(query: string): Promise<ParsedFilters> {
  if (!GROQ_API_KEY) {
    return parseQueryLocally(query)
  }

  const systemPrompt = `You are a real estate search filter parser. Convert natural language queries about Utah real estate into structured JSON filters.

Return ONLY a valid JSON object with these optional fields:
{
  "city": "string (Utah city name, properly capitalized)",
  "minPrice": number,
  "maxPrice": number,
  "bedrooms": number (minimum bedrooms),
  "bathrooms": number (minimum bathrooms),
  "propertyType": "Residential" | "Commercial" | "Land" | "Multi-Family",
  "minSqFt": number,
  "maxSqFt": number,
  "status": "Active" (default) | "Pending" | "Closed"
}

Rules:
- Only include fields mentioned in the query
- Convert "3 bed" to bedrooms: 3
- Convert "under $600k" to maxPrice: 600000
- Convert "over $400k" to minPrice: 400000  
- Convert "$400k-$600k" to minPrice: 400000, maxPrice: 600000
- Always default status to "Active" unless query says "sold", "pending", etc.
- Do NOT include explanation, only JSON`

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: 200,
        temperature: 0,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Parse this query: "${query}"` },
        ],
      }),
    })

    if (!res.ok) {
      console.error('Groq parse error:', res.status)
      return parseQueryLocally(query)
    }

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content || '{}'

    // Extract JSON from response (may have markdown code blocks)
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return parseQueryLocally(query)

    const parsed = JSON.parse(jsonMatch[0]) as ParsedFilters
    return parsed
  } catch (err) {
    console.error('Groq parse failed:', err)
    return parseQueryLocally(query)
  }
}

// ── Fallback: Parse query locally with regex ─────────────────────────────────

function parseQueryLocally(query: string): ParsedFilters {
  const q = query.toLowerCase()
  const filters: ParsedFilters = { status: 'Active' }

  // Utah cities
  const CITIES = [
    'Salt Lake City', 'West Jordan', 'Sandy', 'South Jordan', 'Taylorsville',
    'Murray', 'Provo', 'Orem', 'Ogden', 'Layton', 'St. George', 'St George',
    'Logan', 'Draper', 'Herriman', 'Riverton', 'Lehi', 'West Valley',
    'Millcreek', 'Cottonwood Heights', 'Midvale', 'Bountiful', 'Holladay',
    'Bluffdale', 'Saratoga Springs', 'Eagle Mountain', 'American Fork',
    'Highland', 'Alpine', 'Springville', 'Spanish Fork',
  ]
  const cityFound = CITIES.find(c => q.includes(c.toLowerCase()))
  if (cityFound) filters.city = cityFound

  // Price: "under $600k", "$400k", "600,000"
  const maxPriceMatch = q.match(/under\s*\$?(\d{3,4})k|under\s*\$?(\d+),(\d{3})/)
  if (maxPriceMatch) {
    if (maxPriceMatch[1]) filters.maxPrice = parseInt(maxPriceMatch[1]) * 1000
    else if (maxPriceMatch[2]) filters.maxPrice = parseInt(maxPriceMatch[2]) * 1000 + parseInt(maxPriceMatch[3])
  }

  const minPriceMatch = q.match(/over\s*\$?(\d{3,4})k|above\s*\$?(\d{3,4})k/)
  if (minPriceMatch) {
    filters.minPrice = parseInt(minPriceMatch[1] || minPriceMatch[2]) * 1000
  }

  // Range: "$400k-$600k"
  const rangeMatch = q.match(/\$?(\d{3,4})k\s*[-–to]\s*\$?(\d{3,4})k/)
  if (rangeMatch) {
    filters.minPrice = parseInt(rangeMatch[1]) * 1000
    filters.maxPrice = parseInt(rangeMatch[2]) * 1000
  }

  // Bedrooms
  const bedMatch = q.match(/(\d)\s*(?:bed|bedroom|br\b)/)
  if (bedMatch) filters.bedrooms = parseInt(bedMatch[1])

  // Bathrooms
  const bathMatch = q.match(/(\d)\s*(?:bath|bathroom)/)
  if (bathMatch) filters.bathrooms = parseInt(bathMatch[1])

  // Property type
  if (/commercial|nnn|office|retail/.test(q)) filters.propertyType = 'Commercial'
  else if (/land|lot|acre/.test(q)) filters.propertyType = 'Land'
  else if (/multi.?family|duplex|triplex|4.?plex/.test(q)) filters.propertyType = 'Multi-Family'

  // Status overrides
  if (/sold|closed/.test(q)) filters.status = 'Closed'
  else if (/pending|under contract/.test(q)) filters.status = 'Pending'

  return filters
}

// ── Step 2: Build OData query ─────────────────────────────────────────────────

function buildODataFilter(filters: ParsedFilters): string {
  const conditions: string[] = []

  conditions.push(`StandardStatus eq '${filters.status || 'Active'}'`)

  if (filters.city) conditions.push(`City eq '${filters.city}'`)
  if (filters.minPrice) conditions.push(`ListPrice ge ${filters.minPrice}`)
  if (filters.maxPrice) conditions.push(`ListPrice le ${filters.maxPrice}`)
  if (filters.bedrooms) conditions.push(`BedroomsTotal ge ${filters.bedrooms}`)
  if (filters.bathrooms) conditions.push(`BathroomsTotalInteger ge ${filters.bathrooms}`)
  if (filters.propertyType && filters.propertyType !== 'All') {
    conditions.push(`PropertyType eq '${filters.propertyType}'`)
  }
  if (filters.minSqFt) conditions.push(`LivingArea ge ${filters.minSqFt}`)
  if (filters.maxSqFt) conditions.push(`LivingArea le ${filters.maxSqFt}`)

  return conditions.join(' and ')
}

// ── Step 3: Query WFRMLS ──────────────────────────────────────────────────────

async function queryWFRMLS(
  filters: ParsedFilters,
  limit: number
): Promise<{ listings: ListingResult[]; totalCount: number }> {
  const filter = buildODataFilter(filters)
  const select = [
    'ListingKey', 'UnparsedAddress', 'City', 'StateOrProvince', 'PostalCode',
    'ListPrice', 'BedroomsTotal', 'BathroomsTotalInteger', 'LivingArea',
    'YearBuilt', 'LotSizeAcres', 'StandardStatus', 'OnMarketDate', 'PropertyType',
  ].join(',')

  // Get count first with a separate lightweight request
  const countUrl = `${WFRMLS_BASE}/Property?$filter=${encodeURIComponent(filter)}&$count=true&$top=0`
  const dataUrl = `${WFRMLS_BASE}/Property?$filter=${encodeURIComponent(filter)}&$select=${encodeURIComponent(select)}&$top=${limit}&$orderby=OnMarketDate desc&$count=true`

  try {
    const res = await fetch(dataUrl, {
      headers: {
        Authorization: WFRMLS_TOKEN,
        Accept: 'application/json',
      },
      next: { revalidate: 300 },
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error('WFRMLS query error:', res.status, errorText)
      return { listings: [], totalCount: 0 }
    }

    const data = await res.json()
    const totalCount: number = data['@odata.count'] || data.value?.length || 0
    const properties = data.value || []

    const listings: ListingResult[] = properties.map((p: Record<string, unknown>) => {
      const city = (p.City as string) || ''
      const address = (p.UnparsedAddress as string) || `${city}, UT`
      const listingKey = (p.ListingKey as string) || ''
      const citySlug = city.replace(/ /g, '+')

      return {
        listingKey,
        address,
        city,
        price: (p.ListPrice as number) || 0,
        beds: (p.BedroomsTotal as number) || 0,
        baths: (p.BathroomsTotalInteger as number) || 0,
        sqft: (p.LivingArea as number) || undefined,
        yearBuilt: (p.YearBuilt as number) || undefined,
        lotAcres: (p.LotSizeAcres as number) || undefined,
        status: (p.StandardStatus as string) || 'Active',
        listDate: (p.OnMarketDate as string) || undefined,
        url: listingKey
          ? `https://gsbrealtor.com/listing/${listingKey}`
          : `https://gsbrealtor.com/search?city=${citySlug}`,
      }
    })

    return { listings, totalCount }
  } catch (err) {
    console.error('queryWFRMLS error:', err)
    return { listings: [], totalCount: 0 }
  }
}

// ── Step 4: Generate natural language summary ─────────────────────────────────

function generateSummary(
  query: string,
  filters: ParsedFilters,
  listings: ListingResult[],
  totalCount: number
): string {
  if (listings.length === 0) {
    const cityStr = filters.city ? ` in ${filters.city}` : ' in Utah'
    return `No active listings found${cityStr} matching your criteria. Try broadening your search — remove the price cap or check adjacent cities.`
  }

  const prices = listings.map(l => l.price).filter(p => p > 0)
  const avgPrice = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0

  const parts: string[] = []

  // Count and location
  const cityStr = filters.city ? ` in ${filters.city}` : ' in Utah'
  const priceStr = filters.maxPrice
    ? ` under $${(filters.maxPrice / 1000).toFixed(0)}K`
    : filters.minPrice
    ? ` over $${(filters.minPrice / 1000).toFixed(0)}K`
    : ''
  const bedStr = filters.bedrooms ? ` ${filters.bedrooms}-bedroom` : ''
  const typeStr = filters.propertyType && filters.propertyType !== 'All' ? ` ${filters.propertyType.toLowerCase()}` : ''

  parts.push(`Found ${totalCount} active${bedStr}${typeStr} listings${cityStr}${priceStr}.`)

  if (avgPrice > 0) {
    parts.push(`Average list price: $${avgPrice.toLocaleString()}.`)
  }

  if (listings.length < totalCount) {
    parts.push(`Showing the ${listings.length} most recent.`)
  }

  // Search link
  const searchParams = new URLSearchParams()
  if (filters.city) searchParams.set('city', filters.city)
  if (filters.maxPrice) searchParams.set('maxPrice', String(filters.maxPrice))
  if (filters.minPrice) searchParams.set('minPrice', String(filters.minPrice))
  if (filters.bedrooms) searchParams.set('beds', String(filters.bedrooms))
  const searchUrl = `https://gsbrealtor.com/search${searchParams.toString() ? `?${searchParams}` : ''}`
  parts.push(`Browse all at ${searchUrl}`)

  return parts.join(' ')
}

// ── Main POST Handler ─────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, limit = 5 } = body as { query?: string; limit?: number }

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'query is required', example: '{ "query": "3 bed homes in Draper under $600k", "limit": 5 }' },
        { status: 400 }
      )
    }

    const clampedLimit = Math.min(Math.max(1, limit), 20)

    // Step 1: Parse natural language query
    const filters = await parseQueryWithGroq(query)

    // Step 2: Query WFRMLS
    const { listings, totalCount } = await queryWFRMLS(filters, clampedLimit)

    // Step 3: Generate natural language summary
    const summary = generateSummary(query, filters, listings, totalCount)

    return NextResponse.json({
      query,
      filters,
      totalCount,
      listings,
      summary,
      searchUrl: `https://gsbrealtor.com/search${filters.city ? `?city=${encodeURIComponent(filters.city)}` : ''}${filters.maxPrice ? `${filters.city ? '&' : '?'}maxPrice=${filters.maxPrice}` : ''}`,
    })

  } catch (error) {
    console.error('listings-query error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}

// ── GET handler for quick testing ────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({
      message: 'WFRMLS Natural Language Query API',
      usage: 'POST /api/listings-query with { "query": "3 bed homes in Draper under $600k", "limit": 5 }',
      examples: [
        '3 bedroom homes in Draper under $600,000',
        'investment properties in West Jordan under $500k',
        'homes in Herriman between $400k and $550k',
        'commercial properties in Salt Lake City',
        '4 bed 2 bath homes in Lehi under $450k',
      ],
    })
  }

  // Support GET for convenience: /api/listings-query?q=3+bed+in+Draper&limit=5
  const limit = parseInt(searchParams.get('limit') || '5')
  const filters = await parseQueryWithGroq(query)
  const { listings, totalCount } = await queryWFRMLS(filters, Math.min(limit, 20))
  const summary = generateSummary(query, filters, listings, totalCount)

  return NextResponse.json({ query, filters, totalCount, listings, summary })
}
