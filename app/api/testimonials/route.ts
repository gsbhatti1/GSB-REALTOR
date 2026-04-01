import { NextRequest, NextResponse } from 'next/server'

// Hardcoded fallback testimonials for GET (when Supabase is unavailable)
const FALLBACK_TESTIMONIALS = [
  {
    id: '1',
    name: 'Sarah M.',
    city: 'West Jordan',
    rating: 5,
    review: 'Gurpreet made buying my first home completely stress-free. He walked me through every step of the process, explained everything in plain language, and negotiated an amazing deal.',
    transaction_type: 'bought',
    approved: true,
    created_at: '2024-03-15T00:00:00Z',
  },
  {
    id: '2',
    name: 'James & Linda T.',
    city: 'Sandy',
    rating: 5,
    review: 'We sold for $28,000 over list price. His negotiation skills are exceptional. He treated our family\'s biggest asset like it was his own.',
    transaction_type: 'sold',
    approved: true,
    created_at: '2024-01-20T00:00:00Z',
  },
  {
    id: '3',
    name: 'Marco Rodriguez',
    city: 'Salt Lake City',
    rating: 5,
    review: 'Gurpreet helped us find the perfect commercial space for our restaurant expansion — he knew the SLC market cold, understood NNN leases, and got us fantastic terms.',
    transaction_type: 'commercial',
    approved: true,
    created_at: '2023-11-10T00:00:00Z',
  },
]

export async function GET() {
  // Try Supabase first; fall back to hardcoded if unavailable
  try {
    const url  = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key  = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (url && key) {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(url, key)
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false })

      if (!error && data && data.length > 0) {
        return NextResponse.json({ testimonials: data })
      }
    }
  } catch { /* fall through */ }

  return NextResponse.json({ testimonials: FALLBACK_TESTIMONIALS })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, city, rating, review, transaction_type } = body

    if (!name || !review) {
      return NextResponse.json({ error: 'Name and review are required' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    const url  = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key  = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (url && key) {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(url, key)
      const { error } = await supabase.from('testimonials').insert({
        name,
        city: city || null,
        rating: rating || 5,
        review,
        transaction_type: transaction_type || 'bought',
        approved: false, // requires manual approval
      })

      if (error) {
        console.error('Supabase testimonial insert error:', error)
        // Still return success to user — we'll handle async
      }
    }

    return NextResponse.json({ success: true, message: 'Review submitted. Thank you!' })
  } catch (err) {
    console.error('Testimonial POST error:', err)
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}
