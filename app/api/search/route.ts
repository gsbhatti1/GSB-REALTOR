export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'
import { searchProperties, SearchFilters } from '@/lib/mls'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const filters: SearchFilters = {
      city:           searchParams.get('city') || undefined,
      countyOrParish: searchParams.get('county') || undefined,
      minPrice:       searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice:       searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      bedrooms:       searchParams.get('beds') ? Number(searchParams.get('beds')) : undefined,
      bathrooms:      searchParams.get('baths') ? Number(searchParams.get('baths')) : undefined,
      propertyType:   searchParams.get('type') || undefined,
      status:         searchParams.get('status') || 'Active',
      minSqFt:        searchParams.get('minSqFt') ? Number(searchParams.get('minSqFt')) : undefined,
      maxSqFt:        searchParams.get('maxSqFt') ? Number(searchParams.get('maxSqFt')) : undefined,
      minAcres:       searchParams.get('minAcres') ? Number(searchParams.get('minAcres')) : undefined,
      daysBack:       searchParams.get('daysBack') ? Number(searchParams.get('daysBack')) : undefined,
      lat:            searchParams.get('lat') ? Number(searchParams.get('lat')) : undefined,
      lng:            searchParams.get('lng') ? Number(searchParams.get('lng')) : undefined,
      radiusMiles:    searchParams.get('radius') ? Number(searchParams.get('radius')) : undefined,
      top:            searchParams.get('top') ? Number(searchParams.get('top')) : 24,
      skip:           searchParams.get('skip') ? Number(searchParams.get('skip')) : 0,
      orderBy:        searchParams.get('orderBy') || undefined,
    }

    const result = await searchProperties(filters)

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'no-store' },
    })

  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { properties: [], total: 0, hasMore: false },
      { status: 200 }
    )
  }
}
