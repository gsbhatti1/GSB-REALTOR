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

// -----------------------------------------------
// SEND DRIP EMAIL TO LEAD (14-day nurture sequence)
// Called from n8n or a scheduled job
// -----------------------------------------------

export async function sendDripEmail(params: {
  to: string
  firstName: string
  day: number
}): Promise<void> {
  if (!RESEND_API_KEY) return

  const sequences: Record<number, { subject: string; html: string }> = {
    1: {
      subject: `Welcome! I'm here to help — Gurpreet Bhatti, GSB Realtor`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #111; color: #f5f3ee; padding: 32px; border-radius: 12px;">
          <h2 style="color: #C9A84C;">Hi ${params.firstName},</h2>
          <p>Thank you for reaching out. I'm Gurpreet Bhatti — USMC veteran, REALTOR®, and commercial real estate specialist across Utah, Nevada, and Wyoming.</p>
          <p>Whether you're buying, selling, or investing — I'm here to make the process smooth and stress-free.</p>
          <p>A few ways I can help you right now:</p>
          <ul>
            <li><a href="https://gsbrealtor.com/search" style="color: #C9A84C;">🔍 Search all Utah MLS listings</a></li>
            <li><a href="https://gsbrealtor.com/valuation" style="color: #C9A84C;">🏠 Get your home's value (free, instant)</a></li>
            <li><a href="https://gsbrealtor.com/investor" style="color: #C9A84C;">📊 Investment calculators</a></li>
          </ul>
          <p>Reply to this email anytime — I respond fast.</p>
          <p style="color: #888;">— Gurpreet Bhatti<br>801-635-8462 | gsbrealtor.com</p>
        </div>`,
    },
    3: {
      subject: `Utah Market Update — What's happening this week`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #111; color: #f5f3ee; padding: 32px; border-radius: 12px;">
          <h2 style="color: #C9A84C;">Hi ${params.firstName},</h2>
          <p>The Utah real estate market is moving fast. Here are a few things worth knowing:</p>
          <ul>
            <li>Salt Lake County median home price: <strong>~$525,000</strong></li>
            <li>Days on market trending down in West Jordan, Herriman, and Lehi</li>
            <li>Commercial NNN opportunities still available in West Jordan corridor</li>
          </ul>
          <p><a href="https://gsbrealtor.com/search" style="color: #C9A84C;">Browse current listings →</a></p>
          <p style="color: #888;">— Gurpreet | 801-635-8462</p>
        </div>`,
    },
    7: {
      subject: `Still looking? I have new matches for you`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #111; color: #f5f3ee; padding: 32px; border-radius: 12px;">
          <h2 style="color: #C9A84C;">Hi ${params.firstName},</h2>
          <p>Just checking in — are you still searching for the right property?</p>
          <p>I work across <strong>50+ Utah cities</strong> and specialize in finding off-market deals and investment properties others miss.</p>
          <p><strong>Want me to set up a personalized search alert?</strong> I'll notify you the moment something matching your criteria hits the MLS.</p>
          <p><a href="https://gsbrealtor.com/contact" style="color: #C9A84C; display: inline-block; padding: 12px 24px; background: #C9A84C; color: #000; border-radius: 6px; text-decoration: none;">Schedule a Free Consultation</a></p>
          <p style="color: #888;">— Gurpreet | 801-635-8462</p>
        </div>`,
    },
    14: {
      subject: `Last check-in from Gurpreet — GSB Realtor`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #111; color: #f5f3ee; padding: 32px; border-radius: 12px;">
          <h2 style="color: #C9A84C;">Hi ${params.firstName},</h2>
          <p>I wanted to reach out one more time. Real estate is one of the biggest decisions you'll make — and I want to make sure you have the right person in your corner.</p>
          <p>As a USMC veteran, I bring the same discipline and commitment to real estate that I brought to service. No pressure, no games — just results.</p>
          <p>Whenever you're ready, I'm here.</p>
          <p><a href="https://gsbrealtor.com/contact" style="color: #C9A84C;">Get in touch →</a></p>
          <p style="color: #888;">— Gurpreet Bhatti, REALTOR®<br>UT #12907042-SA00 | 801-635-8462</p>
        </div>`,
    },
  }

  const seq = sequences[params.day]
  if (!seq) return

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: [params.to],
      subject: seq.subject,
      html: seq.html,
    }),
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
