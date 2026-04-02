// Redirect to the canonical unsubscribe endpoint at /api/listing-alerts/unsubscribe
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  const redirectUrl = new URL('/api/listing-alerts/unsubscribe', request.url)
  if (token) redirectUrl.searchParams.set('token', token)
  return NextResponse.redirect(redirectUrl)
}
