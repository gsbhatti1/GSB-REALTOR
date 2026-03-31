/**
 * GSB REALTOR — SOCIAL MEDIA SCHEDULING API
 * GET  /api/social-schedule         → Returns today's scheduled posts
 * POST /api/social-schedule         → Add a post to the queue
 * DELETE /api/social-schedule?id=XX → Remove a post
 *
 * Storage: Supabase social_posts table (with in-memory fallback)
 */

import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// ── In-memory store (fallback when Supabase is not configured) ────────────────
// NOTE: This resets on server restart. Use Supabase for persistence.
const IN_MEMORY_QUEUE: ScheduledPost[] = []

// ── Types ─────────────────────────────────────────────────────────────────────
interface ScheduledPost {
  id: string
  content_type: string
  platform: string
  content: string
  hashtags?: string[]
  scheduled_time: string  // ISO string
  status: 'queued' | 'posted' | 'failed' | 'skipped'
  created_at: string
  full_content?: {
    facebook?: string
    instagram?: string
    twitter?: string
    tiktok_script?: string
    linkedin?: string
    hashtags?: string[]
  }
  notes?: string
}

interface ScheduledPostInput {
  content_type: string   // 'listing' | 'market_update' | 'tip' | 'sold' | 'neighborhood' | 'commercial'
  platform?: string      // 'all' | 'facebook' | 'instagram' | 'twitter' | 'tiktok' | 'linkedin'
  content?: string
  hashtags?: string[]
  scheduled_time?: string  // ISO datetime — defaults to next available slot
  full_content?: Record<string, unknown>
  notes?: string
}

// ── Supabase helpers ──────────────────────────────────────────────────────────
async function supabaseGet(table: string, query: string = '') {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}${query}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
    },
  })
  if (!res.ok) return null
  return res.json()
}

async function supabaseInsert(table: string, row: Record<string, unknown>) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(row),
  })
  if (!res.ok) return null
  return res.json()
}

async function supabaseDelete(table: string, id: string) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return false
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'DELETE',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  })
  return res.ok
}

// ── Generate a unique ID ──────────────────────────────────────────────────────
function generateId(): string {
  return `post_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

// ── Get next available post slot ──────────────────────────────────────────────
function getNextSlot(existingPosts: ScheduledPost[]): string {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  // Default posting slots (Mountain Time): 7am, 12pm, 6pm
  const slots = [
    new Date(today.getTime() + 7 * 60 * 60 * 1000),   // 7:00 AM MT
    new Date(today.getTime() + 12 * 60 * 60 * 1000),  // 12:00 PM MT
    new Date(today.getTime() + 18 * 60 * 60 * 1000),  // 6:00 PM MT
  ]

  // Tomorrow's slots if today's are all taken
  const tomorrowSlots = slots.map(s => new Date(s.getTime() + 24 * 60 * 60 * 1000))
  const allSlots = [...slots, ...tomorrowSlots]

  const usedTimes = new Set(existingPosts.map(p => new Date(p.scheduled_time).getTime()))

  for (const slot of allSlots) {
    if (slot > now && !usedTimes.has(slot.getTime())) {
      return slot.toISOString()
    }
  }

  // If all slots taken, add 2 hours from now
  return new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString()
}

// ── GET — Today's scheduled posts ────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const range = searchParams.get('range') || 'today'  // 'today' | 'week' | 'all'

  try {
    let posts: ScheduledPost[] = []

    // Try Supabase first
    if (SUPABASE_URL && SUPABASE_KEY) {
      let query = '?order=scheduled_time.asc'

      if (range === 'today') {
        const today = new Date()
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString()
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString()
        query += `&scheduled_time=gte.${startOfDay}&scheduled_time=lt.${endOfDay}`
      } else if (range === 'week') {
        const today = new Date()
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
        const weekAhead = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
        query += `&scheduled_time=gte.${weekAgo}&scheduled_time=lt.${weekAhead}`
      }

      const data = await supabaseGet('social_posts', query)
      if (data) {
        posts = data
      }
    }

    // Fall back to in-memory
    if (!posts.length && IN_MEMORY_QUEUE.length) {
      const now = new Date()

      if (range === 'today') {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
        posts = IN_MEMORY_QUEUE.filter(p => {
          const t = new Date(p.scheduled_time)
          return t >= startOfDay && t < endOfDay
        })
      } else if (range === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        const weekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        posts = IN_MEMORY_QUEUE.filter(p => {
          const t = new Date(p.scheduled_time)
          return t >= weekAgo && t < weekAhead
        })
      } else {
        posts = [...IN_MEMORY_QUEUE]
      }

      posts.sort((a, b) => new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime())
    }

    // Group by date for calendar view
    const grouped: Record<string, ScheduledPost[]> = {}
    posts.forEach(post => {
      const dateKey = new Date(post.scheduled_time).toISOString().split('T')[0]
      if (!grouped[dateKey]) grouped[dateKey] = []
      grouped[dateKey].push(post)
    })

    return NextResponse.json({
      posts,
      grouped,
      total: posts.length,
      range,
      storage: SUPABASE_URL ? 'supabase' : 'memory',
    })

  } catch (error) {
    console.error('Social schedule GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch scheduled posts' }, { status: 500 })
  }
}

// ── POST — Add post to queue ──────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body: ScheduledPostInput = await req.json()

    const {
      content_type,
      platform = 'all',
      content = '',
      hashtags = [],
      scheduled_time,
      full_content,
      notes,
    } = body

    if (!content_type) {
      return NextResponse.json({ error: 'content_type is required' }, { status: 400 })
    }

    // Get current posts to determine next slot
    let existingPosts: ScheduledPost[] = []
    if (SUPABASE_URL && SUPABASE_KEY) {
      const data = await supabaseGet('social_posts', '?status=eq.queued&order=scheduled_time.asc')
      if (data) existingPosts = data
    } else {
      existingPosts = IN_MEMORY_QUEUE.filter(p => p.status === 'queued')
    }

    const newPost: ScheduledPost = {
      id: generateId(),
      content_type,
      platform,
      content,
      hashtags,
      scheduled_time: scheduled_time || getNextSlot(existingPosts),
      status: 'queued',
      created_at: new Date().toISOString(),
      full_content: full_content as ScheduledPost['full_content'],
      notes,
    }

    // Try to save to Supabase
    if (SUPABASE_URL && SUPABASE_KEY) {
      const saved = await supabaseInsert('social_posts', newPost)
      if (saved && saved[0]) {
        return NextResponse.json({
          success: true,
          post: saved[0],
          storage: 'supabase',
          message: `Post scheduled for ${new Date(newPost.scheduled_time).toLocaleString('en-US', { timeZone: 'America/Denver' })} MT`,
        })
      }
    }

    // Fall back to in-memory
    IN_MEMORY_QUEUE.push(newPost)
    return NextResponse.json({
      success: true,
      post: newPost,
      storage: 'memory',
      message: `Post scheduled for ${new Date(newPost.scheduled_time).toLocaleString('en-US', { timeZone: 'America/Denver' })} MT`,
      warning: 'Stored in memory only — will reset on server restart. Configure Supabase for persistence.',
    })

  } catch (error) {
    console.error('Social schedule POST error:', error)
    return NextResponse.json({ error: 'Failed to schedule post' }, { status: 500 })
  }
}

// ── DELETE — Remove post from queue ──────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'id parameter required' }, { status: 400 })
  }

  try {
    // Try Supabase first
    if (SUPABASE_URL && SUPABASE_KEY) {
      const deleted = await supabaseDelete('social_posts', id)
      if (deleted) {
        return NextResponse.json({ success: true, id, storage: 'supabase' })
      }
    }

    // Fall back to in-memory
    const idx = IN_MEMORY_QUEUE.findIndex(p => p.id === id)
    if (idx !== -1) {
      IN_MEMORY_QUEUE.splice(idx, 1)
      return NextResponse.json({ success: true, id, storage: 'memory' })
    }

    return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  } catch (error) {
    console.error('Social schedule DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
