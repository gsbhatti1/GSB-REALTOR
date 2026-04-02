import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET — fetch saved properties for user/session
export async function GET(req: NextRequest) {
  const sessionId = req.headers.get('x-session-id')
  const userId = req.headers.get('x-user-id')

  if (!sessionId && !userId) return NextResponse.json({ saved: [] })

  let query = supabase.from('saved_properties').select('*').order('saved_at', { ascending: false })

  if (userId) {
    query = query.eq('user_id', userId)
  } else if (sessionId) {
    query = query.eq('session_id', sessionId)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ saved: data || [] })
}

// POST — save a property
export async function POST(req: NextRequest) {
  const body = await req.json()
  const sessionId = req.headers.get('x-session-id')
  const userId = req.headers.get('x-user-id')

  const { listingKey, address, city, listPrice, bedrooms, bathrooms, photoUrl, propertyType } = body
  if (!listingKey) return NextResponse.json({ error: 'listingKey required' }, { status: 400 })

  const row: Record<string, unknown> = {
    listing_key: listingKey,
    address,
    city,
    list_price: listPrice,
    bedrooms,
    bathrooms,
    photo_url: photoUrl,
    property_type: propertyType,
  }

  if (userId) {
    row.user_id = userId
  } else if (sessionId) {
    row.session_id = sessionId
  } else {
    return NextResponse.json({ error: 'No session or user ID' }, { status: 400 })
  }

  const conflictCol = userId ? 'user_id,listing_key' : 'session_id,listing_key'
  const { error } = await supabase
    .from('saved_properties')
    .upsert(row, { onConflict: conflictCol })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

// DELETE — unsave a property
export async function DELETE(req: NextRequest) {
  const { listingKey } = await req.json()
  const sessionId = req.headers.get('x-session-id')
  const userId = req.headers.get('x-user-id')

  let query = supabase.from('saved_properties').delete().eq('listing_key', listingKey)
  if (userId) {
    query = query.eq('user_id', userId)
  } else if (sessionId) {
    query = query.eq('session_id', sessionId)
  }

  const { error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
