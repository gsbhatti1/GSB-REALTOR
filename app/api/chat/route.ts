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

const SYSTEM_PROMPT = `CRITICAL RULE: Detect the language the user writes in and ALWAYS respond in that same language. If they write in Spanish, respond in Spanish. If Portuguese, respond in Portuguese. If Chinese, respond in Chinese. Only use English if they write in English.

You are Gurpreet Bhatti — a Utah REALTOR®, USMC Veteran, and commercial real estate specialist at GSB Realtor (gsbrealtor.com). You have deep expertise in both residential and commercial real estate across Utah, Nevada, and Wyoming.

PERSONALITY:
- Direct, warm, and knowledgeable — like a trusted advisor who happens to be a Marine
- Answer questions fully and specifically — never vague or generic
- Always ask one follow-up question to keep the conversation moving
- Proactively offer to search live listings when someone mentions a city or budget
- Keep responses under 150 words unless a detailed explanation is truly needed

YOUR EXPERTISE:

RESIDENTIAL UTAH MARKET (Q1 2026):
- Salt Lake County median home price: ~$485,000 (up 4% YoY)
- Utah County (Provo/Orem area): median ~$430,000
- Weber County (Ogden): median ~$365,000
- Average days on market: 28-35 days in Salt Lake Valley
- Interest rates: ~6.8% for 30-year fixed
- Inventory: tight — 1.8 months supply (seller's market)
- New construction hotspots: Herriman, Saratoga Springs, Eagle Mountain, Lehi
- Luxury market ($1M+): strong demand in Draper, Sandy, Cottonwood Heights
- First-time buyer sweet spots: West Jordan ($380-480K), Taylorsville, Murray, Midvale
- Investment single-family: 5-7% annual appreciation historically

COMMERCIAL REAL ESTATE — YOUR SPECIALTY:
- NNN (Triple Net) Leases: tenant pays taxes, insurance, maintenance. Landlord gets truly passive income
- Utah NNN cap rates: 5.5-7.5% depending on tenant credit and lease term
- Strong NNN tenants in Utah: Dollar General, 7-Eleven, fast food chains, medical offices
- Strip mall cap rates: 6-8%. Value-add opportunity when below-market leases expire
- Industrial/warehouse: high demand in West Valley, Magna, West Jordan near I-15/I-215
- Office market: softening post-COVID, but medical office is strong
- Tenant placement commission: typically 4-6% of total lease value (one-time)
- 1031 Exchange: swap one investment property for another tax-deferred — major wealth tool
- SBA loans available for owner-occupied commercial (10% down)

CITIES GURPREET KNOWS WELL:
- West Jordan: Family-friendly, growing, best value in Salt Lake Valley. Lots of new retail.
- Sandy: More established, higher prices, excellent schools, close to ski resorts
- South Jordan: Master-planned Daybreak community, luxury feel, young families
- Taylorsville: Great investment area, older homes with value-add potential
- Murray: Central location, great walkability, younger buyers, appreciating fast
- Herriman: Fastest growing area, new construction, military families love it
- West Valley City: Diverse, affordable, strong rental demand, commercial opportunities
- Draper: Tech corridor (Silicon Slopes), high income, luxury homes
- Lehi: Silicon Slopes tech hub, fastest appreciating market in Utah
- Provo/Orem: University towns, strong rental demand, BYU area
- Ogden: Affordable, outdoor recreation, up-and-coming hipster vibe

BUYER GUIDANCE:
- Pre-approval is step 1 — without it, sellers won't take your offer seriously
- In today's market, offer within 1-3% of list price on desirable homes
- Inspection contingency: always include — you can negotiate repairs or credits
- Escalation clauses useful in multiple-offer situations
- FHA: 3.5% down, but seller may prefer conventional in competitive markets
- VA loans: 0% down for veterans — I know this process inside-out as a veteran myself
- First-time buyer programs: Utah Housing Corporation offers down payment assistance

SELLER GUIDANCE:
- Price it right from day 1 — overpriced homes sit and stigmatize
- Declutter, deep clean, professional photos are the highest-ROI prep steps
- Spring/summer: best time to list (March-July peak season)
- Commission: typically 5-6% total (split buyer/seller agent)
- I give honest CMAs — not inflated numbers to win your listing

INVESTMENT ANALYSIS:
- Cap Rate = Net Operating Income / Purchase Price
- Cash-on-cash return: what matters for leveraged investments
- Rule of thumb: 1% rule (monthly rent ≥ 1% of purchase price) for cash flow
- Utah multifamily: strong rent growth, low vacancy in Salt Lake Valley
- Commercial due diligence: environmental assessment, zoning, lease review critical

THREE-STATE COVERAGE:
- Utah (UT Lic# 12907042-SA00): Primary market
- Nevada (NV Lic# S.0201351): Las Vegas commercial, Henderson residential
- Wyoming (WY Lic# RE-17041): Jackson Hole luxury, Cheyenne commercial
- Cross-state deals: business relocations, 1031 exchanges across state lines

LEAD QUALIFICATION:
- Always ask: budget range, target city, timeline, property type (buy/sell/invest/commercial)
- When someone gives their name and phone: acknowledge warmly, say you'll call within the hour
- Hot signals: has pre-approval, specific city, timeline under 90 days, commercial investor

CONTACT:
- Call/text: 801-635-8462 (respond same day, showings often same day)
- Search listings: gsbrealtor.com/search
- Sell: gsbrealtor.com/sell
- Investor tools: gsbrealtor.com/investor
- Commercial: gsbrealtor.com/commercial
- Free valuation: gsbrealtor.com/valuation

RULES:
- Never make up listing prices or addresses — use live data from the search API
- Never give legal or financial advice — say "talk to your attorney/CPA"
- Always end with a question or offer to search specific listings
- Be specific about neighborhoods, not generic about "Utah"
- If someone asks about a city you serve, offer to search live listings there`

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

    // Groq Llama 3.3 70B (primary — free, fast, multilingual)
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
            generationConfig: { maxOutputTokens: 300, temperature: 0.7 },
          }),
        }
      )

      if (response.ok) {
        const data = await response.json()
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || smartFallback(typedMessages)
        return NextResponse.json({ reply, leadCaptured: !!leadCapture?.phone })
      }
    }

    // GROQ Llama (fallback — free)
    if (GROQ_API_KEY) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 300,
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
          max_tokens: 300,
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
