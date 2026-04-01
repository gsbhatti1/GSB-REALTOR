'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface UserProfile {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
    role?: string
  }
}

interface SavedProperty {
  listingKey: string
  address: string
  price: number
  beds: number
  baths: number
  sqft: number
  savedAt: string
  city: string
}

const CONTACT_HISTORY = [
  { date: 'Mar 15, 2024', type: 'Phone Consultation', notes: 'Discussed budget and preferred neighborhoods in Salt Lake County.' },
  { date: 'Feb 28, 2024', type: 'Property Tour', notes: 'Toured 3 homes in West Jordan and Sandy.' },
]

export default function AccountClient() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([])
  const [alertEmail, setAlertEmail] = useState('')
  const [alertSet, setAlertSet] = useState(false)
  const [activeTab, setActiveTab] = useState<'saved' | 'alerts' | 'history'>('saved')
  const router = useRouter()

  useEffect(() => {
    // Check for stored session
    try {
      const storedUser = localStorage.getItem('gsb_user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      } else {
        // No session — redirect to login
        router.push('/login')
        return
      }

      // Load saved properties from localStorage
      const stored = localStorage.getItem('gsb_saved_properties')
      if (stored) {
        setSavedProperties(JSON.parse(stored))
      }
    } catch {
      router.push('/login')
    }
  }, [router])

  function handleSignOut() {
    localStorage.removeItem('gsb_session')
    localStorage.removeItem('gsb_user')
    router.push('/')
  }

  function removeSaved(listingKey: string) {
    const updated = savedProperties.filter(p => p.listingKey !== listingKey)
    setSavedProperties(updated)
    localStorage.setItem('gsb_saved_properties', JSON.stringify(updated))
  }

  function setAlert(e: React.FormEvent) {
    e.preventDefault()
    setAlertSet(true)
    setAlertEmail('')
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there'

  if (!user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ color: '#666', fontSize: '14px' }}>Loading...</div>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <section style={{
        padding: 'clamp(48px, 6vw, 80px) 32px 48px',
        background: 'linear-gradient(135deg, #0A0A0A 0%, #0f0f0f 100%)',
        borderBottom: '1px solid rgba(201,168,76,0.12)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '12px' }}>
              Client Dashboard
            </div>
            <h1 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: '300', color: '#F5F3EE',
              marginBottom: '8px',
            }}>
              Welcome back, {displayName}
            </h1>
            <p style={{ color: '#666', fontSize: '14px' }}>{user.email}</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link href="/search" style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
              color: '#0A0A0A', fontWeight: '600', fontSize: '13px',
              padding: '10px 20px', borderRadius: '8px', textDecoration: 'none',
              letterSpacing: '0.04em',
            }}>
              Search Homes
            </Link>
            <button
              onClick={handleSignOut}
              style={{
                background: 'none',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '10px 20px',
                color: '#666',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{
        padding: '0 32px',
        background: '#0A0A0A',
        borderBottom: '1px solid rgba(201,168,76,0.08)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '0' }}>
          {[
            { label: 'Saved Properties', value: savedProperties.length },
            { label: 'Active Alerts', value: alertSet ? 1 : 0 },
            { label: 'Contact History', value: CONTACT_HISTORY.length },
          ].map((stat, i) => (
            <div key={stat.label} style={{
              padding: '24px 32px',
              borderRight: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              flex: 1,
            }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: '600', color: '#C9A84C', lineHeight: '1' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '12px', color: '#555', marginTop: '4px', letterSpacing: '0.04em' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tab navigation */}
      <section style={{ padding: '0 32px', background: '#0A0A0A', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '0' }}>
          {[
            { key: 'saved', label: '❤️ Saved Properties' },
            { key: 'alerts', label: '🔔 Listing Alerts' },
            { key: 'history', label: '📋 Contact History' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.key ? '2px solid #C9A84C' : '2px solid transparent',
                padding: '16px 24px',
                color: activeTab === tab.key ? '#C9A84C' : '#555',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'inherit',
                letterSpacing: '0.04em',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Tab content */}
      <section style={{ padding: '48px 32px', background: '#0A0A0A', minHeight: '400px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* Saved Properties */}
          {activeTab === 'saved' && (
            <div>
              {savedProperties.length === 0 ? (
                <div style={{
                  textAlign: 'center', padding: '64px 32px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '16px',
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', color: '#F5F3EE', marginBottom: '8px' }}>
                    No Saved Properties Yet
                  </h3>
                  <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>
                    Browse listings and save the homes you love. They&apos;ll appear here for easy comparison.
                  </p>
                  <Link href="/search" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
                    color: '#0A0A0A', fontWeight: '600', fontSize: '14px',
                    padding: '12px 24px', borderRadius: '8px', textDecoration: 'none',
                  }}>
                    Browse Listings →
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                  {savedProperties.map(p => (
                    <div key={p.listingKey} style={{
                      padding: '24px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(201,168,76,0.1)',
                      borderRadius: '12px',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <div style={{ fontSize: '18px', fontWeight: '600', color: '#C9A84C', fontFamily: 'Cormorant Garamond, serif' }}>
                            ${p.price?.toLocaleString()}
                          </div>
                          <div style={{ fontSize: '13px', color: '#888', marginTop: '2px' }}>{p.address}</div>
                          <div style={{ fontSize: '12px', color: '#555' }}>{p.city}</div>
                        </div>
                        <button
                          onClick={() => removeSaved(p.listingKey)}
                          style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: '18px', padding: '4px' }}
                          title="Remove"
                        >
                          ×
                        </button>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#666', marginBottom: '16px' }}>
                        <span>{p.beds} bed</span>
                        <span>{p.baths} bath</span>
                        <span>{p.sqft?.toLocaleString()} sqft</span>
                      </div>
                      <Link href={`/listing/${p.listingKey}`} style={{
                        display: 'inline-block',
                        color: '#C9A84C', textDecoration: 'none',
                        fontSize: '12px', fontWeight: '600', letterSpacing: '0.04em',
                      }}>
                        View Listing →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Listing Alerts */}
          {activeTab === 'alerts' && (
            <div style={{ maxWidth: '560px' }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: '300', color: '#F5F3EE', marginBottom: '8px' }}>
                Listing Alerts
              </h2>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '32px', lineHeight: '1.7' }}>
                Get notified by email when new homes match your search criteria. Never miss a listing.
              </p>

              {alertSet ? (
                <div style={{
                  padding: '24px',
                  background: 'rgba(201,168,76,0.06)',
                  border: '1px solid rgba(201,168,76,0.25)',
                  borderRadius: '12px',
                }}>
                  <div style={{ color: '#C9A84C', fontWeight: '600', marginBottom: '4px' }}>✓ Alert Active</div>
                  <div style={{ color: '#888', fontSize: '14px' }}>
                    You&apos;ll receive email notifications when new listings match your saved search criteria.
                  </div>
                </div>
              ) : (
                <form onSubmit={setAlert} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px', letterSpacing: '0.04em' }}>
                      Notification Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder={user.email}
                      value={alertEmail}
                      onChange={e => setAlertEmail(e.target.value)}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 16px', fontSize: '14px', color: '#F5F3EE', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Alert criteria based on your recent searches:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {['Utah', 'Under $600K', '3+ beds', 'Single Family'].map(tag => (
                        <span key={tag} style={{
                          padding: '4px 10px',
                          background: 'rgba(201,168,76,0.08)',
                          border: '1px solid rgba(201,168,76,0.2)',
                          borderRadius: '4px',
                          fontSize: '12px', color: '#C9A84C',
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    type="submit"
                    style={{
                      background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
                      border: 'none', borderRadius: '8px', padding: '12px 24px',
                      fontSize: '14px', fontWeight: '600', color: '#0A0A0A',
                      cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.04em',
                    }}
                  >
                    Enable Listing Alerts →
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Contact History */}
          {activeTab === 'history' && (
            <div style={{ maxWidth: '640px' }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: '300', color: '#F5F3EE', marginBottom: '8px' }}>
                Contact History
              </h2>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '32px', lineHeight: '1.7' }}>
                Your communication history with Gurpreet Bhatti.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                {CONTACT_HISTORY.map((item, i) => (
                  <div key={i} style={{
                    padding: '20px 24px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '12px',
                    display: 'flex', gap: '16px',
                  }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#C9A84C', marginTop: '5px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#C9A84C', marginBottom: '4px' }}>{item.type}</div>
                      <div style={{ fontSize: '12px', color: '#555', marginBottom: '8px' }}>{item.date}</div>
                      <div style={{ fontSize: '13px', color: '#888', lineHeight: '1.6' }}>{item.notes}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                padding: '24px',
                background: 'rgba(201,168,76,0.04)',
                border: '1px solid rgba(201,168,76,0.15)',
                borderRadius: '12px',
              }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', color: '#F5F3EE', marginBottom: '8px' }}>
                  Ready to talk?
                </div>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>
                  Gurpreet responds in under 1 hour. No robots, no assistants.
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <a href="tel:8016358462" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
                    color: '#0A0A0A', fontWeight: '600', fontSize: '13px',
                    padding: '10px 20px', borderRadius: '8px', textDecoration: 'none',
                  }}>
                    📞 801.635.8462
                  </a>
                  <Link href="/contact" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    background: 'transparent',
                    border: '1px solid rgba(201,168,76,0.3)',
                    color: '#C9A84C', fontSize: '13px',
                    padding: '10px 20px', borderRadius: '8px', textDecoration: 'none',
                  }}>
                    Send Message
                  </Link>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>
    </>
  )
}
