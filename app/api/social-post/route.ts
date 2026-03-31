/**
 * GSB REALTOR — SOCIAL MEDIA CONTENT AUTOMATION API
 * Generates platform-specific content via Groq AI
 * Platforms: Facebook, Instagram, Twitter/X, TikTok/Reels, LinkedIn
 */

import { NextRequest, NextResponse } from 'next/server'

const GROQ_KEY = process.env.GROQ_API_KEY

// ── Brand constants ──────────────────────────────────────────────────────────
const BRAND = {
  name: 'GSB Realtor',
  agent: 'Gurpreet Bhatti',
  phone: '801-635-8462',
  website: 'gsbrealtor.com',
  title: 'REALTOR® | USMC Veteran | Commercial Specialist',
  location: 'West Jordan, Utah',
}

// ── Hashtag sets ─────────────────────────────────────────────────────────────
const HASHTAGS = {
  utah: ['#UtahRealEstate', '#GSBRealtor', '#UtahHomes', '#SaltLakeCity', '#WestJordan', '#HomesForSale', '#UtahRealtor', '#GuideToUtah'],
  commercial: ['#CommercialRealEstate', '#NNNLease', '#UtahCommercial', '#InvestInUtah', '#CREInvesting'],
  veteran: ['#VeteranOwned', '#USMCVeteran', '#VetBiz'],
  listing: ['#JustListed', '#NewListing', '#DreamHome', '#Utah'],
  sold: ['#JustSold', '#SoldByGSB', '#SuccessStory'],
  neighborhood: ['#UtahLiving', '#NeighborhoodGuide', '#UtahCommunity'],
  tip: ['#RealEstateTips', '#HomeBuyingTips', '#UtahRealEstate'],
  market: ['#MarketUpdate', '#UtahHousingMarket', '#RealEstateMarket'],
}

// ── System prompt ─────────────────────────────────────────────────────────────
const SYSTEM = `You are a social media expert for GSB Realtor, the Utah real estate brand of Gurpreet Bhatti — REALTOR®, USMC Veteran, commercial specialist. 

Create engaging platform-specific content that converts. Always weave in:
- Website: gsbrealtor.com
- Phone: 801-635-8462
- Brand: GSB Realtor | Gurpreet Bhatti | West Jordan, Utah

Personality: Direct, honest, Marine-tough but approachable. No fluff. Real talk. Authentic.

PLATFORM GUIDELINES:
- Facebook: Conversational, community-focused, storytelling. Max 300 chars. Drive to call or website.
- Instagram: Visual-first, emotional, heavy emoji use. Include hashtags inline. Max 2200 chars.
- Twitter/X: Short, punchy, confident. Max 280 chars. End with link.
- TikTok/Reels: Spoken script for 15-second video. Hook in first 2 seconds. Energetic, direct, CTA at end.
- LinkedIn: Professional tone, data/ROI angle. Investor-friendly. No slang. 150-200 words.

Always return valid JSON only. No markdown. No extra text.`

// ── Build prompt for each content type ───────────────────────────────────────
function buildPrompt(type: string, data?: Record<string, unknown>): string {
  const d = data || {}

  const prompts: Record<string, string> = {
    listing: `Generate social media content for a new Utah real estate listing.

Property details:
- Address: ${d.address || 'Beautiful home in Utah'}
- Price: ${d.price || 'Contact for price'}
- Bedrooms: ${d.bedrooms || 'N/A'}
- Bathrooms: ${d.bathrooms || 'N/A'}
- Sq Ft: ${d.sqft || 'N/A'}
- Key features: ${d.features || 'Updated kitchen, open floor plan, great neighborhood'}
- MLS: ${d.mls || 'Contact for MLS#'}
- City: ${d.city || 'Utah'}

Create content for all 5 platforms. Return JSON:
{
  "facebook": "Full property description with price, key features, and CTA to call 801-635-8462 or visit gsbrealtor.com. Max 300 chars. Personal and warm.",
  "instagram": "Visual-focused caption with emojis, emotional appeal, property highlights. Include relevant hashtags inline. Max 2200 chars.",
  "twitter": "Short punchy listing announcement. Max 280 chars. End with gsbrealtor.com",
  "tiktok_script": "15-second spoken video script. Start with a hook about the property. Energetic. End with CTA.",
  "linkedin": "Professional listing post with investment angle, neighborhood value prop, and contact info. 150-200 words.",
  "hashtags": ["array", "of", "10-15", "relevant", "hashtags"]
}`,

    market_update: `Generate social media content for a Utah real estate market update.

Market context:
- Area: ${d.area || 'Salt Lake County, Utah'}
- Month/Period: ${d.period || 'Current month'}
- Key stat 1: ${d.stat1 || 'Median home price holding strong'}
- Key stat 2: ${d.stat2 || 'Inventory remains tight'}
- Key insight: ${d.insight || 'Buyers are competing, sellers have leverage'}
- Trend: ${d.trend || 'Market is competitive but stabilizing'}

Create market update content for all 5 platforms. Return JSON:
{
  "facebook": "Market insight post, community tone, what this means for local buyers/sellers. Max 300 chars.",
  "instagram": "Engaging market stats with emojis, visual storytelling. Action-oriented. Hashtags inline.",
  "twitter": "Quick market fact + opinion. Max 280 chars. End with gsbrealtor.com",
  "tiktok_script": "15-second spoken script breaking down market stats in plain English. Hook first.",
  "linkedin": "Data-driven market analysis. Professional tone. Include investment angle. 150-200 words.",
  "hashtags": ["array", "of", "10-15", "market-relevant", "hashtags"]
}`,

    tip: `Generate social media content for a real estate tip / educational post.

Tip focus: ${d.topic || 'Home buying process in Utah — what most buyers get wrong'}
Target audience: ${d.audience || 'First-time homebuyers and investors'}
Key point: ${d.point || 'Get pre-approved BEFORE you fall in love with a home'}

Create educational tip content for all 5 platforms. Return JSON:
{
  "facebook": "Friendly educational tip. Conversational. Personal story angle. CTA. Max 300 chars.",
  "instagram": "Visual tip with bullet points or numbered list. Emojis. Educational but engaging. Hashtags.",
  "twitter": "Crisp, actionable tip. Max 280 chars. End with gsbrealtor.com",
  "tiktok_script": "15-second script teaching the tip. Fast-paced. End with 'follow for more Utah real estate tips'.",
  "linkedin": "Expert advice post. Credibility-building. Data or experience-backed. Professional. 150-200 words.",
  "hashtags": ["array", "of", "10-15", "educational-relevant", "hashtags"]
}`,

    sold: `Generate social media content celebrating a SOLD property.

Sale details:
- Address/Area: ${d.address || 'Utah home'}
- Original price: ${d.list_price || 'List price'}
- Sale price: ${d.sale_price || 'Above asking'}
- Days on market: ${d.dom || 'N/A'}
- Client type: ${d.client_type || 'First-time buyer'}
- Special story: ${d.story || 'Helped clients navigate competitive market'}

Create sold celebration content for all 5 platforms. Return JSON:
{
  "facebook": "Celebrate the sale! Grateful, community-focused. Mention client success. CTA for others. Max 300 chars.",
  "instagram": "Celebratory sold post with emojis. Tell the story. Inspire others. Hashtags.",
  "twitter": "Quick sold announcement. Punchy. Max 280 chars. gsbrealtor.com",
  "tiktok_script": "15-second celebratory script. Tell the mini success story. Invite viewers to DM.",
  "linkedin": "Professional sold post with market insight. Mention negotiation skills. Invite investor/seller leads. 150-200 words.",
  "hashtags": ["array", "of", "10-15", "sold-relevant", "hashtags"]
}`,

    neighborhood: `Generate social media content for a Utah neighborhood spotlight.

Neighborhood details:
- Name: ${d.name || 'West Jordan, Utah'}
- Highlights: ${d.highlights || 'Great schools, parks, family-friendly, growing area'}
- Median price: ${d.price || 'Mid $400s'}
- Why it's great: ${d.why || 'Affordable, well-located, strong appreciation'}
- One secret: ${d.secret || 'Hidden gem with easy freeway access'}

Create neighborhood spotlight content for all 5 platforms. Return JSON:
{
  "facebook": "Neighborhood love letter. Community pride. Why people choose this area. CTA. Max 300 chars.",
  "instagram": "Visual neighborhood tour caption. Lifestyle-focused. Emojis. Invite DMs. Hashtags.",
  "twitter": "Quick neighborhood highlight. Punchy. Max 280 chars. gsbrealtor.com",
  "tiktok_script": "15-second neighborhood tour script. 'If you're thinking about moving to [area], watch this.' Hook first.",
  "linkedin": "Investment case for the neighborhood. Appreciation stats, demographics, growth drivers. 150-200 words.",
  "hashtags": ["array", "of", "10-15", "neighborhood-relevant", "hashtags"]
}`,

    commercial: `Generate social media content for a commercial real estate opportunity.

Commercial details:
- Property type: ${d.property_type || 'NNN Retail / Strip Plaza'}
- Location: ${d.location || 'Salt Lake County, Utah'}
- Cap rate: ${d.cap_rate || '5.5%'}
- Price: ${d.price || 'Contact for pricing'}
- Tenant: ${d.tenant || 'National credit tenant'}
- Investment angle: ${d.angle || 'Passive income, long-term lease, minimal management'}

Create commercial real estate content for all 5 platforms. Return JSON:
{
  "facebook": "Commercial opportunity post. Investor-friendly. Highlight passive income angle. CTA. Max 300 chars.",
  "instagram": "Commercial property spotlight with numbers. Emojis. Investment lifestyle. Hashtags.",
  "twitter": "Sharp commercial CRE post. Numbers-focused. Max 280 chars. gsbrealtor.com",
  "tiktok_script": "15-second script about the CRE investment. 'Here's why smart investors love NNN leases.' Hook first.",
  "linkedin": "Deep commercial real estate post. Cap rate analysis, lease terms, investment thesis. 150-200 words.",
  "hashtags": ["array", "of", "10-15", "commercial-relevant", "hashtags"]
}`,
  }

  return prompts[type] || prompts['tip']
}

// ── Fallback content generator ────────────────────────────────────────────────
function generateFallback(type: string, data?: Record<string, unknown>): SocialContent {
  const d = data || {}
  
  const base = {
    listing: {
      facebook: `NEW LISTING ALERT! 🏠 ${d.bedrooms || '4'}bd/${d.bathrooms || '2'}ba in ${d.city || 'Utah'} — ${d.price || 'Call for price'}. Beautiful home ready for new owners. Call/text Gurpreet 801-635-8462 or visit gsbrealtor.com`,
      instagram: `✨ JUST LISTED ✨\n\n🏠 ${d.address || 'Beautiful Utah Home'}\n💰 ${d.price || 'Contact for pricing'}\n🛏 ${d.bedrooms || 'N/A'} beds | 🛁 ${d.bathrooms || 'N/A'} baths | 📐 ${d.sqft || 'N/A'} sqft\n\n${d.features || 'Updated throughout with incredible finishes — this one won\'t last!'}\n\n📞 Call/text Gurpreet: 801-635-8462\n🌐 gsbrealtor.com\n\n#JustListed #UtahRealEstate #GSBRealtor #UtahHomes #HomesForSale #UtahRealtor #${(d.city as string || 'Utah').replace(/ /g, '')}`,
      twitter: `🏠 NEW LISTING: ${d.bedrooms || 'N/A'}bd/${d.bathrooms || 'N/A'}ba in ${d.city || 'Utah'} — ${d.price || 'Call for price'}. Schedule a showing today! 📞 801-635-8462 gsbrealtor.com`,
      tiktok_script: `[HOOK] This home just hit the market and it's already getting calls — let me show you why. [MIDDLE] ${d.address || 'Located in a prime Utah neighborhood'}, ${d.bedrooms || 'N/A'} beds, ${d.bathrooms || 'N/A'} baths, ${d.sqft || 'N/A'} square feet, listed at ${d.price || 'an unbeatable price'}. [CTA] Want to see it? Text me at 801-635-8462 or hit my link in bio — I do same-day showings.`,
      linkedin: `New Listing Alert — ${d.address || 'Prime Utah Property'}\n\nJust listed: ${d.bedrooms || 'N/A'} bedroom, ${d.bathrooms || 'N/A'} bathroom home in ${d.city || 'Utah'} at ${d.price || 'competitive market pricing'}.\n\n${d.features || 'This property offers excellent value in one of Utah\'s strongest submarkets.'} Whether you\'re a buyer looking for your next home or an investor evaluating your next acquisition, this deserves a look.\n\nSchedule a showing or request the full details:\n📞 801-635-8462\n🌐 gsbrealtor.com\n\nGurpreet Bhatti | REALTOR® | USMC Veteran | GSB Realtor`,
      hashtags: [...HASHTAGS.utah, ...HASHTAGS.listing, ...HASHTAGS.veteran],
    },
    market_update: {
      facebook: `📊 UTAH MARKET UPDATE: ${d.area || 'Salt Lake County'} — ${d.stat1 || 'Home prices holding strong with tight inventory'}. What this means for you: ${d.insight || 'Buyers need to move fast. Sellers have leverage.'}. Questions? Call 801-635-8462 | gsbrealtor.com`,
      instagram: `📊 UTAH REAL ESTATE MARKET UPDATE\n\n${d.area || 'Salt Lake County'} — ${d.period || 'This month'}\n\n📈 ${d.stat1 || 'Median prices holding strong'}\n🏘️ ${d.stat2 || 'Inventory remains tight'}\n💡 ${d.insight || 'Competitive market — buyers need strategy'}\n\nWant to know what this means for YOUR situation?\n\n📞 Text Gurpreet: 801-635-8462\n🌐 gsbrealtor.com\n\n#MarketUpdate #UtahRealEstate #GSBRealtor #UtahHousingMarket #SaltLakeCity #UtahRealtor`,
      twitter: `📊 Utah market update: ${d.stat1 || 'Prices holding, inventory tight'}. ${d.insight || 'Sellers still have leverage in most areas'}. Full analysis → gsbrealtor.com | 📞 801-635-8462`,
      tiktok_script: `[HOOK] Here's what's happening in the Utah real estate market right now — and what you need to do about it. [DATA] ${d.stat1 || 'Prices are holding strong'}. ${d.stat2 || 'Inventory is still tight'}. ${d.trend || 'The market is competitive but opportunities exist if you know where to look'}. [CTA] Follow me for weekly Utah market updates — and text me at 801-635-8462 if you want to make a move.`,
      linkedin: `Utah Real Estate Market Update — ${d.period || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}\n\nKey metrics for ${d.area || 'Salt Lake County'}:\n\n• ${d.stat1 || 'Median home prices holding strong'}\n• ${d.stat2 || 'Inventory remains below historical averages'}\n• ${d.trend || 'Competitive environment favoring prepared buyers and motivated sellers'}\n\nInsight: ${d.insight || 'Despite rate pressures, Utah\'s fundamentals — population growth, job market, quality of life — continue to support long-term real estate values.'}\n\nFor investors evaluating Utah assets, the current environment rewards those with local expertise and fast execution. That\'s exactly what GSB Realtor delivers.\n\n📞 801-635-8462 | gsbrealtor.com\nGurpreet Bhatti | REALTOR® | USMC Veteran`,
      hashtags: [...HASHTAGS.utah, ...HASHTAGS.market, ...HASHTAGS.veteran],
    },
    tip: {
      facebook: `💡 REAL ESTATE TIP: ${d.point || 'Get pre-approved BEFORE you fall in love with a home'}. ${d.topic || 'Most buyers skip this step and lose their dream home to someone who didn\'t'}. Learn more at gsbrealtor.com | 📞 801-635-8462`,
      instagram: `💡 REAL ESTATE TIP OF THE DAY\n\n📌 Topic: ${d.topic || 'The #1 mistake Utah home buyers make'}\n\n✅ ${d.point || 'Get pre-approved BEFORE you start touring homes'}\n\nHere\'s why this matters:\n→ Know your exact budget\n→ Sellers take you seriously\n→ You can move FAST in a competitive market\n→ No heartbreak over a home you can\'t afford\n\nHave questions? DM me or call 801-635-8462 📞\n\nGurpreet Bhatti | GSB Realtor | West Jordan, Utah 🌟\n🌐 gsbrealtor.com\n\n#RealEstateTips #HomeBuyingTips #UtahRealEstate #GSBRealtor #FirstTimeHomeBuyer #UtahRealtor`,
      twitter: `💡 Utah real estate tip: ${d.point || 'Get pre-approved before touring homes'}. ${d.topic || 'Skipping this step costs buyers their dream home every single day'}. Questions? 801-635-8462 gsbrealtor.com`,
      tiktok_script: `[HOOK] The biggest mistake Utah home buyers make — and how to avoid it. [TIP] ${d.point || 'Always get pre-approved BEFORE you start looking at homes'}. ${d.topic || 'I see buyers lose their dream home every week because they skipped this one step'}. It takes 24 hours and costs you nothing. [CTA] Follow for more Utah real estate tips, and text me at 801-635-8462 when you\'re ready to buy.`,
      linkedin: `Real Estate Insight: ${d.topic || 'The Most Common Home Buying Mistake in Utah'}\n\nAfter years in Utah real estate, the pattern is clear: ${d.point || 'buyers who skip pre-approval lose deals, waste time, and miss opportunities'}.\n\nHere\'s the professional take:\n\n1. Pre-approval signals seriousness to sellers\n2. It defines your real budget — not assumptions\n3. In a competitive market, unverified buyers don\'t win\n4. The process takes 24-48 hours with the right lender\n\nTarget audience: ${d.audience || 'Whether you\'re a first-time buyer or experienced investor, this step is non-negotiable in today\'s Utah market'}.\n\nI work with buyers who are ready to move with precision. If that\'s you:\n📞 801-635-8462 | gsbrealtor.com\n\nGurpreet Bhatti | REALTOR® | USMC Veteran | GSB Realtor`,
      hashtags: [...HASHTAGS.utah, ...HASHTAGS.tip, ...HASHTAGS.veteran],
    },
    sold: {
      facebook: `🎉 SOLD! Congratulations to our amazing clients! ${d.address ? `${d.address} — ` : ''}${d.story || 'Another Utah family in their dream home'}. Honored to serve you! Ready to sell YOUR home? 801-635-8462 | gsbrealtor.com`,
      instagram: `🎉 SOLD! SOLD! SOLD! 🏡\n\n${d.address || 'Another Utah home'} — CLOSED!\n\n${d.story || 'So proud to help these incredible clients navigate the Utah market and close on their dream home.'}\n\n${d.dom ? `⏱️ ${d.dom} days on market` : ''}\n${d.sale_price ? `💰 ${d.sale_price}` : ''}\n\nThinking about selling YOUR home? Let\'s talk.\n📞 801-635-8462\n🌐 gsbrealtor.com\n\nGurpreet Bhatti | GSB Realtor 🇺🇸\n\n#JustSold #SoldByGSB #UtahRealEstate #GSBRealtor #SuccessStory #UtahRealtor #VeteranOwned`,
      twitter: `🎉 SOLD! ${d.address || 'Another Utah home closed'}! ${d.story ? String(d.story || '').substring(0, 80) : 'Congrats to our amazing clients'}. Thinking of selling? 801-635-8462 gsbrealtor.com`,
      tiktok_script: `[HOOK] Just got another one SOLD in Utah — and here\'s the story. [STORY] ${d.story || 'Our clients were nervous about the market, but with the right strategy, we got it done'}. ${d.dom ? `Sold in ${d.dom} days` : 'Closed fast'}. ${d.sale_price ? `Final price: ${d.sale_price}` : 'Above expectations'}. [CTA] If you\'re thinking about selling, text me at 801-635-8462 — I\'d love to do the same for you.`,
      linkedin: `CLOSED: ${d.address || 'Utah Residential Transaction'}\n\n${d.story || 'Proud to announce another successful closing for our clients.'}\n\nTransaction highlights:\n${d.list_price ? `• Listed at: ${d.list_price}` : ''}\n${d.sale_price ? `• Sold at: ${d.sale_price}` : ''}\n${d.dom ? `• Days on market: ${d.dom}` : ''}\n\nEvery transaction is a trust exercise. Clients put their most valuable asset — and often their biggest life transition — in my hands. I don\'t take that lightly.\n\nIf you\'re considering selling in Utah\'s current market, let\'s have a direct conversation about what\'s realistic and what I can deliver.\n\n📞 801-635-8462 | gsbrealtor.com\nGurpreet Bhatti | REALTOR® | USMC Veteran | GSB Realtor`,
      hashtags: [...HASHTAGS.utah, ...HASHTAGS.sold, ...HASHTAGS.veteran],
    },
    neighborhood: {
      facebook: `🏘️ NEIGHBORHOOD SPOTLIGHT: ${d.name || 'West Jordan, Utah'} — ${d.highlights || 'Great schools, parks, growing community'}. Median prices in the ${d.price || 'mid $400s'}. ${d.why || 'One of Utah\'s best values right now'}. Questions? 801-635-8462 | gsbrealtor.com`,
      instagram: `🏘️ NEIGHBORHOOD SPOTLIGHT\n📍 ${d.name || 'West Jordan, Utah'}\n\n${d.why || 'Here\'s why families and investors love this area'}\n\n✅ ${(d.highlights as string || 'Great schools, parks, shopping').split(', ').join('\n✅ ')}\n\n💰 Median prices: ${d.price || 'Mid $400s'}\n\n${d.secret ? `🤫 Local secret: ${d.secret}` : ''}\n\nWant to see available homes here? DM me or visit gsbrealtor.com 🌐\n📞 801-635-8462\n\n#UtahLiving #NeighborhoodGuide #${(d.name as string || 'WestJordan').replace(/[^a-zA-Z]/g, '')} #UtahRealEstate #GSBRealtor #UtahHomes`,
      twitter: `📍 ${d.name || 'West Jordan, Utah'} spotlight: ${d.why || 'affordable, well-located, strong appreciation'}. Homes in the ${d.price || 'mid $400s'}. See listings → gsbrealtor.com | 801-635-8462`,
      tiktok_script: `[HOOK] If you\'re thinking about moving to ${d.name || 'West Jordan, Utah'} — watch this first. [TOUR] ${d.highlights || 'Great schools, parks, family-friendly neighborhoods, easy freeway access'}. Median home prices around ${d.price || 'the mid $400s'} — one of Utah\'s best values right now. ${d.secret ? `And here\'s the local secret: ${d.secret}` : ''} [CTA] Search available homes at gsbrealtor.com or text me at 801-635-8462.`,
      linkedin: `Neighborhood Analysis: ${d.name || 'West Jordan, Utah'}\n\nFor investors and relocating professionals evaluating Utah submarkets:\n\n${d.why || 'West Jordan represents exceptional long-term value'} with:\n• ${(d.highlights as string || 'Strong school districts, established infrastructure, retail access').split(', ').join('\n• ')}\n• Median home values: ${d.price || 'Mid $400s'}\n• ${d.secret || 'Below-median prices relative to comparable Salt Lake County submarkets'}\n\nFor out-of-state investors or buyers relocating for work, this area consistently delivers strong appreciation with lower entry points than comparable zip codes in the SLC metro.\n\nFull neighborhood analysis available on request.\n\n📞 801-635-8462 | gsbrealtor.com\nGurpreet Bhatti | REALTOR® | USMC Veteran | GSB Realtor`,
      hashtags: [...HASHTAGS.utah, ...HASHTAGS.neighborhood, ...HASHTAGS.veteran],
    },
    commercial: {
      facebook: `🏢 COMMERCIAL OPPORTUNITY: ${d.property_type || 'NNN Retail'} in ${d.location || 'Utah'} — ${d.cap_rate ? `${d.cap_rate} cap rate` : 'Strong returns'}. ${d.angle || 'Passive income, long-term lease, minimal management'}. Investor inquiries: 801-635-8462 | gsbrealtor.com`,
      instagram: `🏢 COMMERCIAL REAL ESTATE ALERT\n\n📍 ${d.location || 'Salt Lake County, Utah'}\n🏗️ ${d.property_type || 'NNN Retail / Strip Plaza'}\n${d.cap_rate ? `📊 Cap Rate: ${d.cap_rate}` : ''}\n${d.price ? `💰 ${d.price}` : ''}\n${d.tenant ? `🏪 Tenant: ${d.tenant}` : ''}\n\n${d.angle || 'Passive income. Long-term lease. Minimal management. This is what smart investors are buying in Utah.'}\n\nInterested? DM me or call 801-635-8462 📞\n🌐 gsbrealtor.com/investor\n\nGurpreet Bhatti | GSB Realtor | USMC Veteran 🇺🇸\n\n#CommercialRealEstate #NNNLease #UtahCommercial #InvestInUtah #CREInvesting #VeteranOwned`,
      twitter: `🏢 Utah CRE: ${d.property_type || 'NNN Retail'} in ${d.location || 'Utah'}${d.cap_rate ? ` | ${d.cap_rate} cap` : ''}. ${d.angle || 'Passive income play with long-term lease'}. Details: 801-635-8462 gsbrealtor.com/investor`,
      tiktok_script: `[HOOK] Here\'s why smart investors are buying ${d.property_type || 'NNN retail'} in Utah right now. [DATA] ${d.cap_rate ? `Cap rate: ${d.cap_rate}.` : ''} ${d.tenant ? `Tenant: ${d.tenant}.` : ''} ${d.angle || 'You collect rent, the tenant handles everything else'}. Long-term lease, national credit tenant, minimal landlord responsibility. [CTA] This is commercial real estate — my specialty. Text me at 801-635-8462 to discuss.`,
      linkedin: `Commercial Real Estate Opportunity — ${d.property_type || 'NNN Retail Asset'} | ${d.location || 'Utah'}\n\nFor accredited investors and 1031 exchange buyers:\n\n${d.property_type || 'NNN Retail'} opportunity with the following profile:\n${d.cap_rate ? `• Cap Rate: ${d.cap_rate}` : ''}\n${d.price ? `• Asking Price: ${d.price}` : ''}\n${d.tenant ? `• Tenant: ${d.tenant}` : ''}\n\nInvestment thesis: ${d.angle || 'Net lease assets in Utah\'s growing submarkets offer passive income streams with long-term tenant stability — ideal for wealth preservation and 1031 reinvestment'}.\n\nCommercial real estate is my specialty — NNN leases, tenant placement, strip plaza acquisitions. I work directly with buyers and investors, not through layers of intermediaries.\n\n📞 801-635-8462 | gsbrealtor.com/investor\nGurpreet Bhatti | REALTOR® | USMC Veteran | Commercial Specialist | GSB Realtor`,
      hashtags: [...HASHTAGS.commercial, ...HASHTAGS.utah, ...HASHTAGS.veteran],
    },
  }

  return ((base as Record<string, SocialContent>)[type] || base['tip']) as SocialContent
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

// ── Main handler ──────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, data } = body

    const validTypes = ['listing', 'market_update', 'tip', 'sold', 'neighborhood', 'commercial']
    if (!type || !validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // ── Try Groq AI ──────────────────────────────────────────────────────────
    if (GROQ_KEY) {
      try {
        const prompt = buildPrompt(type, data)

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GROQ_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            max_tokens: 2000,
            temperature: 0.8,
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: SYSTEM },
              { role: 'user', content: prompt },
            ],
          }),
        })

        if (response.ok) {
          const groqData = await response.json()
          const raw = groqData.choices?.[0]?.message?.content

          if (raw) {
            const parsed = JSON.parse(raw) as SocialContent

            // Ensure hashtags are present and augmented
            const typeHashtags = HASHTAGS[type as keyof typeof HASHTAGS] || HASHTAGS.utah
            const allHashtags = Array.from(new Set([
              ...(parsed.hashtags || []),
              ...HASHTAGS.veteran,
              ...typeHashtags.slice(0, 5),
            ])).slice(0, 20)

            return NextResponse.json({
              ...parsed,
              hashtags: allHashtags,
              _meta: {
                type,
                generated_at: new Date().toISOString(),
                provider: 'groq',
                model: 'llama-3.3-70b-versatile',
              },
            })
          }
        }
      } catch (groqErr) {
        console.error('Groq error, using fallback:', groqErr)
      }
    }

    // ── Fallback content ─────────────────────────────────────────────────────
    const fallback = generateFallback(type, data)
    return NextResponse.json({
      ...fallback,
      _meta: {
        type,
        generated_at: new Date().toISOString(),
        provider: 'fallback',
      },
    })

  } catch (error) {
    console.error('Social post API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate content. Please try again.' },
      { status: 500 }
    )
  }
}

// ── GET — usage info ──────────────────────────────────────────────────────────
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/social-post',
    method: 'POST',
    description: 'Generate platform-specific social media content for GSB Realtor',
    types: ['listing', 'market_update', 'tip', 'sold', 'neighborhood', 'commercial'],
    example_request: {
      type: 'listing',
      data: {
        address: '1234 Main St, West Jordan, UT 84084',
        price: '$425,000',
        bedrooms: 4,
        bathrooms: 2,
        sqft: 2100,
        features: 'Updated kitchen, open floor plan, 2-car garage',
        city: 'West Jordan',
      },
    },
    returns: ['facebook', 'instagram', 'twitter', 'tiktok_script', 'linkedin', 'hashtags'],
  })
}
