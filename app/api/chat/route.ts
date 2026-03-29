/**
 * GSB REALTOR — AI CHATBOT API
 * Powered by Claude (Anthropic)
 * Answers buyer/seller questions 24/7 as Gurpreet
 */

import { NextRequest, NextResponse } from 'next/server'

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY

const SYSTEM_PROMPT = `You are Gurpreet Bhatti, a REALTOR® and USMC Veteran based in Utah. You represent GSB Realtor (gsbrealtor.com).

Your personality:
- Direct, honest, and no-nonsense — like a Marine
- Knowledgeable about ALL Utah real estate: residential, commercial, investment
- Warm but efficient. You respect people's time.
- You never pressure or mislead. Mission first.

Your credentials:
- UT License# 12907042-SA00 (Utah)
- NV License# S.0201351 (Nevada)  
- WY License# RE-17041 (Wyoming)
- Dynasty Point Referral Group
- USMC Veteran
- Commercial specialist: NNN leases, tenant placement, strip plazas, commercial acquisitions
- Based in West Jordan / Taylorsville area

Your knowledge:
- Utah real estate market (Salt Lake, Utah, Davis, Weber, Washington counties)
- WFRMLS / Utah MLS system
- Investment analysis: cap rates, cash flow, NOI, rental yield
- Commercial real estate: NNN, gross leases, tenant placement, LOI
- First-time buyer programs, FHA, VA loans
- The home buying and selling process

How you respond:
- Keep answers concise (2-4 sentences max unless a detailed question)
- Always offer to connect them with Gurpreet directly: 801-635-8462 or gsbhatti1@yahoo.com
- If they ask about a specific property, tell them to search on the site or call you
- For investment analysis, direct them to the Investor Tools page (/investor)
- For home valuations, direct them to /valuation
- NEVER make up specific listing details, prices, or addresses you don't know
- NEVER give legal or financial advice — tell them to consult a professional
- Always end by offering to help further or connect directly

If someone asks to schedule a showing or tour, collect:
1. Their name
2. Phone number or email
3. The property address or listing key
Then say you'll have Gurpreet reach out within the hour.

Keep responses conversational and under 100 words unless the question genuinely requires detail.`

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array required' }, { status: 400 })
    }

    // Use Claude if available, otherwise use a smart fallback
    if (CLAUDE_API_KEY) {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307', // Fast + cheap for chat
          max_tokens: 300,
          system: SYSTEM_PROMPT,
          messages: messages.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`)
      }

      const data = await response.json()
      const reply = data.content?.[0]?.text || 'Sorry, I had trouble responding. Call me directly at 801-635-8462.'

      return NextResponse.json({ reply })
    } else {
      // Smart fallback — keyword-based responses when Claude API isn't configured
      const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || ''

      let reply = "I'm Gurpreet Bhatti — Utah REALTOR® and USMC Veteran. I'd love to help with your real estate needs. The best way to connect is to call or text me directly at 801-635-8462, or fill out the contact form below."

      if (lastMessage.includes('price') || lastMessage.includes('cost') || lastMessage.includes('worth') || lastMessage.includes('value')) {
        reply = "Home values in Utah vary widely by city and neighborhood. For a free, personalized home valuation, visit gsbrealtor.com/valuation or call me at 801-635-8462. I'll give you an honest number — not inflated to win your listing."
      } else if (lastMessage.includes('buy') || lastMessage.includes('purchase') || lastMessage.includes('looking')) {
        reply = "Great time to search Utah's MLS. Use the search on this site to browse 17,000+ live Utah listings. When you find something you like, I'll get you in for a showing same day. Call 801-635-8462 or search at gsbrealtor.com/search."
      } else if (lastMessage.includes('sell') || lastMessage.includes('list') || lastMessage.includes('selling')) {
        reply = "I'd love to help you sell. Get a free home valuation first — visit gsbrealtor.com/valuation. I'll tell you exactly what your home is worth and what we can do to maximize your sale price. Zero pressure."
      } else if (lastMessage.includes('invest') || lastMessage.includes('cap rate') || lastMessage.includes('cash flow') || lastMessage.includes('rental')) {
        reply = "I specialize in investment properties. Use the free investor tools at gsbrealtor.com/investor to run cap rate and cash flow calculations. Then call me — 801-635-8462 — and I'll help you find the right deal."
      } else if (lastMessage.includes('commercial') || lastMessage.includes('nnn') || lastMessage.includes('tenant')) {
        reply = "Commercial real estate is my specialty — NNN leases, tenant placement, strip plazas, and acquisitions. Most Utah agents avoid commercial. I run toward it. Call 801-635-8462 to talk commercial."
      } else if (lastMessage.includes('tour') || lastMessage.includes('showing') || lastMessage.includes('see the')) {
        reply = "I can schedule showings same-day on most properties. Text me the address at 801-635-8462 and I'll confirm a time within the hour. Or fill out the contact form and I'll reach out immediately."
      } else if (lastMessage.includes('hello') || lastMessage.includes('hi') || lastMessage.includes('hey')) {
        reply = "Hey — I'm Gurpreet Bhatti, Utah REALTOR® and USMC Veteran. What can I help you with today? Buying, selling, investing, or just have questions about the market?"
      }

      return NextResponse.json({ reply })
    }
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({
      reply: "Sorry, something went wrong on my end. Call me directly at 801-635-8462 and I'll help you right away.",
    })
  }
}
