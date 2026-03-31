/**
 * GSB Realtor — Telegram Daily Agent Report
 * Sends morning summary to @GSB_REALTOR_BOT at 5:30 AM MT
 * Called by n8n cron or Vercel cron
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHAT_ID   = process.env.TELEGRAM_CHAT_ID
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function sendTelegram(message: string) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'HTML',
    }),
  })
}

export async function GET(request: NextRequest) {
  // Security check — only allow internal cron calls
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.DRIP_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

    // Get yesterday's date range (MT timezone)
    const now = new Date()
    const yesterdayStart = new Date(now)
    yesterdayStart.setDate(yesterdayStart.getDate() - 1)
    yesterdayStart.setHours(0, 0, 0, 0)
    const yesterdayEnd = new Date(now)
    yesterdayEnd.setHours(0, 0, 0, 0)

    // Fetch yesterday's leads
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .gte('created_at', yesterdayStart.toISOString())
      .lt('created_at', yesterdayEnd.toISOString())
      .order('created_at', { ascending: false })

    if (error) throw error

    const total = leads?.length || 0
    const bySource: Record<string, number> = {}
    const hotLeads: string[] = []

    leads?.forEach(lead => {
      const src = lead.source || 'website'
      bySource[src] = (bySource[src] || 0) + 1
      if (lead.message && lead.message.length > 10) {
        hotLeads.push(`• ${lead.first_name || 'Unknown'} (${lead.phone || lead.email || 'no contact'}) — ${lead.source || 'website'}`)
      }
    })

    // Format yesterday's date
    const dateStr = yesterdayStart.toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric'
    })

    // Build the report message
    let message = `🏠 <b>GSB Realtor — Daily Report</b>\n`
    message += `📅 <b>${dateStr}</b>\n`
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`

    message += `📊 <b>LEADS SUMMARY</b>\n`
    message += `Total new leads: <b>${total}</b>\n`

    if (Object.keys(bySource).length > 0) {
      message += `\nBy source:\n`
      Object.entries(bySource).forEach(([src, count]) => {
        message += `  • ${src}: ${count}\n`
      })
    }

    if (hotLeads.length > 0) {
      message += `\n🔥 <b>LEADS WITH MESSAGES</b>\n`
      hotLeads.slice(0, 5).forEach(l => { message += `${l}\n` })
    }

    if (total === 0) {
      message += `\n<i>No leads captured yesterday. Keep marketing! 💪</i>\n`
    }

    message += `\n━━━━━━━━━━━━━━━━━━━━\n`
    message += `📞 <b>QUICK ACTIONS</b>\n`
    message += `• View all leads: gsbrealtor.com/admin\n`
    message += `• Call leads now: 801-635-8462\n`
    message += `\n<i>GSB Realtor — Built to Win. USMC Veteran. 🇺🇸</i>`

    await sendTelegram(message)

    return NextResponse.json({ 
      success: true, 
      leads_yesterday: total,
      message: 'Report sent to Telegram'
    })

  } catch (error: any) {
    console.error('Telegram report error:', error)
    
    // Send error notification to Telegram
    await sendTelegram(`⚠️ <b>GSB Realtor Daily Report Error</b>\n\nCould not generate full report: ${error.message}\n\nCheck gsbrealtor.com/admin manually.`)
    
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
