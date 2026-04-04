export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const RESEND_FROM = process.env.RESEND_FROM_EMAIL || 'leads@gsbrealtor.com'

/**
 * POST /api/email-drip
 * Enrolls a lead into the 7-touch email drip sequence.
 * Sends Email 1 (Day 0 welcome) immediately and stores drip state in Supabase.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { email, name, type, city } = body as {
      email?: string
      name?: string
      type?: 'buyer' | 'seller' | 'investor'
      city?: string
    }

    if (!email || !name || !type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: email, name, type' },
        { status: 400 }
      )
    }

    if (!['buyer', 'seller', 'investor'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'type must be buyer, seller, or investor' },
        { status: 400 }
      )
    }

    // ── Store drip enrollment in Supabase leads table ─────────────
    try {
      const supabase = getSupabaseAdmin()
      await supabase
        .from('leads')
        .update({ drip_enrolled: true, drip_day: 0 })
        .eq('email', email.toLowerCase())
    } catch (e) {
      console.error('Supabase drip update failed (non-blocking):', e)
    }

    // ── Send Day 0 welcome email immediately ──────────────────────
    if (RESEND_API_KEY) {
      const firstName = name.split(' ')[0]
      const cityLine = city ? ` in ${city}` : ' across the Salt Lake valley'

      const subject = "You're in \u2014 here's what happens next"
      const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #111; color: #f5f3ee; padding: 32px; border-radius: 12px;">
          <div style="border-bottom: 2px solid #C9A84C; padding-bottom: 16px; margin-bottom: 24px;">
            <h1 style="color: #C9A84C; font-size: 22px; margin: 0;">GSB Realtor</h1>
          </div>

          <h2 style="color: #F5F3EE; font-size: 20px;">Hi ${firstName},</h2>

          <p style="line-height: 1.7; color: #ccc;">
            Welcome \u2014 I'm Gurpreet Bhatti, a Utah REALTOR based${cityLine}. You just took the first step, and I want to make sure it's worth your time.
          </p>

          <p style="line-height: 1.7; color: #ccc;">Here's what you can expect from me:</p>

          <ul style="color: #ccc; line-height: 2;">
            <li>Real Utah market data (not fluff)</li>
            <li>Honest advice whether you're ready now or in 12 months</li>
            <li>Zero pressure, ever</li>
          </ul>

          <p style="line-height: 1.7; color: #ccc;">
            I've helped buyers and sellers across West Jordan, Sandy, South Jordan, Draper, and the whole valley \u2014 including many families from diverse backgrounds who needed someone who truly understood their situation.
          </p>

          <p style="line-height: 1.7; color: #ccc;">
            If you have a specific neighborhood or budget in mind, just reply and tell me. I'll start working for you right now.
          </p>

          <p style="line-height: 1.7; color: #ccc;">Looking forward to helping you,</p>

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(201,168,76,0.3);">
            <p style="margin: 0; color: #C9A84C; font-weight: 600;">Gurpreet Bhatti</p>
            <p style="margin: 4px 0 0; color: #888; font-size: 14px;">Utah REALTOR | gsbrealtor.com | 801-635-8462</p>
          </div>
        </div>
      `

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: RESEND_FROM,
          to: [email],
          subject,
          html,
        }),
      }).catch(e => console.error('Drip email send failed:', e))
    } else {
      console.log('Resend not configured, skipping drip email')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email drip API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
