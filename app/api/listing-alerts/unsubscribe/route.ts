import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return new NextResponse(
      `<html><body style="font-family:sans-serif;text-align:center;padding:60px">
        <h2 style="color:#C9A84C">Invalid unsubscribe link</h2>
        <p>This unsubscribe link is missing a token. Please contact us if you need help.</p>
        <p><a href="https://gsbrealtor.com">Return to GSB Realtor</a></p>
      </body></html>`,
      { status: 400, headers: { 'Content-Type': 'text/html' } }
    )
  }

  const { data, error } = await supabase
    .from('listing_alerts')
    .update({ active: false })
    .eq('unsubscribe_token', token)
    .select('email')
    .single()

  if (error || !data) {
    return new NextResponse(
      `<html><body style="font-family:sans-serif;text-align:center;padding:60px">
        <h2 style="color:#C9A84C">Link Not Found</h2>
        <p>This unsubscribe link is invalid or already used.</p>
        <p><a href="https://gsbrealtor.com">Return to GSB Realtor</a></p>
      </body></html>`,
      { status: 404, headers: { 'Content-Type': 'text/html' } }
    )
  }

  return new NextResponse(
    `<html><body style="font-family:sans-serif;text-align:center;padding:60px;background:#0A0A0A;color:#F5F3EE;min-height:100vh">
      <h2 style="color:#C9A84C;font-size:28px;margin-bottom:16px">You've Been Unsubscribed</h2>
      <p style="color:#888;max-width:400px;margin:0 auto 24px">
        You will no longer receive listing alerts at <strong style="color:#F5F3EE">${data.email}</strong>.
      </p>
      <a href="https://gsbrealtor.com/search" style="background:#C9A84C;color:#000;padding:12px 28px;text-decoration:none;border-radius:8px;font-weight:600;display:inline-block">
        Browse Listings →
      </a>
      <p style="color:#555;font-size:12px;margin-top:32px">
        Changed your mind? Visit <a href="https://gsbrealtor.com/search" style="color:#C9A84C">gsbrealtor.com/search</a> to set up a new alert.
      </p>
    </body></html>`,
    { status: 200, headers: { 'Content-Type': 'text/html' } }
  )
}
