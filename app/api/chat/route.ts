/**
 * GSB REALTOR — AI LEAD QUALIFICATION AGENT (Phase 4)
 * Agentic pattern: multi-turn state machine with tool calling
 * Supports: Groq (primary) → Gemini → OpenAI → Claude → Smart Fallback
 */

import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY    = process.env.GROQ_API_KEY
const GEMINI_API_KEY  = process.env.GEMINI_API_KEY
const OPENAI_API_KEY  = process.env.OPENAI_API_KEY
const CLAUDE_API_KEY  = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY
const WFRMLS_TOKEN    = process.env.WFRMLS_BEARER_TOKEN || '45d62db98f00d4ba2d3b80507f9c5811'
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID   = process.env.TELEGRAM_CHAT_ID

// ── Agent System Prompt ──────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are Gurpreet Bhatti, a Utah REALTOR® and USMC Veteran at GSB Realtor. You are a LEAD QUALIFICATION AGENT and trusted real estate advisor.

MISSION:
1. Understand what the visitor needs (buy/sell/invest/commercial)
2. Ask 2-3 qualifying questions naturally (budget range, target city, timeline)
3. Once you have budget + city, proactively offer to search live listings for them
4. Ask for their name and phone number to schedule a showing or consultation
5. Be direct, warm, knowledgeable — like a Marine who is also a trusted advisor

CREDENTIALS:
- UT License# 12907042-SA00 | NV License# S.0201351 | WY License# RE-17041
- Dynasty Point Referral Group | Based in West Jordan, Utah
- USMC Veteran | Commercial specialist: NNN leases, tenant placement, strip plazas

CURRENT UTAH MARKET (Q1 2026):
- Mortgage rates: ~6.8% (30-year fixed) — down from 7.5% peak
- Salt Lake County median home price: ~$485,000
- Inventory: Still tight — well-priced homes move in 7-14 days
- Utah County (Provo/Lehi area): ~$440,000 median, strong tech sector demand
- St. George (Washington County): ~$395,000 median, hot retirement/relocation market
- Commercial NNN cap rates: 5.5–7.5% depending on tenant (national credit = lower cap)
- Commercial strip centers: typically 6.5–8% cap rate in Utah
- Strong investor interest in multi-family due to Utah population growth (~2.3%/yr)

QUALIFYING QUESTIONS (ask naturally, not all at once):
- "What's your budget range? Under $400K, $400–600K, or higher?"
- "Which city or area of Utah are you focused on?"
- "How soon are you looking to make a move?"
- "Is this for your primary home, investment, or commercial property?"

LEAD SCORING:
- HOT: Has budget + city + timeline under 90 days + gave phone number
- WARM: Has budget + city but timeline 90+ days
- COLD: Just browsing, no specific criteria

When someone mentions a city AND budget together, say: "I can pull up live MLS listings for you right now — what's your timeline?"

When someone gives you their name and phone, acknowledge it warmly and say Gurpreet will call them within the hour.

KEY PAGES TO REFERENCE:
- Home search: gsbrealtor.com/search
- Sell your home: gsbrealtor.com/sell
- Free home value: gsbrealtor.com/valuation
- Investor tools: gsbrealtor.com/investor
- Spanish page: gsbrealtor.com/es
- Contact: gsbrealtor.com/contact

RULES:
- Keep responses under 120 words unless detail is truly needed
- Be conversational and warm. End with a question to keep the dialogue going.
- Share market knowledge proactively — it builds trust
- NEVER make up listing addresses, prices, or data you don't have
- NEVER give legal or financial advice — say "talk to a licensed professional"
- When showing property results (injected as LISTING_RESULTS), present them naturally and ask if they'd like to schedule a showing`

// ── Types ────────────────────────────────────────────────────────────────────

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface LeadCapture {
  name?: string
  phone?: string
}

interface ListingResult {
  address: string
  price: number
  beds: number
  baths: number
  sqft?: number
  listingKey?: string
}

// ── Tool: Detect Lead Capture ────────────────────────────────────────────────

function detectLeadCapture(messages: Message[]): LeadCapture | null {
  const lastMsg = messages[messages.length - 1]?.content || ''

  // Match 10-digit phone or formatted phone
  const phoneMatch = lastMsg.match(/\b\d{10}\b|\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b/)
  if (!phoneMatch) return null

  // Extract name from context
  const nameMatch = lastMsg.match(
    /(?:i'm|i am|this is|name is|call me|my name is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i
  )

  // Also check previous messages for name context
  let name = nameMatch?.[1]
  if (!name) {
    for (let i = messages.length - 2; i >= 0; i--) {
      const prevContent = messages[i]?.content || ''
      const prevNameMatch = prevContent.match(
        /(?:i'm|i am|this is|name is|call me|my name is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i
      )
      if (prevNameMatch) {
        name = prevNameMatch[1]
        break
      }
    }
  }

  return { phone: phoneMatch[0], name }
}

// ── Tool: Extract Budget/City from Conversation ──────────────────────────────

function extractQualifyingInfo(messages: Message[]): {
  budget?: number
  city?: string
  timeline?: string
  intent?: string
} {
  const fullConversation = messages.map(m => m.content).join(' ').toLowerCase()

  // Budget detection
  let budget: number | undefined
  const budgetPatterns = [
    { pattern: /under\s*\$?(\d{3,4})k/i, multiplier: 1000 },
    { pattern: /\$(\d{3,4})k/i, multiplier: 1000 },
    { pattern: /(\d{3,4}),000/i, multiplier: 1 },
    { pattern: /\$(\d+),(\d{3})/i, multiplier: 1 },
    { pattern: /400[-–]600k/i, multiplier: 0 },
    { pattern: /400k|400,000/i, multiplier: 0 },
    { pattern: /500k|500,000/i, multiplier: 0 },
    { pattern: /600k|600,000/i, multiplier: 0 },
  ]
  for (const { pattern, multiplier } of budgetPatterns) {
    const match = fullConversation.match(pattern)
    if (match && multiplier > 0) {
      budget = parseInt(match[1]) * multiplier
      break
    } else if (match && multiplier === 0) {
      // Rough midpoint for range expressions
      if (/400[-–]600k/.test(fullConversation)) budget = 500000
      else if (/400k/.test(fullConversation)) budget = 400000
      else if (/500k/.test(fullConversation)) budget = 500000
      else if (/600k/.test(fullConversation)) budget = 600000
      break
    }
  }

  // City detection
  const UTAH_CITIES = [
    'salt lake city', 'west jordan', 'sandy', 'south jordan', 'taylorsville',
    'murray', 'provo', 'orem', 'ogden', 'layton', 'st george', 'st. george',
    'logan', 'draper', 'herriman', 'riverton', 'lehi', 'west valley',
    'millcreek', 'cottonwood heights', 'midvale', 'bountiful', 'holladay',
    'bluffdale', 'saratoga springs', 'eagle mountain', 'american fork',
    'highland', 'alpine', 'springville', 'spanish fork',
  ]
  const city = UTAH_CITIES.find(c => fullConversation.includes(c))

  // Timeline detection
  let timeline: string | undefined
  if (/asap|right away|immediately|this month|1 month|30 days/.test(fullConversation)) timeline = '30 days'
  else if (/2[-–]3 months|60 days|couple months/.test(fullConversation)) timeline = '60 days'
  else if (/3[-–]6 months|90 days/.test(fullConversation)) timeline = '90 days'
  else if (/6 months|this year|end of year/.test(fullConversation)) timeline = '6 months'
  else if (/just looking|browsing|not sure|no rush|eventually/.test(fullConversation)) timeline = 'browsing'

  // Intent
  let intent: string | undefined
  if (/invest|cap rate|cash flow|rental property|flip/.test(fullConversation)) intent = 'investment'
  else if (/commercial|nnn|office|retail|strip|tenant/.test(fullConversation)) intent = 'commercial'
  else if (/sell|selling|list my home/.test(fullConversation)) intent = 'sell'
  else if (/buy|purchase|looking for|find a home/.test(fullConversation)) intent = 'buy'

  return { budget, city, timeline, intent }
}

// ── Tool: Score Lead ─────────────────────────────────────────────────────────

function scoreLead(data: {
  phone?: string
  budget?: number
  city?: string
  timeline?: string
}): 'hot' | 'warm' | 'cold' {
  if (
    data.phone &&
    data.budget &&
    data.city &&
    data.timeline &&
    !['browsing', '6 months'].includes(data.timeline)
  ) {
    return 'hot'
  }
  if (data.budget && data.city) {
    return 'warm'
  }
  return 'cold'
}

// ── Tool: Search WFRMLS Listings ─────────────────────────────────────────────

async function searchListings(
  city: string,
  maxPrice?: number,
  bedrooms?: number,
  limit = 3
): Promise<ListingResult[]> {
  try {
    const conditions: string[] = [`StandardStatus eq 'Active'`]
    if (city) conditions.push(`City eq '${city}'`)
    if (maxPrice) conditions.push(`ListPrice le ${maxPrice}`)
    if (bedrooms) conditions.push(`BedroomsTotal ge ${bedrooms}`)

    const filter = conditions.join(' and ')
    const select = 'UnparsedAddress,ListPrice,BedroomsTotal,BathroomsTotalInteger,LivingArea,ListingKey'
    const url = `https://resoapi.utahrealestate.com/reso/odata/Property?$filter=${encodeURIComponent(filter)}&$top=${limit}&$select=${encodeURIComponent(select)}&$orderby=OnMarketDate desc`

    const res = await fetch(url, {
      headers: {
        Authorization: WFRMLS_TOKEN,
        Accept: 'application/json',
      },
      next: { revalidate: 300 },
    })

    if (!res.ok) {
      console.error('WFRMLS search failed:', res.status)
      return []
    }

    const data = await res.json()
    const properties = data.value || []

    return properties.map((p: Record<string, unknown>) => ({
      address: (p.UnparsedAddress as string) || 'Address not available',
      price: (p.ListPrice as number) || 0,
      beds: (p.BedroomsTotal as number) || 0,
      baths: (p.BathroomsTotalInteger as number) || 0,
      sqft: (p.LivingArea as number) || undefined,
      listingKey: (p.ListingKey as string) || undefined,
    }))
  } catch (err) {
    console.error('searchListings error:', err)
    return []
  }
}

// ── Tool: Save Lead to Supabase ───────────────────────────────────────────────

async function saveChatLead(params: {
  name?: string
  phone?: string
  budget?: number
  city?: string
  timeline?: string
  intent?: string
  conversation: Message[]
  score: 'hot' | 'warm' | 'cold'
}, baseUrl: string): Promise<void> {
  try {
    const nameParts = (params.name || 'Chat Lead').split(' ')
    const firstName = nameParts[0] || 'Chat'
    const lastName = nameParts.slice(1).join(' ') || 'Lead'

    const messageContent = [
      params.budget ? `Budget: $${params.budget.toLocaleString()}` : '',
      params.city ? `City: ${params.city}` : '',
      params.timeline ? `Timeline: ${params.timeline}` : '',
      params.intent ? `Intent: ${params.intent}` : '',
      `Score: ${params.score.toUpperCase()}`,
      `--- Conversation ---`,
      params.conversation
        .filter(m => m.role !== 'system')
        .map(m => `${m.role.toUpperCase()}: ${m.content}`)
        .join('\n'),
    ].filter(Boolean).join('\n')

    await fetch(`${baseUrl}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email: `${firstName.toLowerCase()}.chatbot@pending.gsbrealtor.com`,
        phone: params.phone,
        lead_type: 'tour_request' as const,
        message: messageContent,
        source: 'chatbot',
        property_address: params.city ? `${params.city}, UT` : undefined,
      }),
    })
  } catch (err) {
    console.error('saveChatLead error:', err)
  }
}

// ── Tool: Send Telegram Hot Lead Notification ─────────────────────────────────

async function sendTelegramNotification(params: {
  name?: string
  phone?: string
  budget?: number
  city?: string
  timeline?: string
  score: 'hot' | 'warm' | 'cold'
}): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('Telegram not configured, skipping notification')
    return
  }

  const scoreEmoji = params.score === 'hot' ? '🔥' : params.score === 'warm' ? '☀️' : '🌱'
  const message = [
    `${scoreEmoji} *${params.score.toUpperCase()} LEAD — GSB Realtor Chatbot*`,
    ``,
    `👤 Name: ${params.name || 'Not provided'}`,
    `📞 Phone: ${params.phone || 'Not provided'}`,
    `💰 Budget: ${params.budget ? `$${params.budget.toLocaleString()}` : 'Unknown'}`,
    `📍 City: ${params.city || 'Unknown'}`,
    `⏱ Timeline: ${params.timeline || 'Unknown'}`,
    ``,
    `⚡ Respond within 5 minutes!`,
    `Time: ${new Date().toLocaleString('en-US', { timeZone: 'America/Denver' })} MT`,
  ].join('\n')

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    })
  } catch (err) {
    console.error('Telegram notification error:', err)
  }
}

// ── Smart Fallback ────────────────────────────────────────────────────────────

function smartFallback(messages: Message[]): string {
  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || ''

  if (lastMessage.includes('hello') || lastMessage.includes('hi') || lastMessage.includes('hey')) {
    return "Hey! I'm Gurpreet Bhatti, Utah REALTOR® and USMC Veteran. Are you looking to buy, sell, or invest in Utah real estate? What brings you here today?"
  }
  if (lastMessage.includes('buy') || lastMessage.includes('looking for') || lastMessage.includes('home')) {
    return "Great — let's find you the right home. What's your budget range? Under $400K, $400–600K, or higher?"
  }
  if (lastMessage.includes('sell')) {
    return "Happy to help you sell. First — what city is your property in? And are you thinking of listing soon or just exploring your options?"
  }
  return "I'm Gurpreet Bhatti — Utah REALTOR® and USMC Veteran. What are you looking for today? Buying, selling, or investing?"
}

// ── Detect Property Search Intent ────────────────────────────────────────────

function detectPropertySearchIntent(messages: Message[]): {
  hasIntent: boolean
  city?: string
  maxPrice?: number
  bedrooms?: number
} {
  const lastMsg = messages[messages.length - 1]?.content || ''
  const fullConvo = messages.map(m => m.content).join(' ')

  const UTAH_CITIES = [
    'Salt Lake City', 'West Jordan', 'Sandy', 'South Jordan', 'Taylorsville',
    'Murray', 'Provo', 'Orem', 'Ogden', 'Layton', 'St George', 'St. George',
    'Logan', 'Draper', 'Herriman', 'Riverton', 'Lehi', 'West Valley',
    'Millcreek', 'Cottonwood Heights', 'Midvale', 'Bountiful', 'Holladay',
    'Bluffdale', 'Saratoga Springs', 'Eagle Mountain', 'American Fork',
    'Highland', 'Alpine', 'Springville', 'Spanish Fork',
  ]

  // Check for explicit search intent
  const searchTriggers = /show me|find me|search|what.s available|any homes|listings in|properties in|homes in/i
  if (!searchTriggers.test(lastMsg) && !searchTriggers.test(fullConvo.slice(-300))) {
    return { hasIntent: false }
  }

  const combinedText = lastMsg + ' ' + fullConvo.slice(-500)
  const cityFound = UTAH_CITIES.find(c => combinedText.toLowerCase().includes(c.toLowerCase()))

  // Price extraction
  let maxPrice: number | undefined
  const priceMatch = combinedText.match(/under\s*\$?(\d{3,4})k|\$(\d{3,4})k|(\d{3,4}),000/i)
  if (priceMatch) {
    const val = parseInt(priceMatch[1] || priceMatch[2] || priceMatch[3])
    maxPrice = val < 2000 ? val * 1000 : val
  }

  // Bedroom extraction
  let bedrooms: number | undefined
  const bedroomMatch = combinedText.match(/(\d)\s*(?:bed|bedroom|br\b)/i)
  if (bedroomMatch) bedrooms = parseInt(bedroomMatch[1])

  return {
    hasIntent: !!(cityFound || maxPrice),
    city: cityFound,
    maxPrice,
    bedrooms,
  }
}

// ── Format Listings for Chat ──────────────────────────────────────────────────

function formatListingsForChat(
  listings: ListingResult[],
  city?: string,
  maxPrice?: number
): string {
  if (!listings.length) {
    const cityStr = city ? ` in ${city}` : ''
    const priceStr = maxPrice ? ` under $${(maxPrice / 1000).toFixed(0)}K` : ''
    return `I don't see any active listings${cityStr}${priceStr} right now, but the market moves fast. Let me pull up the latest at gsbrealtor.com/search${city ? `?city=${encodeURIComponent(city)}` : ''}${maxPrice ? `&maxPrice=${maxPrice}` : ''} — want me to set up a personalized search alert?`
  }

  const cityStr = city || 'Utah'
  const priceStr = maxPrice ? ` under $${(maxPrice / 1000).toFixed(0)}K` : ''

  const listingLines = listings.map((l, i) => {
    const price = `$${l.price.toLocaleString()}`
    const details = [l.beds && `${l.beds}bd`, l.baths && `${l.baths}ba`, l.sqft && `${l.sqft.toLocaleString()} sqft`].filter(Boolean).join('/')
    return `${i + 1}. ${l.address} — ${price}${details ? `, ${details}` : ''}`
  }).join('\n')

  const searchUrl = `gsbrealtor.com/search${city ? `?city=${encodeURIComponent(city)}` : ''}${maxPrice ? `${city ? '&' : '?'}maxPrice=${maxPrice}` : ''}`

  return `LISTING_RESULTS:\nHere are ${listings.length} active listings in ${cityStr}${priceStr}:\n\n${listingLines}\n\nSee all listings: ${searchUrl}`
}

// ── Main POST Handler ─────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array required' }, { status: 400 })
    }

    const typedMessages = messages as Message[]

    // ── Step 1: Detect lead capture (phone number given) ──
    const leadCapture = detectLeadCapture(typedMessages)
    const qualifyingInfo = extractQualifyingInfo(typedMessages)

    if (leadCapture?.phone) {
      const score = scoreLead({
        phone: leadCapture.phone,
        budget: qualifyingInfo.budget,
        city: qualifyingInfo.city,
        timeline: qualifyingInfo.timeline,
      })

      // Fire-and-forget: save lead + notify
      const baseUrl = request.nextUrl.origin
      saveChatLead({
        name: leadCapture.name,
        phone: leadCapture.phone,
        budget: qualifyingInfo.budget,
        city: qualifyingInfo.city,
        timeline: qualifyingInfo.timeline,
        intent: qualifyingInfo.intent,
        conversation: typedMessages,
        score,
      }, baseUrl).catch(e => console.error('Lead save error:', e))

      // Always notify on phone capture; hot leads get priority
      sendTelegramNotification({
        name: leadCapture.name,
        phone: leadCapture.phone,
        budget: qualifyingInfo.budget,
        city: qualifyingInfo.city,
        timeline: qualifyingInfo.timeline,
        score,
      }).catch(e => console.error('Telegram error:', e))
    }

    // ── Step 2: Check for property search intent ──
    let listingContext = ''
    const searchIntent = detectPropertySearchIntent(typedMessages)
    if (searchIntent.hasIntent && searchIntent.city) {
      const listings = await searchListings(
        searchIntent.city,
        searchIntent.maxPrice,
        searchIntent.bedrooms,
        3
      )
      if (listings.length > 0) {
        listingContext = formatListingsForChat(listings, searchIntent.city, searchIntent.maxPrice)
      }
    }

    // ── Step 3: Build message array for LLM ──
    const llmMessages = [
      ...typedMessages.map((m: Message) => ({ role: m.role, content: m.content })),
    ]

    // Inject listing results as a system message if we have them
    if (listingContext) {
      llmMessages.push({
        role: 'system' as const,
        content: `Use the following live MLS data in your next response. Present it naturally and ask if they'd like to schedule a showing:\n\n${listingContext}`,
      })
    }

    // ── Step 4: Call LLM ──

    // GROQ (preferred — free, fastest)
    if (GROQ_API_KEY) {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 350,
          temperature: 0.7,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...llmMessages.filter(m => m.role !== 'system' || llmMessages.indexOf(m) === llmMessages.length - 1),
          ],
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const reply = data.choices?.[0]?.message?.content || smartFallback(typedMessages)
        return NextResponse.json({
          reply,
          leadCaptured: !!leadCapture?.phone,
          leadScore: leadCapture?.phone ? scoreLead({
            phone: leadCapture.phone,
            budget: qualifyingInfo.budget,
            city: qualifyingInfo.city,
            timeline: qualifyingInfo.timeline,
          }) : undefined,
        })
      }
    }

    // GEMINI (fallback)
    if (GEMINI_API_KEY) {
      const geminiMessages = typedMessages.map((m: Message) => ({
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
            generationConfig: { maxOutputTokens: 250, temperature: 0.7 },
          }),
        }
      )

      if (response.ok) {
        const data = await response.json()
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || smartFallback(typedMessages)
        return NextResponse.json({ reply, leadCaptured: !!leadCapture?.phone })
      }
    }

    // OPENAI (fallback)
    if (OPENAI_API_KEY) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          max_tokens: 250,
          temperature: 0.7,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...llmMessages,
          ],
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const reply = data.choices?.[0]?.message?.content || smartFallback(typedMessages)
        return NextResponse.json({ reply, leadCaptured: !!leadCapture?.phone })
      }
    }

    // CLAUDE (fallback)
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
          max_tokens: 250,
          system: SYSTEM_PROMPT,
          messages: typedMessages
            .filter((m: Message) => m.role !== 'system')
            .map((m: Message) => ({ role: m.role, content: m.content })),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const reply = data.content?.[0]?.text || smartFallback(typedMessages)
        return NextResponse.json({ reply, leadCaptured: !!leadCapture?.phone })
      }
    }

    // Smart fallback (no API key needed)
    return NextResponse.json({
      reply: smartFallback(typedMessages),
      leadCaptured: !!leadCapture?.phone,
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({
      reply: "Sorry, had a connection issue. Call me directly — 801-635-8462 and I'll help you right away.",
    })
  }
}
