'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

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
  data: Record<string, unknown>
  content: SocialContent
  generated_at: string
}

interface DailyContent {
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
}

interface ScheduledPost {
  id: string
  content_type: string
  platform: string
  content: string
  hashtags?: string[]
  scheduled_time: string
  status: 'queued' | 'posted' | 'failed' | 'skipped'
  created_at: string
  full_content?: SocialContent
  notes?: string
}

interface GeneratePostForm {
  type: string
  address: string
  price: string
  bedrooms: string
  bathrooms: string
  sqft: string
  features: string
  city: string
}

// ── Platform icons (inline SVG) ───────────────────────────────────────────────
const PlatformIcon = ({ platform }: { platform: string }) => {
  const icons: Record<string, string> = {
    facebook: 'f',
    instagram: '📸',
    twitter: '𝕏',
    tiktok: '♪',
    linkedin: 'in',
  }
  const colors: Record<string, string> = {
    facebook: '#1877F2',
    instagram: '#E4405F',
    twitter: '#000000',
    tiktok: '#FF0050',
    linkedin: '#0A66C2',
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: '28px', height: '28px', borderRadius: '6px', fontSize: '12px',
      fontWeight: '700', color: '#fff',
      background: colors[platform] || '#555',
    }}>
      {icons[platform] || platform[0].toUpperCase()}
    </span>
  )
}

// ── Copy button ───────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      style={{
        padding: '5px 12px', borderRadius: '6px', fontSize: '12px',
        background: copied ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.06)',
        border: `1px solid ${copied ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.1)'}`,
        color: copied ? '#4ade80' : '#888',
        cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
        transition: 'all 0.15s',
      }}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

// ── Platform content card ─────────────────────────────────────────────────────
function PlatformCard({ label, platform, content, hashtags }: {
  label: string
  platform: string
  content: string
  hashtags?: string[]
}) {
  const [expanded, setExpanded] = useState(false)
  const fullText = hashtags && platform === 'instagram'
    ? `${content}\n\n${hashtags.join(' ')}`
    : content

  return (
    <div style={{
      background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '12px', overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <PlatformIcon platform={platform} />
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#F5F3EE' }}>{label}</span>
          <span style={{ fontSize: '11px', color: '#555' }}>{fullText.length} chars</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <CopyButton text={fullText} />
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              padding: '5px 10px', borderRadius: '6px', fontSize: '12px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              color: '#888', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
            }}
          >
            {expanded ? '▲ Less' : '▼ More'}
          </button>
        </div>
      </div>
      <div style={{ padding: '14px 16px' }}>
        <p style={{
          fontSize: '13px', color: '#999', lineHeight: '1.7', margin: 0,
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          display: expanded ? 'block' : '-webkit-box',
          WebkitLineClamp: expanded ? 'unset' : 3,
          WebkitBoxOrient: 'vertical',
        }}>
          {fullText}
        </p>
      </div>
      {hashtags && platform !== 'instagram' && hashtags.length > 0 && (
        <div style={{ padding: '0 16px 14px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {hashtags.slice(0, 6).map(tag => (
            <span key={tag} style={{ fontSize: '11px', color: '#C9A84C', background: 'rgba(201,168,76,0.08)', padding: '2px 8px', borderRadius: '100px' }}>
              {tag}
            </span>
          ))}
          {hashtags.length > 6 && (
            <span style={{ fontSize: '11px', color: '#555' }}>+{hashtags.length - 6} more</span>
          )}
        </div>
      )}
    </div>
  )
}

// ── Post slot card ────────────────────────────────────────────────────────────
function PostSlotCard({ post, slotTime, slotLabel }: {
  post: DailyPost
  slotTime: string
  slotLabel: string
}) {
  const [open, setOpen] = useState(false)
  const typeColors: Record<string, string> = {
    listing: '#C9A84C', market_update: '#60a5fa', tip: '#4ade80',
    sold: '#a78bfa', neighborhood: '#f97316', commercial: '#e11d48',
  }
  const typeLabels: Record<string, string> = {
    listing: 'New Listing', market_update: 'Market Update', tip: 'Real Estate Tip',
    sold: 'Just Sold', neighborhood: 'Neighborhood Spotlight', commercial: 'Commercial',
  }

  return (
    <div style={{
      background: '#111', border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '16px', overflow: 'hidden',
      borderLeft: `3px solid ${typeColors[post.type] || '#555'}`,
    }}>
      {/* Header */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px', cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#555', marginBottom: '2px' }}>
              {slotLabel} · {new Date(slotTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Denver' })} MT
            </div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#F5F3EE' }}>
              {typeLabels[post.type] || post.type}
            </div>
          </div>
          <span style={{
            fontSize: '11px', padding: '4px 10px', borderRadius: '100px',
            background: `${typeColors[post.type] || '#555'}15`,
            color: typeColors[post.type] || '#888',
          }}>
            {post.type}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '11px', color: '#555' }}>5 platforms</span>
          <span style={{ fontSize: '16px', color: '#555', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
        </div>
      </div>

      {/* Content preview when collapsed */}
      {!open && post.content && (
        <div style={{ padding: '0 20px 16px', fontSize: '13px', color: '#666', lineHeight: '1.5' }}>
          <p style={{ margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {post.content.facebook}
          </p>
        </div>
      )}

      {/* Expanded platform content */}
      {open && post.content && (
        <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <PlatformCard label="Facebook" platform="facebook" content={post.content.facebook} hashtags={post.content.hashtags} />
          <PlatformCard label="Instagram" platform="instagram" content={post.content.instagram} hashtags={post.content.hashtags} />
          <PlatformCard label="Twitter / X" platform="twitter" content={post.content.twitter} hashtags={post.content.hashtags} />
          <PlatformCard label="TikTok / Reels Script" platform="tiktok" content={post.content.tiktok_script} />
          <PlatformCard label="LinkedIn" platform="linkedin" content={post.content.linkedin} hashtags={post.content.hashtags} />

          {/* Hashtag bank */}
          {post.content.hashtags && post.content.hashtags.length > 0 && (
            <div style={{ background: '#0D0D0D', borderRadius: '12px', padding: '14px 16px', border: '1px solid rgba(201,168,76,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Hashtag Set</span>
                <CopyButton text={post.content.hashtags.join(' ')} />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {post.content.hashtags.map(tag => (
                  <span key={tag} style={{ fontSize: '12px', color: '#C9A84C', background: 'rgba(201,168,76,0.08)', padding: '4px 10px', borderRadius: '100px' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function SocialDashboard() {
  const [authorized, setAuthorized] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')

  const [dailyContent, setDailyContent] = useState<DailyContent | null>(null)
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState<'today' | 'generate' | 'calendar'>('today')
  const [generateMsg, setGenerateMsg] = useState('')

  // Custom post generator form
  const [form, setForm] = useState<GeneratePostForm>({
    type: 'listing', address: '', price: '', bedrooms: '', bathrooms: '',
    sqft: '', features: '', city: 'Utah',
  })
  const [customContent, setCustomContent] = useState<SocialContent | null>(null)
  const [customGenerating, setCustomGenerating] = useState(false)

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'gsbrealtor2024'

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthorized(true)
      loadTodayContent()
      loadSchedule()
    } else {
      setAuthError('Wrong password')
    }
  }

  const loadTodayContent = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/daily-content')
      if (res.ok) {
        const data = await res.json()
        setDailyContent(data)
      }
    } catch (err) {
      console.error('Failed to load daily content:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadSchedule = useCallback(async () => {
    try {
      const res = await fetch('/api/social-schedule?range=week')
      if (res.ok) {
        const data = await res.json()
        setScheduledPosts(data.posts || [])
      }
    } catch (err) {
      console.error('Failed to load schedule:', err)
    }
  }, [])

  const generateAndScheduleToday = async () => {
    setGenerating(true)
    setGenerateMsg('')
    try {
      const res = await fetch('/api/daily-content', { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        setGenerateMsg(`✓ Generated ${data.posts_generated} posts and added to schedule`)
        await loadTodayContent()
        await loadSchedule()
      } else {
        setGenerateMsg('Failed to generate posts — try again')
      }
    } catch {
      setGenerateMsg('Network error — try again')
    } finally {
      setGenerating(false)
    }
  }

  const generateCustomPost = async () => {
    setCustomGenerating(true)
    setCustomContent(null)
    try {
      const res = await fetch('/api/social-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: form.type,
          data: {
            address: form.address,
            price: form.price,
            bedrooms: form.bedrooms,
            bathrooms: form.bathrooms,
            sqft: form.sqft,
            features: form.features,
            city: form.city,
          },
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setCustomContent(data)
      }
    } catch (err) {
      console.error('Custom post error:', err)
    } finally {
      setCustomGenerating(false)
    }
  }

  // ── Auth gate ───────────────────────────────────────────────────────────────
  if (!authorized) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', fontFamily: 'DM Sans, sans-serif' }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '32px', fontWeight: '600', color: '#F5F3EE', marginBottom: '8px' }}>Social Hub</div>
            <div style={{ fontSize: '13px', color: '#555' }}>GSB Realtor content automation</div>
          </div>
          <form onSubmit={handleAuth}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password"
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '14px 16px', fontSize: '15px', color: '#F5F3EE', outline: 'none', fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box' }}
              />
              {authError && <div style={{ marginTop: '8px', fontSize: '13px', color: '#ef4444' }}>{authError}</div>}
            </div>
            <button type="submit" style={{ width: '100%', background: 'linear-gradient(135deg, #C9A84C, #E2C070)', color: '#0A0A0A', fontWeight: '600', fontSize: '15px', padding: '14px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              Enter Social Hub
            </button>
          </form>
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <Link href="/admin" style={{ color: '#555', fontSize: '13px', textDecoration: 'none' }}>← Admin Dashboard</Link>
          </div>
        </div>
      </div>
    )
  }

  // ── Main dashboard ──────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', fontFamily: 'DM Sans, sans-serif' }}>

      {/* Header */}
      <header style={{
        background: '#111', borderBottom: '1px solid rgba(201,168,76,0.15)',
        padding: '0 32px', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: '600', color: '#F5F3EE' }}>GSB Social Hub</div>
          <div style={{ fontSize: '11px', color: '#C9A84C', letterSpacing: '0.1em', textTransform: 'uppercase', background: 'rgba(201,168,76,0.1)', padding: '3px 10px', borderRadius: '100px' }}>AI Automation</div>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link href="/admin" style={{ color: '#888', textDecoration: 'none', fontSize: '13px' }}>← Admin</Link>
          <Link href="/" style={{ color: '#888', textDecoration: 'none', fontSize: '13px' }}>Live Site</Link>
          <button
            onClick={generateAndScheduleToday}
            disabled={generating}
            style={{
              background: generating ? 'rgba(201,168,76,0.3)' : 'linear-gradient(135deg, #C9A84C, #E2C070)',
              color: '#0A0A0A', fontWeight: '600', fontSize: '13px',
              padding: '9px 18px', borderRadius: '8px', border: 'none',
              cursor: generating ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              whiteSpace: 'nowrap',
            }}
          >
            {generating ? '⟳ Generating...' : '⚡ Generate Today\'s Posts'}
          </button>
        </div>
      </header>

      {/* Generate success message */}
      {generateMsg && (
        <div style={{
          margin: '16px 32px', padding: '12px 16px', borderRadius: '10px',
          background: generateMsg.startsWith('✓') ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${generateMsg.startsWith('✓') ? 'rgba(74,222,128,0.2)' : 'rgba(239,68,68,0.2)'}`,
          color: generateMsg.startsWith('✓') ? '#4ade80' : '#ef4444', fontSize: '14px',
        }}>
          {generateMsg}
        </div>
      )}

      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '32px' }}>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: "Today's Posts", val: dailyContent ? '3' : '—', color: '#C9A84C' },
            { label: 'Queued', val: scheduledPosts.filter(p => p.status === 'queued').length, color: '#60a5fa' },
            { label: 'Posted', val: scheduledPosts.filter(p => p.status === 'posted').length, color: '#4ade80' },
            { label: 'Platforms', val: '5', color: '#a78bfa' },
          ].map(s => (
            <div key={s.label} style={{ padding: '20px 24px', background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px' }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '36px', fontWeight: '600', color: s.color, lineHeight: '1' }}>{s.val}</div>
              <div style={{ fontSize: '12px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '6px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', background: '#0D0D0D', borderRadius: '12px', padding: '4px', width: 'fit-content', border: '1px solid rgba(255,255,255,0.06)' }}>
          {[
            { key: 'today', label: "📅 Today's Content" },
            { key: 'generate', label: '✍️ Custom Post' },
            { key: 'calendar', label: '📆 Schedule' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              style={{
                padding: '10px 18px', borderRadius: '9px', fontSize: '13px',
                background: activeTab === tab.key ? 'rgba(201,168,76,0.15)' : 'transparent',
                border: `1px solid ${activeTab === tab.key ? 'rgba(201,168,76,0.3)' : 'transparent'}`,
                color: activeTab === tab.key ? '#C9A84C' : '#666',
                cursor: 'pointer', fontFamily: 'inherit', fontWeight: activeTab === tab.key ? '600' : '400',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TODAY'S CONTENT TAB ─────────────────────────────────────────────── */}
        {activeTab === 'today' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: '400', color: '#F5F3EE', margin: 0 }}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'America/Denver' })}
                </h2>
                <p style={{ color: '#555', fontSize: '13px', margin: '4px 0 0' }}>3 posts · 7 AM, 12 PM, 6 PM MT · 5 platforms each</p>
              </div>
              <button
                onClick={loadTodayContent}
                style={{ padding: '9px 16px', borderRadius: '8px', fontSize: '13px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#888', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                ↻ Refresh
              </button>
            </div>

            {loading ? (
              <div style={{ padding: '80px', textAlign: 'center', color: '#555' }}>
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>⟳</div>
                <div>Generating content via AI...</div>
              </div>
            ) : !dailyContent ? (
              <div style={{ padding: '80px', textAlign: 'center' }}>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>📱</div>
                <div style={{ color: '#555', fontSize: '15px', marginBottom: '20px' }}>No content generated yet for today</div>
                <button
                  onClick={loadTodayContent}
                  style={{ background: 'linear-gradient(135deg, #C9A84C, #E2C070)', color: '#0A0A0A', fontWeight: '600', fontSize: '15px', padding: '12px 28px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Generate Today's Posts
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {dailyContent.posts && Object.entries(dailyContent.posts).map(([slot, post]) => (
                  <PostSlotCard
                    key={slot}
                    post={post as DailyPost}
                    slotTime={dailyContent.schedule[slot as keyof typeof dailyContent.schedule]}
                    slotLabel={slot.charAt(0).toUpperCase() + slot.slice(1)}
                  />
                ))}

                <div style={{ marginTop: '8px', padding: '16px 20px', background: '#0D0D0D', borderRadius: '12px', border: '1px solid rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '13px', color: '#666' }}>
                    Generated {new Date(dailyContent.generated_at).toLocaleTimeString('en-US', { timeZone: 'America/Denver', hour: '2-digit', minute: '2-digit' })} MT
                  </div>
                  <button
                    onClick={loadTodayContent}
                    style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', color: '#C9A84C', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    ↻ Regenerate
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── CUSTOM POST GENERATOR TAB ───────────────────────────────────────── */}
        {activeTab === 'generate' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px' }}>

            {/* Form */}
            <div style={{ background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: '400', color: '#F5F3EE', margin: '0 0 20px' }}>Generate Custom Post</h3>

              {/* Content type */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Content Type</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  {[
                    ['listing', 'New Listing'],
                    ['market_update', 'Market Update'],
                    ['tip', 'Real Estate Tip'],
                    ['sold', 'Just Sold'],
                    ['neighborhood', 'Neighborhood'],
                    ['commercial', 'Commercial'],
                  ].map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => setForm(f => ({ ...f, type: val }))}
                      style={{
                        padding: '9px 12px', borderRadius: '8px', fontSize: '12px',
                        background: form.type === val ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${form.type === val ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.06)'}`,
                        color: form.type === val ? '#C9A84C' : '#666',
                        cursor: 'pointer', fontFamily: 'inherit',
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Listing-specific fields */}
              {form.type === 'listing' && (
                <>
                  {[
                    ['address', 'Property Address', 'e.g. 1234 Main St, West Jordan'],
                    ['price', 'Asking Price', 'e.g. $425,000'],
                    ['bedrooms', 'Bedrooms', 'e.g. 4'],
                    ['bathrooms', 'Bathrooms', 'e.g. 2.5'],
                    ['sqft', 'Square Feet', 'e.g. 2,100'],
                    ['city', 'City', 'e.g. West Jordan'],
                  ].map(([key, label, placeholder]) => (
                    <div key={key} style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>{label}</label>
                      <input
                        value={form[key as keyof GeneratePostForm]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        placeholder={placeholder}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#F5F3EE', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                      />
                    </div>
                  ))}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Key Features</label>
                    <textarea
                      value={form.features}
                      onChange={e => setForm(f => ({ ...f, features: e.target.value }))}
                      placeholder="e.g. Updated kitchen, open floor plan, 2-car garage, mountain views"
                      rows={3}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#F5F3EE', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
                    />
                  </div>
                </>
              )}

              <button
                onClick={generateCustomPost}
                disabled={customGenerating}
                style={{
                  width: '100%', background: customGenerating ? 'rgba(201,168,76,0.3)' : 'linear-gradient(135deg, #C9A84C, #E2C070)',
                  color: '#0A0A0A', fontWeight: '600', fontSize: '14px',
                  padding: '13px', borderRadius: '10px', border: 'none',
                  cursor: customGenerating ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                }}
              >
                {customGenerating ? '⟳ Generating with AI...' : '⚡ Generate All Platforms'}
              </button>
            </div>

            {/* Generated content preview */}
            <div>
              {customGenerating && (
                <div style={{ padding: '60px', textAlign: 'center', color: '#555', background: '#0D0D0D', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>⟳</div>
                  <div>Generating content for all 5 platforms...</div>
                </div>
              )}

              {!customGenerating && !customContent && (
                <div style={{ padding: '60px', textAlign: 'center', color: '#444', background: '#0D0D0D', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>📝</div>
                  <div style={{ fontSize: '14px' }}>Fill out the form and click generate<br />to create platform-specific content</div>
                </div>
              )}

              {customContent && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: '400', color: '#F5F3EE', margin: 0 }}>Generated Content</h3>
                    <span style={{ fontSize: '12px', color: '#4ade80', background: 'rgba(74,222,128,0.1)', padding: '4px 10px', borderRadius: '100px' }}>Ready to post</span>
                  </div>
                  <PlatformCard label="Facebook" platform="facebook" content={customContent.facebook} hashtags={customContent.hashtags} />
                  <PlatformCard label="Instagram" platform="instagram" content={customContent.instagram} hashtags={customContent.hashtags} />
                  <PlatformCard label="Twitter / X" platform="twitter" content={customContent.twitter} hashtags={customContent.hashtags} />
                  <PlatformCard label="TikTok / Reels Script" platform="tiktok" content={customContent.tiktok_script} />
                  <PlatformCard label="LinkedIn" platform="linkedin" content={customContent.linkedin} hashtags={customContent.hashtags} />

                  {customContent.hashtags && customContent.hashtags.length > 0 && (
                    <div style={{ background: '#0D0D0D', borderRadius: '12px', padding: '14px 16px', border: '1px solid rgba(201,168,76,0.1)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Hashtag Set ({customContent.hashtags.length})</span>
                        <CopyButton text={customContent.hashtags.join(' ')} />
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {customContent.hashtags.map(tag => (
                          <span key={tag} style={{ fontSize: '12px', color: '#C9A84C', background: 'rgba(201,168,76,0.08)', padding: '4px 10px', borderRadius: '100px' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── CALENDAR / SCHEDULE TAB ─────────────────────────────────────────── */}
        {activeTab === 'calendar' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: '400', color: '#F5F3EE', margin: 0 }}>Content Calendar</h2>
                <p style={{ color: '#555', fontSize: '13px', margin: '4px 0 0' }}>Past 7 days + next 7 days</p>
              </div>
              <button
                onClick={loadSchedule}
                style={{ padding: '9px 16px', borderRadius: '8px', fontSize: '13px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#888', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                ↻ Refresh
              </button>
            </div>

            {scheduledPosts.length === 0 ? (
              <div style={{ padding: '80px', textAlign: 'center', background: '#0D0D0D', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>📆</div>
                <div style={{ color: '#555', fontSize: '15px', marginBottom: '20px' }}>No posts scheduled yet</div>
                <button
                  onClick={generateAndScheduleToday}
                  style={{ background: 'linear-gradient(135deg, #C9A84C, #E2C070)', color: '#0A0A0A', fontWeight: '600', fontSize: '14px', padding: '12px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Generate & Schedule Today's Posts
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {scheduledPosts.map(post => {
                  const statusColors: Record<string, string> = { queued: '#C9A84C', posted: '#4ade80', failed: '#ef4444', skipped: '#555' }
                  const typeLabels: Record<string, string> = { listing: 'Listing', market_update: 'Market Update', tip: 'Tip', sold: 'Sold', neighborhood: 'Neighborhood', commercial: 'Commercial' }
                  return (
                    <div key={post.id} style={{
                      background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '12px', padding: '14px 18px',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '13px', color: '#555', whiteSpace: 'nowrap' }}>
                          {new Date(post.scheduled_time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'America/Denver' })}
                          <br />
                          <span style={{ color: '#C9A84C' }}>
                            {new Date(post.scheduled_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Denver' })} MT
                          </span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '14px', fontWeight: '500', color: '#F5F3EE', marginBottom: '2px' }}>
                            {typeLabels[post.content_type] || post.content_type}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {post.content || post.notes || 'All platforms'}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          fontSize: '11px', padding: '4px 10px', borderRadius: '100px', whiteSpace: 'nowrap',
                          color: statusColors[post.status] || '#888',
                          background: `${statusColors[post.status] || '#555'}15`,
                          textTransform: 'capitalize',
                        }}>
                          {post.status}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* API Reference footer */}
        <div style={{ marginTop: '48px', padding: '24px', background: '#0D0D0D', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ fontSize: '12px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>API Endpoints</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px' }}>
            {[
              ['POST /api/social-post', 'Generate content for all platforms'],
              ['GET /api/social-schedule', 'Fetch today\'s scheduled posts'],
              ['POST /api/social-schedule', 'Add a post to the queue'],
              ['GET /api/daily-content', 'Preview today\'s 3 generated posts'],
              ['POST /api/daily-content', 'Generate + schedule all 3 posts'],
            ].map(([endpoint, desc]) => (
              <div key={endpoint} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <code style={{ fontSize: '11px', color: '#C9A84C', background: 'rgba(201,168,76,0.08)', padding: '3px 8px', borderRadius: '4px', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>{endpoint}</code>
                <span style={{ fontSize: '12px', color: '#555' }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
