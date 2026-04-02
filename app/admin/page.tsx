'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface SavedProp {
  id: string
  session_id?: string
  user_id?: string
  listing_key: string
  address?: string
  city?: string
  list_price?: number
  bedrooms?: number
  bathrooms?: number
  photo_url?: string
  property_type?: string
  saved_at: string
}

interface Lead {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  lead_type: string
  message?: string
  property_address?: string
  status: string
  source?: string
  created_at: string
}

const STATUS_COLORS: Record<string, string> = {
  new: '#C9A84C',
  contacted: '#60a5fa',
  qualified: '#4ade80',
  closed: '#22c55e',
  dead: '#555',
}

const LEAD_TYPE_LABELS: Record<string, string> = {
  tour_request: 'Tour Request',
  contact_form: 'Contact Form',
  listing_inquiry: 'Listing Inquiry',
  market_report: 'Home Valuation',
  saved_search: 'Saved Search',
  call_request: 'Call Request',
  investor_inquiry: 'Investor',
}

// ── Lead Scoring ────────────────────────────────────────────────────────────

type LeadScore = 'hot' | 'warm' | 'cold'

function computeLeadScore(lead: Lead): LeadScore {
  const msg = (lead.message || '').toLowerCase()
  const source = (lead.source || '').toLowerCase()

  // Phone is the #1 qualifier
  const hasPhone = !!lead.phone

  // Check for budget signals in message
  const hasBudget = /budget|under \$|\$\d+k|\d{3},000|\d{3}k/.test(msg)

  // Check for city signals
  const hasCitySignal = /west jordan|sandy|draper|herriman|riverton|lehi|provo|orem|ogden|layton|st george|salt lake|murray|taylorsville/.test(msg)

  // Check for timeline signals
  const hasUrgentTimeline = /asap|this month|30 days|60 days|soon|immediately|right away|2-3 months/.test(msg)
  const hasBrowsingSignal = /browsing|just looking|no rush|eventually/.test(msg)

  // Score calculation
  if (hasPhone && (hasBudget || hasCitySignal) && hasUrgentTimeline) return 'hot'
  if (hasPhone && (hasBudget || hasCitySignal)) return 'hot'
  if (hasPhone) return 'warm'
  if (hasBudget && hasCitySignal) return 'warm'
  if (source === 'chatbot' && (hasBudget || hasCitySignal)) return 'warm'
  if (hasBrowsingSignal) return 'cold'
  if (lead.lead_type === 'tour_request' || lead.lead_type === 'call_request') return 'warm'
  if (hasBudget || hasCitySignal) return 'warm'

  return 'cold'
}

function LeadScoreBadge({ score }: { score: LeadScore }) {
  const config = {
    hot: { emoji: '🔥', label: 'HOT', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', color: '#ef4444' },
    warm: { emoji: '☀️', label: 'WARM', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)', color: '#fbbf24' },
    cold: { emoji: '🌱', label: 'COLD', bg: 'rgba(100,116,139,0.12)', border: 'rgba(100,116,139,0.3)', color: '#64748b' },
  }[score]

  return (
    <span style={{
      fontSize: '11px',
      color: config.color,
      background: config.bg,
      border: `1px solid ${config.border}`,
      padding: '3px 8px',
      borderRadius: '100px',
      whiteSpace: 'nowrap',
      fontWeight: '600',
      letterSpacing: '0.05em',
    }}>
      {config.emoji} {config.label}
    </span>
  )
}

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [scoreFilter, setScoreFilter] = useState<'all' | LeadScore>('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Lead | null>(null)
  const [authorized, setAuthorized] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [activeTab, setActiveTab] = useState<'leads' | 'agents' | 'saved'>('leads')
  const [savedProps, setSavedProps] = useState<SavedProp[]>([])
  const [savedLoading, setSavedLoading] = useState(false)

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'gsbrealtor2024'

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthorized(true)
      fetchLeads()
      fetchSaved()
    } else {
      setAuthError('Wrong password')
    }
  }

  const fetchSaved = async () => {
    setSavedLoading(true)
    try {
      const res = await fetch('/api/admin/saved-properties')
      if (res.ok) {
        const data = await res.json()
        setSavedProps(data.saved || [])
      }
    } catch (err) {
      console.error('Failed to fetch saved properties:', err)
    } finally {
      setSavedLoading(false)
    }
  }

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/leads')
      if (res.ok) {
        const data = await res.json()
        setLeads(data.leads || [])
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (leadId: string, newStatus: string) => {
    await fetch(`/api/admin/leads/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l))
    if (selected?.id === leadId) setSelected(prev => prev ? { ...prev, status: newStatus } : null)
  }

  const filteredLeads = leads.filter(lead => {
    const matchesFilter = filter === 'all' || lead.status === filter
    const matchesScore = scoreFilter === 'all' || computeLeadScore(lead) === scoreFilter
    const matchesSearch = !search || [lead.first_name, lead.last_name, lead.email, lead.phone, lead.property_address]
      .join(' ').toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesScore && matchesSearch
  })

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    closed: leads.filter(l => l.status === 'closed').length,
    hot: leads.filter(l => computeLeadScore(l) === 'hot').length,
    warm: leads.filter(l => computeLeadScore(l) === 'warm').length,
  }

  if (!authorized) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '32px', fontWeight: '600', color: '#F5F3EE', marginBottom: '8px' }}>GSB Admin</div>
            <div style={{ fontSize: '13px', color: '#555' }}>Lead management dashboard</div>
          </div>
          <form onSubmit={handleAuth}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password"
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '14px 16px', fontSize: '15px', color: '#F5F3EE', outline: 'none', fontFamily: 'DM Sans, sans-serif' }}
              />
              {authError && <div style={{ marginTop: '8px', fontSize: '13px', color: '#ef4444' }}>{authError}</div>}
            </div>
            <button type="submit" style={{ width: '100%', background: 'linear-gradient(135deg, #C9A84C, #E2C070)', color: '#0A0A0A', fontWeight: '600', fontSize: '15px', padding: '14px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              Enter Dashboard
            </button>
          </form>
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <Link href="/" style={{ color: '#555', fontSize: '13px', textDecoration: 'none' }}>← Back to site</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', fontFamily: 'DM Sans, sans-serif' }}>

      {/* Header */}
      <header style={{ background: '#111', borderBottom: '1px solid rgba(201,168,76,0.15)', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: '600', color: '#F5F3EE' }}>GSB Admin</div>
          <div style={{ fontSize: '11px', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Lead Dashboard</div>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link href="/social" style={{ color: '#C9A84C', textDecoration: 'none', fontSize: '13px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', padding: '6px 12px', borderRadius: '7px' }}>📱 Social Hub</Link>
          <Link href="/" style={{ color: '#888', textDecoration: 'none', fontSize: '13px' }}>← Live Site</Link>
          <a href="tel:8016358462" style={{ color: '#C9A84C', textDecoration: 'none', fontSize: '13px' }}>📞 801.635.8462</a>
        </div>
      </header>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px' }}>

        {/* Tab navigation */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0' }}>
          {([{ key: 'leads', label: '📋 Leads' }, { key: 'agents', label: '🤖 AI Agents' }, { key: 'saved', label: '❤️ Saved' }] as { key: 'leads' | 'agents' | 'saved', label: string }[]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '10px 20px',
                background: 'none',
                border: 'none',
                borderBottom: `2px solid ${activeTab === tab.key ? '#C9A84C' : 'transparent'}`,
                color: activeTab === tab.key ? '#C9A84C' : '#555',
                fontSize: '13px', fontWeight: '600',
                cursor: 'pointer', fontFamily: 'inherit',
                letterSpacing: '0.04em',
                transition: 'all 0.2s',
                marginBottom: '-1px',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Saved Properties tab */}
        {activeTab === 'saved' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <div>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: '300', color: '#F5F3EE', marginBottom: '6px' }}>Saved Properties</h2>
                <p style={{ color: '#555', fontSize: '13px' }}>Properties saved by visitors across all sessions</p>
              </div>
              <button
                onClick={fetchSaved}
                style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#888', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                ↻ Refresh
              </button>
            </div>

            {savedLoading ? (
              <div style={{ padding: '64px', textAlign: 'center', color: '#555' }}>Loading saved properties...</div>
            ) : savedProps.length === 0 ? (
              <div style={{ padding: '64px', textAlign: 'center' }}>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>💔</div>
                <div style={{ color: '#555', fontSize: '15px' }}>No saved properties yet</div>
              </div>
            ) : (
              <div style={{ background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        {['Property', 'Price', 'Beds/Baths', 'Session', 'Saved At', 'Actions'].map(col => (
                          <th key={col} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '500', whiteSpace: 'nowrap' }}>
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {savedProps.map((sp, i) => (
                        <tr
                          key={sp.id}
                          style={{
                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                            background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                          }}
                        >
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontSize: '14px', fontWeight: '500', color: '#F5F3EE' }}>{sp.address || sp.listing_key}</div>
                            {sp.city && <div style={{ fontSize: '12px', color: '#555' }}>{sp.city}, UT</div>}
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: '14px', color: '#C9A84C', whiteSpace: 'nowrap' }}>
                            {sp.list_price ? `$${sp.list_price.toLocaleString()}` : '—'}
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: '13px', color: '#888', whiteSpace: 'nowrap' }}>
                            {sp.bedrooms ? `${sp.bedrooms}bd / ${sp.bathrooms || '?'}ba` : '—'}
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: '11px', color: '#555', maxWidth: '140px' }}>
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {sp.session_id || sp.user_id || '—'}
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: '12px', color: '#555', whiteSpace: 'nowrap' }}>
                            {new Date(sp.saved_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <a
                              href={`/listing/${sp.listing_key}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{ padding: '5px 10px', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '6px', color: '#C9A84C', textDecoration: 'none', fontSize: '12px', whiteSpace: 'nowrap' }}
                            >
                              View →
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI Agents tab */}
        {activeTab === 'agents' && (
          <div>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: '300', color: '#F5F3EE', marginBottom: '6px' }}>AI Agents</h2>
              <p style={{ color: '#555', fontSize: '13px' }}>8 autonomous agents running 24/7 across the platform</p>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px',
            }}>
              {[
                { name: 'Lead Qualifier', icon: '🎯', status: 'Active', platform: 'Groq AI + Vercel', schedule: '24/7 on demand', description: 'Qualifies visitors, scores HOT/WARM/COLD, triggers Telegram alerts for hot leads.' },
                { name: 'Video Generator', icon: '🎬', status: 'Active', platform: 'n8n + HeyGen', schedule: 'On demand', description: 'Generates Gurpreet avatar property tour videos in ~90 seconds from listing data.' },
                { name: 'YouTube Publisher', icon: '▶️', status: 'Active', platform: 'n8n + YouTube API', schedule: 'On demand', description: 'Auto-uploads completed videos to @GSBRealtorUtah with title, description, tags.' },
                { name: 'Daily Lead Report', icon: '📋', status: 'Active', platform: 'Vercel Cron', schedule: 'Daily 5:30 AM MT', description: "Sends yesterday's lead summary to Telegram every morning." },
                { name: 'Site Health Monitor', icon: '🏥', status: 'Active', platform: 'Vercel Cron', schedule: 'Daily 6:00 AM MT', description: 'Checks all 11 pages/APIs and sends green/red Telegram report.' },
                { name: 'Social Content Agent', icon: '📱', status: 'Active', platform: 'Groq + Vercel Cron', schedule: 'Daily 7:00 AM MT', description: 'Generates platform-specific posts for FB, IG, X, TikTok, LinkedIn.' },
                { name: 'Property Search Agent', icon: '🔍', status: 'Active', platform: 'Groq + WFRMLS', schedule: 'On demand', description: 'Parses natural language queries and returns live WFRMLS listings in chat.' },
                { name: 'Email Drip Agent', icon: '✉️', status: 'Active', platform: 'Resend + Vercel', schedule: 'Day 1/3/7/14', description: 'Sends 14-day automated follow-up email sequences to every new lead.' },
              ].map((agent) => (
                <div key={agent.name} style={{
                  padding: '28px',
                  background: '#0D0D0D',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '16px',
                  transition: 'border-color 0.2s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '12px',
                      background: 'rgba(201,168,76,0.08)',
                      border: '1px solid rgba(201,168,76,0.18)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '22px', flexShrink: 0,
                    }}>
                      {agent.icon}
                    </div>
                    <div>
                      <div style={{ color: '#F5F3EE', fontWeight: '600', fontSize: '15px' }}>{agent.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981' }} />
                        <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '600' }}>{agent.status}</span>
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.7', marginBottom: '18px' }}>
                    {agent.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)',
                      color: '#C9A84C', fontSize: '10px', padding: '3px 10px', borderRadius: '20px',
                      letterSpacing: '0.03em',
                    }}>
                      {agent.platform}
                    </span>
                    <span style={{ fontSize: '11px', color: '#444' }}>{agent.schedule}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leads tab */}
        {activeTab === 'leads' && <div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Total Leads', val: stats.total, color: '#F5F3EE' },
            { label: 'New', val: stats.new, color: '#C9A84C' },
            { label: 'Qualified', val: stats.qualified, color: '#4ade80' },
            { label: 'Closed', val: stats.closed, color: '#22c55e' },
            { label: '🔥 Hot Leads', val: stats.hot, color: '#ef4444' },
            { label: '☀️ Warm Leads', val: stats.warm, color: '#fbbf24' },
          ].map(s => (
            <div key={s.label} style={{ padding: '20px 24px', background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px' }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '36px', fontWeight: '600', color: s.color, lineHeight: '1' }}>{s.val}</div>
              <div style={{ fontSize: '12px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '6px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, phone..."
            style={{ flex: '1 1 240px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#F5F3EE', outline: 'none', fontFamily: 'inherit' }}
          />

          {/* Status filter */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {['all', 'new', 'contacted', 'qualified', 'closed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '8px 14px', borderRadius: '8px', fontSize: '13px',
                  background: filter === f ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${filter === f ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.06)'}`,
                  color: filter === f ? '#C9A84C' : '#888',
                  cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize',
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Score filter */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {[
              { key: 'all', label: 'All Scores' },
              { key: 'hot', label: '🔥 Hot' },
              { key: 'warm', label: '☀️ Warm' },
              { key: 'cold', label: '🌱 Cold' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setScoreFilter(f.key as 'all' | LeadScore)}
                style={{
                  padding: '8px 12px', borderRadius: '8px', fontSize: '12px',
                  background: scoreFilter === f.key ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${scoreFilter === f.key ? 'rgba(201,168,76,0.25)' : 'rgba(255,255,255,0.05)'}`,
                  color: scoreFilter === f.key ? '#C9A84C' : '#666',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={fetchLeads}
            style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#888', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            ↻ Refresh
          </button>
        </div>

        {/* Lead table */}
        <div style={{ background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '64px', textAlign: 'center', color: '#555' }}>Loading leads...</div>
          ) : filteredLeads.length === 0 ? (
            <div style={{ padding: '64px', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>📭</div>
              <div style={{ color: '#555', fontSize: '15px' }}>
                {leads.length === 0 ? 'No leads yet — forms are live and ready to capture!' : 'No leads match your filters'}
              </div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {['Name', 'Score', 'Contact', 'Type', 'Property', 'Status', 'Date', 'Actions'].map(col => (
                      <th key={col} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '500', whiteSpace: 'nowrap' }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead, i) => {
                    const score = computeLeadScore(lead)
                    return (
                      <tr
                        key={lead.id}
                        onClick={() => setSelected(lead)}
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          cursor: 'pointer',
                          background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.04)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'}
                      >
                        <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '500', color: '#F5F3EE', whiteSpace: 'nowrap' }}>
                          {lead.first_name} {lead.last_name}
                        </td>
                        <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                          <LeadScoreBadge score={score} />
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontSize: '13px', color: '#888' }}>{lead.email}</div>
                          {lead.phone && <div style={{ fontSize: '12px', color: '#555' }}>{lead.phone}</div>}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ fontSize: '12px', color: '#C9A84C', background: 'rgba(201,168,76,0.08)', padding: '4px 10px', borderRadius: '100px', whiteSpace: 'nowrap' }}>
                            {LEAD_TYPE_LABELS[lead.lead_type] || lead.lead_type}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '13px', color: '#666', maxWidth: '200px' }}>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {lead.property_address || '—'}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ fontSize: '12px', color: STATUS_COLORS[lead.status] || '#888', background: `${STATUS_COLORS[lead.status]}15`, padding: '4px 10px', borderRadius: '100px', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                            {lead.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '12px', color: '#555', whiteSpace: 'nowrap' }}>
                          {new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <a href={`mailto:${lead.email}`} onClick={e => e.stopPropagation()} style={{ padding: '5px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#888', textDecoration: 'none', fontSize: '12px' }}>Email</a>
                            {lead.phone && (
                              <a href={`tel:${lead.phone}`} onClick={e => e.stopPropagation()} style={{ padding: '5px 10px', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '6px', color: '#C9A84C', textDecoration: 'none', fontSize: '12px' }}>Call</a>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Lead detail panel */}
        {selected && (
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(440px, 100vw)',
            background: '#111', borderLeft: '1px solid rgba(201,168,76,0.15)',
            zIndex: 100, overflowY: 'auto', padding: '32px 24px',
            display: 'flex', flexDirection: 'column', gap: '24px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', fontWeight: '400', color: '#F5F3EE' }}>Lead Detail</h2>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: '20px' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Lead score badge in detail panel */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <LeadScoreBadge score={computeLeadScore(selected)} />
                <span style={{ fontSize: '12px', color: '#555' }}>
                  {computeLeadScore(selected) === 'hot' ? 'High priority — respond immediately' :
                   computeLeadScore(selected) === 'warm' ? 'Follow up within 24 hours' :
                   'Nurture with drip campaign'}
                </span>
              </div>

              <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '20px', fontWeight: '600', color: '#F5F3EE', marginBottom: '4px' }}>{selected.first_name} {selected.last_name}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                  <a href={`mailto:${selected.email}`} style={{ color: '#C9A84C', textDecoration: 'none', fontSize: '14px' }}>✉️ {selected.email}</a>
                  {selected.phone && <a href={`tel:${selected.phone}`} style={{ color: '#C9A84C', textDecoration: 'none', fontSize: '14px' }}>📞 {selected.phone}</a>}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Lead Type</div>
                <div style={{ fontSize: '14px', color: '#F5F3EE' }}>{LEAD_TYPE_LABELS[selected.lead_type] || selected.lead_type}</div>
              </div>

              {selected.property_address && (
                <div>
                  <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Property / Area</div>
                  <div style={{ fontSize: '14px', color: '#F5F3EE' }}>{selected.property_address}</div>
                </div>
              )}

              {selected.message && (
                <div>
                  <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Message / Conversation</div>
                  <div style={{ fontSize: '13px', color: '#888', lineHeight: '1.7', whiteSpace: 'pre-wrap', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', maxHeight: '200px', overflowY: 'auto' }}>{selected.message}</div>
                </div>
              )}

              <div>
                <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Source</div>
                <div style={{ fontSize: '14px', color: '#888' }}>{selected.source || 'website'}</div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Received</div>
                <div style={{ fontSize: '14px', color: '#888' }}>{new Date(selected.created_at).toLocaleString('en-US', { timeZone: 'America/Denver', weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })} MT</div>
              </div>

              {/* Status update */}
              <div>
                <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Update Status</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {['new', 'contacted', 'qualified', 'closed', 'dead'].map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected.id, s)}
                      style={{
                        padding: '10px 14px', borderRadius: '8px', fontSize: '13px',
                        background: selected.status === s ? `${STATUS_COLORS[s]}15` : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${selected.status === s ? STATUS_COLORS[s] : 'rgba(255,255,255,0.06)'}`,
                        color: selected.status === s ? STATUS_COLORS[s] : '#888',
                        cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
                <a
                  href={`mailto:${selected.email}?subject=Following up — ${selected.first_name}, let's connect!&body=Hi ${selected.first_name},%0A%0AThank you for reaching out to GSB Realtor. I'd love to connect with you and help with your real estate needs.%0A%0ABest,%0AGurpreet Bhatti%0A801-635-8462`}
                  style={{ display: 'block', textAlign: 'center', padding: '12px', background: 'linear-gradient(135deg, #C9A84C, #E2C070)', color: '#0A0A0A', fontWeight: '600', fontSize: '14px', textDecoration: 'none', borderRadius: '10px' }}
                >
                  ✉️ Send Follow-up Email
                </a>
                {selected.phone && (
                  <a
                    href={`tel:${selected.phone}`}
                    style={{ display: 'block', textAlign: 'center', padding: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#F5F3EE', fontSize: '14px', textDecoration: 'none', borderRadius: '10px' }}
                  >
                    📞 Call {selected.first_name}
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

      </div>}

      </div>
    </div>
  )
}
