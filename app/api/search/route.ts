export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { searchProperties, SearchFilters } from '@/lib/mls'

export async function GET(request: NextRequest) {
  try {
    const s = request.nextUrl.searchParams
    const filters: SearchFilters = {
      city: s.get('city') || undefined,
      minPrice: s.get('minPrice') ? Number(s.get('minPrice')) : undefined,
      maxPrice: s.get('maxPrice') ? Number(s.get('maxPrice')) : undefined,
      bedrooms: s.get('beds') ? Number(s.get('beds')) : undefined,
      bathrooms: s.get('baths') ? Number(s.get('baths')) : undefined,
      propertyType: s.get('type') || undefined,
      status: s.get('status') || 'Active',
      daysBack: s.get('daysBack') ? Number(s.get('daysBack')) : undefined,
      top: s.get('top') ? Number(s.get('top')) : 24,
      skip: s.get('skip') ? Number(s.get('skip')) : 0,
      orderBy: s.get('orderBy') || undefined,
    }
    const result = await searchProperties(filters)
    return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error: any) {
    console.error('[Search API Error]', error?.message || error)
    return NextResponse.json({ properties: [], total: 0, hasMore: false, error: error?.message })
  }
}
