import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are Gurpreet Bhatti, Utah REALTOR® and USMC Veteran at GSB Realtor. Write authoritative, SEO-optimized real estate blog posts about Utah. Include specific Utah city names, market data, and practical advice. Always end with a call to action: call 801-635-8462 or visit gsbrealtor.com. Write in first person as Gurpreet.`

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export async function POST(req: NextRequest) {
  // Auth check
  const auth = req.headers.get('Authorization')
  if (auth !== 'Bearer gsb-drip-2024') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const groqApiKey = process.env.GROQ_API_KEY
  if (!groqApiKey) {
    return NextResponse.json({ error: 'GROQ_API_KEY not configured' }, { status: 500 })
  }

  let body: { topic?: string; city?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { topic, city } = body
  if (!topic) {
    return NextResponse.json({ error: 'topic is required' }, { status: 400 })
  }

  const cityContext = city ? ` Focus specifically on ${city}, Utah.` : ' Focus on Utah real estate in general.'

  const userPrompt = `Write a complete SEO-optimized blog post about: "${topic}".${cityContext}

Return a JSON object with exactly these fields:
{
  "title": "SEO-optimized blog post title (under 65 characters)",
  "slug": "url-friendly-slug",
  "excerpt": "2-3 sentence meta description (under 160 characters)",
  "content": "Full blog post content in markdown, 800-1000 words. Include H2 and H3 headings, bullet points where appropriate, and specific Utah market data.",
  "faq": [
    { "question": "FAQ question 1", "answer": "Detailed answer 1" },
    { "question": "FAQ question 2", "answer": "Detailed answer 2" },
    { "question": "FAQ question 3", "answer": "Detailed answer 3" },
    { "question": "FAQ question 4", "answer": "Detailed answer 4" },
    { "question": "FAQ question 5", "answer": "Detailed answer 5" }
  ],
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}

Return ONLY the JSON object, no other text.`

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    })

    if (!groqRes.ok) {
      const errText = await groqRes.text()
      console.error('Groq API error:', errText)
      return NextResponse.json({ error: 'Groq API error', details: errText }, { status: 502 })
    }

    const groqData = await groqRes.json()
    const rawContent = groqData.choices?.[0]?.message?.content ?? ''

    // Parse the JSON from the LLM response
    let blogPost: {
      title: string
      slug: string
      excerpt: string
      content: string
      faq: Array<{ question: string; answer: string }>
      tags: string[]
    }

    try {
      // Extract JSON from the response (handle potential markdown code blocks)
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }
      blogPost = JSON.parse(jsonMatch[0])
    } catch {
      // If JSON parsing fails, construct a basic response
      blogPost = {
        title: topic,
        slug: slugify(topic),
        excerpt: `Read about ${topic} from Gurpreet Bhatti, Utah REALTOR® at GSB Realtor.`,
        content: rawContent,
        faq: [],
        tags: ['utah real estate', 'gsb realtor', 'gurpreet bhatti'],
      }
    }

    // Ensure slug is always set
    if (!blogPost.slug) {
      blogPost.slug = slugify(blogPost.title || topic)
    }

    return NextResponse.json({
      success: true,
      post: {
        ...blogPost,
        generated_at: new Date().toISOString(),
        topic,
        city: city ?? null,
      },
    })
  } catch (err) {
    console.error('generate-blog error:', err)
    return NextResponse.json(
      { error: 'Internal server error', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
