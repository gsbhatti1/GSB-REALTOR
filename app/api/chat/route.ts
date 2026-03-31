/**
 * GSB REALTOR — AI CHATBOT API
 * Supports: Google Gemini (free) → OpenAI → Claude → Smart Fallback
 */

import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY    = process.env.GROQ_API_KEY
const GEMINI_API_KEY  = process.env.GEMINI_API_KEY
const OPENAI_API_KEY  = process.env.OPENAI_API_KEY
const CLAUDE_API_KEY  = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY

const SYSTEM_PROMPT = `You are Gurpreet Bhatti, a REALTOR® and USMC Veteran at GSB Realtor (gsbrealtor.com) in Utah.

PERSONALITY:
- Direct, honest, no-nonsense — like a Marine
- Knowledgeable about ALL Utah real estate: residential, commercial, investment
- Warm but efficient. You respect people's time.
- Never pressure or mislead. Mission first.

CREDENTIALS:
- UT License# 12907042-SA00 | NV License# S.0201351 | WY License# RE-17041
- Dynasty Point Referral Group | Based in West Jordan, Utah
- USMC Veteran | Commercial specialist: NNN leases, tenant placement, strip plazas

WHEN USERS ASK ABOUT SPECIFIC CITIES:
- ALWAYS link them: "Search [City] homes at gsbrealtor.com/search?city=[City]"
- Cities you serve: Salt Lake City, West Jordan, Sandy, South Jordan, Taylorsville, Murray, Draper, Herriman, Riverton, Provo, Orem, Ogden, Layton, St. George, Logan, Lehi, and all of Utah

KEY PAGES TO REFERENCE:
- Home search: gsbrealtor.com/search
- Sell your home: gsbrealtor.com/sell
- Free home value: gsbrealtor.com/valuation
- Investor tools: gsbrealtor.com/investor
- Contact: gsbrealtor.com/contact
- YouTube channel: youtube.com/@GSBRealtorUtah

RULES:
- Keep answers under 80 words unless detail is truly needed
- Always end by offering direct contact: 801-635-8462
- NEVER make up listing addresses, prices, or data you don't have
- NEVER give legal or financial advice — say "talk to a professional"
- For scheduling showings: ask for their name + phone, say Gurpreet will confirm within the hour`

const UTAH_CITIES = [
  'salt lake city','west jordan','sandy','south jordan','taylorsville','murray',
  'provo','orem','ogden','layton','st george','logan','draper','herriman',
  'riverton','lehi','west valley','millcreek','cottonwood heights','midvale',
  'bountiful','holladay','bluffdale','saratoga springs','eagle mountain',
  'american fork','highland','alpine','springville','spanish fork',
]

function detectCity(text: string): string | null {
  const lower = text.toLowerCase()
  return UTAH_CITIES.find(city => lower.includes(city)) || null
}

function smartFallback(messages: Array<{ role: string; content: string }>): string {
  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || ''
  const city = detectCity(lastMessage)

  // City-specific response
  if (city) {
    const cityFormatted = city.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    const citySlug = city.replace(/ /g, '+')
    return `${cityFormatted} is a great market right now. Browse all active ${cityFormatted} listings at gsbrealtor.com/search?city=${citySlug} — I update straight from Utah MLS. See something you like? Call or text me at 801-635-8462 and I'll get you in same day.`
  }

  if (lastMessage.includes('price') || lastMessage.includes('worth') || lastMessage.includes('value') || lastMessage.includes('valuation')) {
    return "Home values in Utah vary a lot by city and condition. Get a free, no-obligation valuation at gsbrealtor.com/valuation — I'll give you an honest number, not an inflated one designed to win your listing. Usually respond within the hour."
  }
  if (lastMessage.includes('buy') || lastMessage.includes('purchase') || lastMessage.includes('looking for')) {
    return "Let's find your home. Search 17,000+ live Utah listings at gsbrealtor.com/search. When you find something you want to see, text me at 801-635-8462 — I do same-day showings on most properties."
  }
  if (lastMessage.includes('sell') || lastMessage.includes('list my') || lastMessage.includes('selling') || lastMessage.includes('seller')) {
    return "Selling? Start with a free valuation at gsbrealtor.com/valuation — takes 60 seconds and I'll give you a real number, not an inflated one. Or visit gsbrealtor.com/sell to see exactly how I work with sellers. I'll respond personally within the hour."
  }
  if (lastMessage.includes('rent') || lastMessage.includes('lease') || lastMessage.includes('tenant') || lastMessage.includes('landlord')) {
    return "I specialize in commercial leasing and tenant placement across Utah. NNN leases, retail, office, and strip mall tenant placement are my wheelhouse. Call me directly at 801-635-8462 — commercial deals move fast and phone is always better than email."
  }
  if (lastMessage.includes('market') || lastMessage.includes('price') || lastMessage.includes('trend') || lastMessage.includes('average')) {
    return "Utah market is competitive right now — Salt Lake County median home prices are holding strong with limited inventory. Best data is always at gsbrealtor.com/search where you can filter by city and see live MLS data. For a deeper market analysis on a specific area, call me at 801-635-8462."
  }
  if (lastMessage.includes('invest') || lastMessage.includes('cap rate') || lastMessage.includes('cash flow') || lastMessage.includes('rental')) {
    return "Investment is my specialty. Run free cap rate, cash flow, and NNN analysis at gsbrealtor.com/investor. Then call me — 801-635-8462 — and I'll show you what's actually worth buying in this market."
  }
  if (lastMessage.includes('commercial') || lastMessage.includes('nnn') || lastMessage.includes('tenant') || lastMessage.includes('office') || lastMessage.includes('retail')) {
    return "Commercial is where I specialize — NNN leases, tenant placement, strip plazas, and acquisitions. Most Utah agents avoid it. I run toward it. Call 801-635-8462 and let's talk."
  }
  if (lastMessage.includes('tour') || lastMessage.includes('showing') || lastMessage.includes('see the home') || lastMessage.includes('visit')) {
    return "I can schedule showings same-day on most properties. Text me the address at 801-635-8462 and I'll confirm a time within the hour. Or visit gsbrealtor.com/contact and I'll reach out."
  }
  if (lastMessage.includes('hello') || lastMessage.includes('hi') || lastMessage.includes('hey') || lastMessage.includes('help')) {
    return "Hey — I'm Gurpreet Bhatti, Utah REALTOR® and USMC Veteran. What can I help you with? Buying, selling, investing, or just curious about the Utah market?"
  }

  return "I'm Gurpreet Bhatti — Utah REALTOR® and USMC Veteran. Call or text me directly at 801-635-8462 for the fastest response. Or visit gsbrealtor.com/contact and I'll get back to you within the hour."
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array required' }, { status: 400 })
    }

    // ── GROQ (preferred — free, fastest) ──
    if (GROQ_API_KEY) {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          max_tokens: 200,
          temperature: 0.7,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.map((m: { role: string; content: string }) => ({
              role: m.role,
              content: m.content,
            })),
          ],
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const reply = data.choices?.[0]?.message?.content || smartFallback(messages)
        return NextResponse.json({ reply })
      }
    }

    // ── GEMINI (fallback) ──
    if (GEMINI_API_KEY) {
      const geminiMessages = messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }))

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: geminiMessages,
            generationConfig: { maxOutputTokens: 200, temperature: 0.7 },
          }),
        }
      )

      if (response.ok) {
        const data = await response.json()
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || smartFallback(messages)
        return NextResponse.json({ reply })
      }
    }

    // ── OPENAI (fallback) ──
    if (OPENAI_API_KEY) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          max_tokens: 200,
          temperature: 0.7,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.map((m: { role: string; content: string }) => ({
              role: m.role,
              content: m.content,
            })),
          ],
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const reply = data.choices?.[0]?.message?.content || smartFallback(messages)
        return NextResponse.json({ reply })
      }
    }

    // ── CLAUDE (fallback if OpenAI not set) ──
    if (CLAUDE_API_KEY) {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 200,
          system: SYSTEM_PROMPT,
          messages: messages.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const reply = data.content?.[0]?.text || smartFallback(messages)
        return NextResponse.json({ reply })
      }
    }

    // ── SMART FALLBACK (no API key needed) ──
    return NextResponse.json({ reply: smartFallback(messages) })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({
      reply: "Sorry, had a connection issue. Call me directly — 801-635-8462 and I'll help you right away.",
    })
  }
}
