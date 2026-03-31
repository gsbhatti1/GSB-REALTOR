/**
 * GSB REALTOR — DAILY CONTENT GENERATOR
 * GET  /api/daily-content  → Generate a full day's worth of content (3 posts)
 * POST /api/daily-content  → Generate and auto-schedule today's posts
 *
 * Called by the cron job to produce morning (7am), noon (12pm), evening (6pm) MT content
 */

import { NextRequest, NextResponse } from 'next/server'

const GROQ_KEY = process.env.GROQ_API_KEY
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gsbrealtor.com'

// ── Content rotation strategy ─────────────────────────────────────────────────
// Rotate through content types to keep feed fresh
const CONTENT_ROTATION = [
  'listing',
  'tip',
  'market_update',
  'sold',
  'tip',
  'neighborhood',
  'listing',
  'commercial',
  'tip',
  'market_update',
  'listing',
  'sold',
  'tip',
  'neighborhood',
  'commercial',
]

// Day-of-week content preferences (0=Sun, 1=Mon, ... 6=Sat)
const DAY_PREFERENCES: Record<number, string[]> = {
  0: ['tip', 'neighborhood', 'tip'],           // Sunday: lifestyle
  1: ['listing', 'market_update', 'tip'],      // Monday: new week energy
  2: ['listing', 'tip', 'commercial'],         // Tuesday: listings + commercial
  3: ['market_update', 'listing', 'tip'],      // Wednesday: mid-week market intel
  4: ['listing', 'sold', 'tip'],              // Thursday: listings + success
  5: ['listing', 'neighborhood', 'sold'],      // Friday: FOMO listings
  6: ['tip', 'listing', 'market_update'],      // Saturday: educational
}

// ── Topic pools for variety ───────────────────────────────────────────────────
const TIP_TOPICS = [
  { topic: 'Why pre-approval matters before home shopping in Utah', point: 'Get pre-approved BEFORE you fall in love with a home', audience: 'First-time buyers' },
  { topic: 'How to negotiate in a competitive Utah market', point: 'Escalation clauses and clean offers win more deals', audience: 'Active buyers' },
  { topic: 'Utah first-time homebuyer programs and down payment assistance', point: 'Utah Housing Corp offers loans as low as 3.5% down', audience: 'First-time buyers' },
  { topic: 'When is the best time to sell in Utah?', point: 'Spring and early summer yield highest prices and fastest sales', audience: 'Homeowners' },
  { topic: 'Understanding NNN leases for commercial investors', point: 'NNN means tenant pays taxes, insurance, and maintenance — true passive income', audience: 'Investors' },
  { topic: 'Utah property tax basics every homeowner should know', point: 'Primary residence exemptions can save thousands annually', audience: 'Homeowners' },
  { topic: 'How cap rates work in commercial real estate', point: 'A 5.5% cap rate in Utah beats the national average for similar risk', audience: 'Investors' },
  { topic: 'Home inspection red flags in Utah homes', point: 'HVAC age, roof condition, and foundation cracks are deal-breakers', audience: 'Buyers' },
]

const NEIGHBORHOOD_SPOTLIGHTS = [
  { name: 'West Jordan, Utah', highlights: 'Great schools, parks, family-friendly, easy I-15 access', price: 'Mid $400s', why: 'Best value in Salt Lake County right now', secret: 'Fastest-growing suburb with below-average crime rates' },
  { name: 'South Jordan, Utah', highlights: 'Top-rated schools, Daybreak community, tech corridor nearby', price: 'High $400s–$500s', why: 'Silicon Slopes proximity drives strong appreciation', secret: 'Daybreak lake community is one of Utah\'s best master-planned neighborhoods' },
  { name: 'Herriman, Utah', highlights: 'New construction, great schools, mountain views, growing retail', price: 'Mid $400s–$500s', why: 'Rapidly developing with still-affordable pricing', secret: 'Future TRAX expansion will increase values significantly' },
  { name: 'Draper, Utah', highlights: 'Top schools, mountain access, corporate campuses, luxury options', price: '$500s–$700s', why: 'Premier south valley address with all amenities', secret: 'Corner Canyon area offers best mountain access at still-reasonable prices' },
  { name: 'Lehi, Utah', highlights: 'Silicon Slopes HQ, massive growth, young families, new builds', price: '$400s–$600s', why: 'Tech job center drives strong long-term demand', secret: 'Thanksgiving Point area remains undervalued vs. what\'s coming' },
  { name: 'Riverton, Utah', highlights: 'Quiet, established, great parks, Jordan School District', price: 'Low-mid $400s', why: 'Mature neighborhood with stable values and great quality of life', secret: 'One of Salt Lake County\'s most underrated cities for families' },
]

const MARKET_TOPICS = [
  { area: 'Salt Lake County, Utah', stat1: 'Median home prices up 3-5% year-over-year', stat2: 'Active inventory below 3-month supply', insight: 'Buyers need pre-approval and speed — multiple offers on well-priced homes', trend: 'Competitive with steady appreciation' },
  { area: 'Utah County', stat1: 'Silicon Slopes tech sector driving sustained demand', stat2: 'New construction backlog keeping prices elevated', insight: 'Long-term appreciation driven by job growth — strong buy-and-hold market', trend: 'Strong fundamentals with growth trajectory' },
  { area: 'West Jordan, Utah', stat1: 'Below-median prices outperforming comparable zip codes', stat2: 'Days on market under 30 for well-priced homes', insight: 'Best value play in Salt Lake County right now', trend: 'Undervalued with rising demand' },
]

// ── Generate a single post via the social-post API ───────────────────────────
async function generatePost(type: string, data: object): Promise<object | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/social-post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data }),
    })

    if (response.ok) {
      return response.json()
    }
    return null
  } catch {
    return null
  }
}

// ── Generate content for a specific post slot ─────────────────────────────────
async function generateSlotContent(type: string, slotLabel: string): Promise<DailyPost> {
  let postData: object = {}
  let specificType = type

  // Enrich data based on type
  if (type === 'tip') {
    const tipIdx = Math.floor(Date.now() / (24 * 60 * 60 * 1000)) % TIP_TOPICS.length
    postData = TIP_TOPICS[tipIdx]
  } else if (type === 'neighborhood') {
    const neighIdx = Math.floor(Date.now() / (48 * 60 * 60 * 1000)) % NEIGHBORHOOD_SPOTLIGHTS.length
    postData = NEIGHBORHOOD_SPOTLIGHTS[neighIdx]
  } else if (type === 'market_update') {
    const marketIdx = Math.floor(Date.now() / (72 * 60 * 60 * 1000)) % MARKET_TOPICS.length
    postData = MARKET_TOPICS[marketIdx]
  } else if (type === 'listing') {
    // Generic listing prompt — in production, pull from MLS
    postData = {
      city: 'Utah',
      features: 'Updated throughout, open floor plan, great neighborhood',
    }
    specificType = 'tip' // Fall back to tip if no real listing data
  }

  // Use Groq directly if available for more control
  if (GROQ_KEY && (type === 'tip' || type === 'market_update' || type === 'neighborhood')) {
    const content = await generatePost(specificType, postData)
    if (content) {
      return {
        slot: slotLabel,
        type: specificType,
        data: postData,
        content: content as SocialContent,
        generated_at: new Date().toISOString(),
      }
    }
  }

  // Final fallback
  const fallbackContent = getFallbackContent(type, postData)
  return {
    slot: slotLabel,
    type,
    data: postData,
    content: fallbackContent,
    generated_at: new Date().toISOString(),
  }
}

// ── Inline fallback content generator ────────────────────────────────────────
function getFallbackContent(type: string, data: Record<string, unknown>): SocialContent {
  const now = new Date()
  const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'America/Denver' })
  const month = now.toLocaleDateString('en-US', { month: 'long', timeZone: 'America/Denver' })

  if (type === 'market_update') {
    const d = data as { area?: string; stat1?: string; stat2?: string; insight?: string }
    return {
      facebook: `📊 ${month} Utah Market Update: ${d.stat1 || 'Prices holding strong, inventory tight'}. ${d.insight || 'If you\'re thinking of buying or selling, now is the time to get strategic'}. Call Gurpreet: 801-635-8462 | gsbrealtor.com`,
      instagram: `📊 UTAH REAL ESTATE MARKET — ${month.toUpperCase()}\n\n📈 ${d.stat1 || 'Home prices holding strong'}\n🏘️ ${d.stat2 || 'Inventory below average'}\n\n💡 What this means: ${d.insight || 'Prepared buyers win. Hesitant sellers leave money on the table.'}\n\n📞 Questions? Text Gurpreet: 801-635-8462\n🌐 gsbrealtor.com\n\n#MarketUpdate #UtahRealEstate #GSBRealtor #UtahHousingMarket #SaltLakeCity`,
      twitter: `📊 Utah real estate ${month}: ${d.stat1 || 'prices holding, inventory tight'}. ${d.insight || 'Be prepared or miss the opportunity'}. Full details: gsbrealtor.com | 801-635-8462`,
      tiktok_script: `Here's your Utah real estate market update for ${month}. ${d.stat1 || 'Prices are holding strong'}. ${d.stat2 || 'Inventory is tight'}. What does this mean for you? ${d.insight || 'If you\'re buying — get pre-approved and be ready to move fast. If you\'re selling — now is still a great time'}. Questions? Text me at 801-635-8462. I'm Gurpreet Bhatti with GSB Realtor.`,
      linkedin: `Utah Real Estate Market Update — ${month}\n\nFor buyers, sellers, and investors monitoring the market:\n\n${d.area || 'Salt Lake County'} snapshot:\n• ${d.stat1 || 'Median prices holding with year-over-year gains'}\n• ${d.stat2 || 'Active inventory remains below historical averages'}\n\nMarket insight: ${d.insight || 'The fundamentals supporting Utah real estate — population growth, tech sector expansion, quality of life — remain intact. Strategic positioning now creates long-term advantage.'}\n\nReady to discuss your specific situation?\n📞 801-635-8462 | gsbrealtor.com\nGurpreet Bhatti | REALTOR® | USMC Veteran | GSB Realtor`,
      hashtags: ['#MarketUpdate', '#UtahRealEstate', '#GSBRealtor', '#UtahHousingMarket', '#SaltLakeCity', '#UtahRealtor', '#VeteranOwned', '#USMCVeteran', '#InvestInUtah', '#HomesForSale'],
    }
  }

  if (type === 'neighborhood') {
    const d = data as { name?: string; highlights?: string; price?: string; why?: string }
    return {
      facebook: `📍 ${d.name || 'West Jordan, Utah'} — one of Utah's best values right now. ${d.why || 'Great schools, parks, and community'}. Homes in the ${d.price || 'mid $400s'}. See listings at gsbrealtor.com or call 801-635-8462`,
      instagram: `📍 NEIGHBORHOOD SPOTLIGHT\n\n${d.name || 'West Jordan, Utah'} ✨\n\n${d.why || 'Here\'s why families love this area:'}\n🏫 ${(d.highlights as string || 'Great schools').split(',')[0]}\n🌳 ${(d.highlights as string || ', parks').split(',')[1] || 'Beautiful parks'}\n💰 Homes from ${d.price || 'mid $400s'}\n\nSearch available homes → gsbrealtor.com\n📞 801-635-8462\n\n#UtahLiving #${(d.name as string || 'WestJordan').replace(/[^a-zA-Z]/g, '')} #UtahRealEstate #GSBRealtor`,
      twitter: `📍 ${d.name || 'West Jordan, Utah'}: ${d.why || 'great value, strong community'}. Homes from ${d.price || 'mid $400s'}. See listings → gsbrealtor.com | 801-635-8462`,
      tiktok_script: `If you're thinking about moving to ${d.name || 'West Jordan, Utah'}, here's what you need to know. ${d.highlights || 'Great schools, beautiful parks, family-friendly community'}. ${d.why || 'And the prices are still reasonable compared to the rest of the valley'}. Homes starting in the ${d.price || 'mid $400s'}. See what's available at gsbrealtor.com or text me at 801-635-8462.`,
      linkedin: `Neighborhood Analysis: ${d.name || 'West Jordan, Utah'}\n\nFor buyers and investors evaluating Utah submarkets:\n\n${d.why || 'West Jordan consistently delivers value for both primary residence buyers and investors.'}\n\nKey factors:\n• ${(d.highlights as string || 'Strong schools, infrastructure, retail').split(', ').join('\n• ')}\n• Median prices: ${d.price || 'Mid $400s'}\n\nFor investors: below-market entry with strong appreciation potential. For families: quality of life at accessible price points.\n\n📞 801-635-8462 | gsbrealtor.com\nGurpreet Bhatti | REALTOR® | USMC Veteran | GSB Realtor`,
      hashtags: ['#UtahLiving', '#NeighborhoodGuide', '#UtahRealEstate', '#GSBRealtor', '#UtahHomes', '#SaltLakeCity', '#WestJordan', '#VeteranOwned', '#UtahRealtor', '#HomesForSale'],
    }
  }

  // Default: tip
  const d = data as { topic?: string; point?: string }
  return {
    facebook: `💡 ${dayOfWeek} Real Estate Tip: ${d.point || 'Get pre-approved before you start touring homes'}. ${d.topic || 'Most buyers skip this step — and it costs them their dream home'}. Questions? 801-635-8462 | gsbrealtor.com`,
    instagram: `💡 REAL ESTATE TIP — ${dayOfWeek.toUpperCase()}\n\n📌 ${d.point || 'Get pre-approved BEFORE touring homes'}\n\n${d.topic || 'This is the single most common mistake I see Utah home buyers make.'}\n\nHere's why it matters:\n✅ Know your real budget\n✅ Sellers take you seriously\n✅ Move fast in a competitive market\n✅ No surprises at closing\n\n📞 801-635-8462 | 🌐 gsbrealtor.com\n\n#RealEstateTips #HomeBuyingTips #UtahRealEstate #GSBRealtor #UtahRealtor #VeteranOwned`,
    twitter: `💡 ${dayOfWeek} tip: ${d.point || 'Get pre-approved before you tour homes'}. ${d.topic ? d.topic.substring(0, 60) : 'Most buyers learn this lesson the hard way'}. 801-635-8462 gsbrealtor.com`,
    tiktok_script: `Real estate tip for ${dayOfWeek}. ${d.point || 'Always get pre-approved before you start looking at homes'}. ${d.topic || 'I see buyers lose their dream home every week because they skipped this one step'}. It takes 24 hours and costs nothing. Don't be that buyer. Follow me for more Utah real estate tips, and text me at 801-635-8462 when you're ready to make a move.`,
    linkedin: `Real Estate Insight — ${dayOfWeek}\n\nPractical advice from years in the Utah market:\n\n${d.point || 'Mortgage pre-approval is not optional — it\'s your foundation.'}\n\n${d.topic || 'In Utah\'s competitive market, unverified buyers are ignored. Pre-approval signals seriousness, defines your budget, and enables fast action when the right property appears.'}\n\nSimple process, significant impact on outcomes.\n\nQuestions about the Utah market or buying process?\n📞 801-635-8462 | gsbrealtor.com\n\nGurpreet Bhatti | REALTOR® | USMC Veteran | GSB Realtor`,
    hashtags: ['#RealEstateTips', '#HomeBuyingTips', '#UtahRealEstate', '#GSBRealtor', '#UtahRealtor', '#VeteranOwned', '#USMCVeteran', '#GuideToUtah', '#UtahHomes', '#FirstTimeHomeBuyer'],
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface SocialContent {
  facebook: string
  instagram: string
  twitter: string
  tiktok_script: string
  linkedin: string
  hashtags: string[]
}

interface DailyPost {
  slot: string
  type: string
  data: object
  content: SocialContent
  generated_at: string
}

interface DailyContentResponse {
  date: string
  posts: {
    morning: DailyPost
    noon: DailyPost
    evening: DailyPost
  }
  schedule: {
    morning: string
    noon: string
    evening: string
  }
  generated_at: string
  ready_to_post: boolean
}

// ── GET — Generate today's 3 posts ───────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const dateParam = searchParams.get('date') // Optional: YYYY-MM-DD

  try {
    const targetDate = dateParam ? new Date(dateParam) : new Date()
    const dayOfWeek = targetDate.getDay()
    const dateStr = targetDate.toISOString().split('T')[0]

    // Get content types for each slot based on day of week
    const [morningType, noonType, eveningType] = DAY_PREFERENCES[dayOfWeek] || ['tip', 'listing', 'market_update']

    // Mountain Time post schedule
    const year = targetDate.getFullYear()
    const month = targetDate.getMonth()
    const day = targetDate.getDate()

    const schedule = {
      morning: new Date(Date.UTC(year, month, day, 13, 0, 0)).toISOString(),  // 7am MT = 1pm UTC
      noon: new Date(Date.UTC(year, month, day, 18, 0, 0)).toISOString(),     // 12pm MT = 6pm UTC
      evening: new Date(Date.UTC(year, month, day, 24, 0, 0)).toISOString(), // 6pm MT = midnight UTC next day
    }

    // Generate all 3 posts in parallel
    const [morning, noon, evening] = await Promise.all([
      generateSlotContent(morningType, 'morning'),
      generateSlotContent(noonType, 'noon'),
      generateSlotContent(eveningType, 'evening'),
    ])

    const response: DailyContentResponse = {
      date: dateStr,
      posts: { morning, noon, evening },
      schedule,
      generated_at: new Date().toISOString(),
      ready_to_post: true,
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Daily content GET error:', error)
    return NextResponse.json({ error: 'Failed to generate daily content' }, { status: 500 })
  }
}

// ── POST — Generate and schedule today's posts ────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // Generate today's content
    const today = new Date()
    const dayOfWeek = today.getDay()
    const [morningType, noonType, eveningType] = DAY_PREFERENCES[dayOfWeek] || ['tip', 'listing', 'market_update']

    const [morning, noon, evening] = await Promise.all([
      generateSlotContent(morningType, 'morning'),
      generateSlotContent(noonType, 'noon'),
      generateSlotContent(eveningType, 'evening'),
    ])

    // Auto-schedule each post via the schedule API
    const year = today.getFullYear()
    const month = today.getMonth()
    const day = today.getDate()

    const scheduleResults = await Promise.all([
      fetch(`${BASE_URL}/api/social-schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content_type: morning.type,
          platform: 'all',
          content: morning.content?.facebook || '',
          hashtags: morning.content?.hashtags || [],
          scheduled_time: new Date(Date.UTC(year, month, day, 13, 0, 0)).toISOString(),
          full_content: morning.content,
          notes: 'Auto-generated morning post',
        }),
      }),
      fetch(`${BASE_URL}/api/social-schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content_type: noon.type,
          platform: 'all',
          content: noon.content?.facebook || '',
          hashtags: noon.content?.hashtags || [],
          scheduled_time: new Date(Date.UTC(year, month, day, 18, 0, 0)).toISOString(),
          full_content: noon.content,
          notes: 'Auto-generated noon post',
        }),
      }),
      fetch(`${BASE_URL}/api/social-schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content_type: evening.type,
          platform: 'all',
          content: evening.content?.facebook || '',
          hashtags: evening.content?.hashtags || [],
          scheduled_time: new Date(Date.UTC(year, month, day, 24, 0, 0)).toISOString(),
          full_content: evening.content,
          notes: 'Auto-generated evening post',
        }),
      }),
    ])

    const scheduledPosts = await Promise.all(
      scheduleResults.map(r => r.json().catch(() => ({ error: 'Schedule API unavailable' })))
    )

    return NextResponse.json({
      success: true,
      date: today.toISOString().split('T')[0],
      posts_generated: 3,
      posts: { morning, noon, evening },
      scheduled: scheduledPosts,
      message: `Generated and scheduled 3 posts for ${today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'America/Denver' })}`,
    })

  } catch (error) {
    console.error('Daily content POST error:', error)
    return NextResponse.json({ error: 'Failed to generate and schedule daily content' }, { status: 500 })
  }
}
