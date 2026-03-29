export const dynamic = 'force-dynamic'

/**
 * GSB REALTOR — LEAD CAPTURE API
 * POST /api/leads
 * Saves lead to Supabase + notifies Gurpreet via email + SMS
 */

import { NextRequest, NextResponse } from 'next/server'
import { saveLead, Lead } from '@/lib/supabase'
import { sendLeadEmail, sendLeadSMS } from '@/lib/notifications'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.first_name || !body.last_name || !body.email || !body.lead_type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Get UTM params and source from headers
    const referer = request.headers.get('referer') || ''
    const userAgent = request.headers.get('user-agent') || ''

    const lead: Lead = {
      first_name: body.first_name.trim(),
      last_name: body.last_name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim(),
      lead_type: body.lead_type,
      message: body.message?.trim(),
      property_id: body.property_id,
      property_address: body.property_address,
      source: body.source || 'website',
      utm_source: body.utm_source,
      utm_medium: body.utm_medium,
      utm_campaign: body.utm_campaign,
    }

    // Save to database
    const { success, error } = await saveLead(lead)

    if (!success) {
      console.error('Failed to save lead:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to save lead' },
        { status: 500 }
      )
    }

    // Send notifications — don't await, fire and forget
    // This way the user gets instant response
    sendLeadEmail(lead).catch(e => console.error('Email notification failed:', e))
    sendLeadSMS(lead).catch(e => console.error('SMS notification failed:', e))

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Lead API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
