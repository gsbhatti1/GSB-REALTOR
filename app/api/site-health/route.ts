import { NextResponse } from 'next/server'

const CHECKS = [
  { name: 'Homepage',       url: 'https://www.gsbrealtor.com/',              expected: 200 },
  { name: 'Search Page',    url: 'https://www.gsbrealtor.com/search',        expected: 200 },
  { name: 'MLS Listings',   url: 'https://resoapi.utahrealestate.com/reso/odata/Property?$top=1', auth: 'WFRMLS' },
  { name: 'Blog',           url: 'https://www.gsbrealtor.com/blog',          expected: 200 },
  { name: 'Commercial Page',url: 'https://www.gsbrealtor.com/commercial',    expected: 200 },
  { name: 'Sell Page',      url: 'https://www.gsbrealtor.com/sell',          expected: 200 },
  { name: 'Market Reports', url: 'https://www.gsbrealtor.com/market-reports',expected: 200 },
  { name: 'Investor Tools', url: 'https://www.gsbrealtor.com/investor',      expected: 200 },
  { name: 'Spanish Page',   url: 'https://www.gsbrealtor.com/es',            expected: 200 },
  { name: 'Chat API',       url: 'https://www.gsbrealtor.com/api/chat',      expected: 405 }, // POST only
  { name: 'Social API',     url: 'https://www.gsbrealtor.com/api/social-post',expected: 200 },
]

interface CheckResult {
  name: string
  status: number
  ok: boolean
  ms: number
  url: string
  error?: string
}

export async function GET(_request: Request) {
  const results = await Promise.allSettled(
    CHECKS.map(async (check): Promise<CheckResult> => {
      const headers: Record<string, string> = {}
      if (check.auth === 'WFRMLS') {
        headers['Authorization'] = `Bearer ${process.env.WFRMLS_BEARER_TOKEN}`
      }

      const start = Date.now()
      try {
        const res = await fetch(check.url, {
          headers,
          signal: AbortSignal.timeout(10000),
        })
        const ms = Date.now() - start
        const expectedStatus = check.expected ?? 200
        const ok = res.status === expectedStatus
        return { name: check.name, status: res.status, ok, ms, url: check.url }
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err)
        return {
          name: check.name,
          status: 0,
          ok: false,
          ms: Date.now() - start,
          error: errMsg,
          url: check.url,
        }
      }
    })
  )

  const checks: CheckResult[] = results.map(r =>
    r.status === 'fulfilled'
      ? r.value
      : { name: '?', ok: false, status: 0, ms: 0, url: '' }
  )
  const allOk  = checks.every(c => c.ok)
  const failed = checks.filter(c => !c.ok)

  // Send Telegram report
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
  const CHAT_ID   = process.env.TELEGRAM_CHAT_ID

  if (BOT_TOKEN && CHAT_ID) {
    const emoji = allOk ? '✅' : '🚨'
    const title = allOk
      ? 'GSB Realtor — All Systems Go'
      : `GSB Realtor — ${failed.length} Issue(s) Detected`

    let msg = `${emoji} <b>${title}</b>\n`
    msg += `📅 ${new Date().toLocaleString('en-US', {
      timeZone: 'America/Denver',
      dateStyle: 'short',
      timeStyle: 'short',
    })} MT\n\n`

    if (failed.length > 0) {
      msg += `<b>🔴 ISSUES:</b>\n`
      failed.forEach(f => {
        msg += `• ${f.name}: HTTP ${f.status}${f.error ? ' (' + f.error.substring(0, 50) + ')' : ''}\n`
      })
      msg += '\n'
    }

    msg += `<b>Status:</b>\n`
    checks.forEach(c => {
      msg += `${c.ok ? '✅' : '❌'} ${c.name} (${c.ms}ms)\n`
    })

    msg += `\n<i>Next check: tomorrow 6:00 AM MT</i>`

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: msg, parse_mode: 'HTML' }),
    })
  }

  return NextResponse.json({
    ok: allOk,
    checks,
    failed,
    timestamp: new Date().toISOString(),
  })
}
