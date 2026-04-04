export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'
import { saveLead, Lead } from '@/lib/supabase'
import { sendLeadEmail, sendLeadSMS } from '@/lib/notifications'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.first_name || !body.last_name || !body.email || !body.lead_type) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 400 })
    }

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

    const { success, error } = await saveLead(lead)

    if (!success) {
      console.error('Failed to save lead:', error)
      return NextResponse.json({ success: false, error: 'Failed to save lead' }, { status: 500 })
    }

    sendLeadEmail(lead).catch(e => console.error('Email failed:', e))
    sendLeadSMS(lead).catch(e => console.error('SMS failed:', e))

    // Auto-enroll in email drip sequence (non-blocking)
    const dripType = lead.lead_type === 'investor_inquiry' ? 'investor'
      : lead.lead_type === 'listing_inquiry' || lead.lead_type === 'market_report' ? 'seller'
      : 'buyer'
    fetch(new URL('/api/email-drip', request.url).toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: lead.email,
        name: `${lead.first_name} ${lead.last_name}`,
        type: dripType,
        city: lead.property_address,
      }),
    }).catch(e => console.error('Drip enrollment failed:', e))

    // Ping n8n webhook for automations (non-blocking)
    const n8nWebhook = process.env.N8N_WEBHOOK_URL
    if (n8nWebhook) {
      fetch(n8nWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${lead.first_name} ${lead.last_name}`,
          email: lead.email,
          phone: lead.phone || '',
          message: lead.message || '',
          type: lead.lead_type,
          property_address: lead.property_address || '',
          source: lead.source,
        }),
      }).catch(e => console.error('n8n webhook failed:', e))
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Lead API error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
