/**
 * GSB REALTOR — LEAD NOTIFICATIONS
 * Every lead hits Gurpreet's email AND phone instantly
 */

import { Lead } from './supabase'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const RESEND_FROM = process.env.RESEND_FROM_EMAIL || 'leads@gsbrealtor.com'
const AGENT_EMAIL = process.env.RESEND_TO_EMAIL || 'gsbhatti1@yahoo.com'
const AGENT_PHONE = process.env.GURPREET_PHONE_NUMBER || '+18016358462'

// -----------------------------------------------
// SEND EMAIL NOTIFICATION
// -----------------------------------------------

export async function sendLeadEmail(lead: Lead): Promise<void> {
  if (!RESEND_API_KEY) {
    console.log('Resend not configured, skipping email')
    return
  }

  const subject = `🔥 New Lead: ${lead.first_name} ${lead.last_name} — ${formatLeadType(lead.lead_type)}`

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #111; color: #f5f3ee; padding: 32px; border-radius: 12px;">
      <div style="border-bottom: 2px solid #C9A84C; padding-bottom: 16px; margin-bottom: 24px;">
        <h1 style="color: #C9A84C; font-size: 24px; margin: 0;">New Lead — GSB Realtor</h1>
      </div>

      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #888; width: 140px;">Name</td>
          <td style="padding: 8px 0; font-weight: 600;">${lead.first_name} ${lead.last_name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #888;">Email</td>
          <td style="padding: 8px 0;"><a href="mailto:${lead.email}" style="color: #C9A84C;">${lead.email}</a></td>
        </tr>
        ${lead.phone ? `
        <tr>
          <td style="padding: 8px 0; color: #888;">Phone</td>
          <td style="padding: 8px 0;"><a href="tel:${lead.phone}" style="color: #C9A84C;">${lead.phone}</a></td>
        </tr>` : ''}
        <tr>
          <td style="padding: 8px 0; color: #888;">Lead Type</td>
          <td style="padding: 8px 0;">${formatLeadType(lead.lead_type)}</td>
        </tr>
        ${lead.property_address ? `
        <tr>
          <td style="padding: 8px 0; color: #888;">Property</td>
          <td style="padding: 8px 0;">${lead.property_address}</td>
        </tr>` : ''}
        ${lead.message ? `
        <tr>
          <td style="padding: 8px 0; color: #888; vertical-align: top;">Message</td>
          <td style="padding: 8px 0;">${lead.message}</td>
        </tr>` : ''}
        <tr>
          <td style="padding: 8px 0; color: #888;">Source</td>
          <td style="padding: 8px 0;">${lead.source || 'website'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #888;">Time</td>
          <td style="padding: 8px 0;">${new Date().toLocaleString('en-US', { timeZone: 'America/Denver' })} MT</td>
        </tr>
      </table>

      <div style="margin-top: 32px; padding: 16px; background: rgba(201,168,76,0.1); border-radius: 8px; border: 1px solid rgba(201,168,76,0.3);">
        <p style="margin: 0; font-size: 14px; color: #C9A84C;">⚡ Respond within 5 minutes — leads go cold fast!</p>
      </div>

      <div style="margin-top: 24px; font-size: 12px; color: #444; text-align: center;">
        GSB Realtor | Gurpreet Bhatti | 801-635-8462 | gsbrealtor.com
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
      to: [AGENT_EMAIL],
      subject,
      html,
    }),
  })
}

// -----------------------------------------------
// SEND SMS NOTIFICATION (Twilio)
// -----------------------------------------------

export async function sendLeadSMS(lead: Lead): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const fromPhone = process.env.TWILIO_PHONE_NUMBER

  if (!accountSid || !authToken || !fromPhone) {
    console.log('Twilio not configured, skipping SMS')
    return
  }

  const message = `🏠 GSB New Lead!\n${lead.first_name} ${lead.last_name}\n${lead.phone || lead.email}\n${formatLeadType(lead.lead_type)}${lead.property_address ? `\n${lead.property_address}` : ''}`

  const body = new URLSearchParams({
    To: AGENT_PHONE,
    From: fromPhone,
    Body: message,
  })

  await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  })
}

function formatLeadType(type: string): string {
  const map: Record<string, string> = {
    tour_request: 'Tour Request',
    contact_form: 'Contact Form',
    listing_inquiry: 'Listing Inquiry',
    market_report: 'Market Report Request',
    saved_search: 'Saved Search',
    call_request: 'Call Request',
    investor_inquiry: 'Investor Inquiry',
  }
  return map[type] || type
}
