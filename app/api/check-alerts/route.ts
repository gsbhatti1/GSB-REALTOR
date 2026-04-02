// NOTE: This endpoint should be called daily by the cron system.
// The existing Perplexity cron can be updated to also call this endpoint:
//   GET /api/check-alerts   (with Authorization: Bearer <DRIP_SECRET>)
// This will check for new listings in the last 24 hours and email subscribers.

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const WFRMLS_TOKEN = process.env.WFRMLS_BEARER_TOKEN!
const RESEND_KEY = process.env.RESEND_API_KEY!
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL!

async function getNewListings(
  cities: string[],
  minPrice?: number,
  maxPrice?: number,
  minBeds?: number,
  propertyTypes?: string[]
): Promise<any[]> {
  const conditions: string[] = [`StandardStatus eq 'Active'`]

  // Get listings from last 24 hours
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  conditions.push(`OnMarketDate ge ${yesterday.split('T')[0]}`)

  if (cities.length > 0) {
    const cityFilter = cities.map(c => `City eq '${c.replace(/'/g, "''")}'`).join(' or ')
    conditions.push(`(${cityFilter})`)
  }
  if (minPrice) conditions.push(`ListPrice ge ${minPrice}`)
  if (maxPrice) conditions.push(`ListPrice le ${maxPrice}`)
  if (minBeds) conditions.push(`BedroomsTotal ge ${minBeds}`)
  if (propertyTypes && propertyTypes.length > 0) {
    const typeFilter = propertyTypes.map(t => `PropertyType eq '${t}'`).join(' or ')
    conditions.push(`(${typeFilter})`)
  }

  const url = new URL('https://resoapi.utahrealestate.com/reso/odata/Property')
  url.searchParams.set('$filter', conditions.join(' and '))
  url.searchParams.set(
    '$select',
    'ListingKey,ListPrice,City,BedroomsTotal,BathroomsTotalInteger,UnparsedAddress,StandardStatus,PropertyType,OnMarketDate'
  )
  url.searchParams.set('$top', '10')
  url.searchParams.set('$orderby', 'OnMarketDate desc')

  const res = await fetch(url.toString(), {
    headers: { Authorization: WFRMLS_TOKEN, Accept: 'application/json' },
    cache: 'no-store',
  })

  if (!res.ok) return []
  const data = await res.json()
  return data.value || []
}

export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${process.env.DRIP_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get all active alerts
  const { data: alerts } = await supabase
    .from('listing_alerts')
    .select('*')
    .eq('active', true)

  if (!alerts || alerts.length === 0) {
    return NextResponse.json({ sent: 0, message: 'No active alerts' })
  }

  let notified = 0

  for (const alert of alerts) {
    try {
      const listings = await getNewListings(
        alert.cities,
        alert.min_price,
        alert.max_price,
        alert.min_beds,
        alert.property_types
      )
      if (listings.length === 0) continue

      // Build email
      const listingRows = listings
        .slice(0, 5)
        .map(
          (l: any) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">
            <strong>${l.UnparsedAddress || 'Address on request'}</strong><br>
            <span style="color: #666">${l.City}, UT</span>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; color: #C9A84C; font-weight: bold;">
            $${(l.ListPrice || 0).toLocaleString()}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;">
            ${l.BedroomsTotal || '?'}bd/${l.BathroomsTotalInteger || '?'}ba
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">
            <a href="https://gsbrealtor.com/listing/${l.ListingKey}" style="color: #C9A84C;">View →</a>
          </td>
        </tr>
      `
        )
        .join('')

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: alert.email,
          subject: `🏠 ${listings.length} New ${alert.cities[0]} Listing${listings.length > 1 ? 's' : ''} — GSB Realtor`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #C9A84C;">New Listings in ${alert.cities.join(', ')}</h2>
              <p>${listings.length} new propert${listings.length > 1 ? 'ies' : 'y'} matching your search appeared today:</p>
              <table style="width: 100%; border-collapse: collapse;">${listingRows}</table>
              <p><a href="https://gsbrealtor.com/search?city=${encodeURIComponent(alert.cities[0])}" style="background: #C9A84C; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin-top: 16px;">See All Listings →</a></p>
              <p style="color: #888; font-size: 11px; margin-top: 24px;">
                You're receiving this because you set up a listing alert at gsbrealtor.com.<br>
                <a href="https://gsbrealtor.com/api/listing-alerts/unsubscribe?token=${alert.unsubscribe_token}">Unsubscribe</a>
              </p>
            </div>
          `,
        }),
      })

      await supabase
        .from('listing_alerts')
        .update({ last_notified_at: new Date().toISOString() })
        .eq('id', alert.id)

      notified++
    } catch {
      // Continue with next alert on error
    }
  }

  return NextResponse.json({ sent: notified, total_alerts: alerts.length })
}
