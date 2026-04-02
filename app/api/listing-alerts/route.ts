import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST - Create a new listing alert
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, phone, name, cities, minPrice, maxPrice, minBeds, propertyTypes } = body

    if (!email || !cities || cities.length === 0) {
      return NextResponse.json({ error: 'Email and at least one city required' }, { status: 400 })
    }

    // Check if alert already exists for this email
    const { data: existing } = await supabase
      .from('listing_alerts')
      .select('id')
      .eq('email', email)
      .single()

    if (existing) {
      // Update existing alert
      const { error } = await supabase
        .from('listing_alerts')
        .update({
          cities,
          min_price: minPrice,
          max_price: maxPrice,
          min_beds: minBeds,
          property_types: propertyTypes,
          active: true,
        })
        .eq('email', email)
      if (error) throw error
      return NextResponse.json({ success: true, message: 'Alert updated' })
    }

    // Create new alert
    const { error } = await supabase
      .from('listing_alerts')
      .insert({ email, phone, name, cities, min_price: minPrice, max_price: maxPrice, min_beds: minBeds, property_types: propertyTypes })

    if (error) throw error

    // Send confirmation email via Resend
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL,
          to: email,
          subject: '✅ Listing Alert Set Up — GSB Realtor',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #C9A84C;">You're All Set, ${name || 'there'}!</h2>
              <p>You'll receive email alerts when new properties matching your criteria become available in: <strong>${cities.join(', ')}</strong></p>
              ${minPrice || maxPrice ? `<p>Price range: ${minPrice ? '$' + minPrice.toLocaleString() : 'No min'} – ${maxPrice ? '$' + maxPrice.toLocaleString() : 'No max'}</p>` : ''}
              ${minBeds ? `<p>Minimum bedrooms: ${minBeds}</p>` : ''}
              <p><a href="https://gsbrealtor.com/search" style="background: #C9A84C; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Browse Current Listings →</a></p>
              <p style="color: #888; font-size: 12px;">Gurpreet Bhatti · 801-635-8462 · gsbrealtor.com</p>
            </div>
          `,
        }),
      })
    } catch {
      // Email failure is non-fatal
    }

    return NextResponse.json({ success: true, message: 'Alert created' })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// GET - Get alerts for admin view
export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${process.env.DRIP_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('listing_alerts')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ alerts: data, total: data?.length || 0 })
}
