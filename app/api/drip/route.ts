/**
 * GSB REALTOR — DRIP EMAIL API
 * Called by n8n at Day 1, 3, 7, 14 after lead capture
 * POST /api/drip { email, firstName, day }
 */

export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { sendDripEmail } from '@/lib/notifications'

export async function POST(request: NextRequest) {
  try {
    // Verify internal secret to prevent abuse
    const secret = request.headers.get('x-drip-secret')
    const expectedSecret = process.env.DRIP_SECRET || 'gsb-drip-2024'
    if (secret !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { email, firstName, day } = await request.json()

    if (!email || !firstName || !day) {
      return NextResponse.json({ error: 'Missing email, firstName, or day' }, { status: 400 })
    }

    const validDays = [1, 3, 7, 14]
    if (!validDays.includes(Number(day))) {
      return NextResponse.json({ error: `Invalid day. Must be one of: ${validDays.join(', ')}` }, { status: 400 })
    }

    await sendDripEmail({ to: email, firstName, day: Number(day) })

    return NextResponse.json({ success: true, sent: { email, firstName, day } })

  } catch (error) {
    console.error('Drip API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
