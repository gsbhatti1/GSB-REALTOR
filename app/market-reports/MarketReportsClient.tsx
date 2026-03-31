'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function MarketReportsClient() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const reports = [
    {
      id: 'slc-q1-2026',
      title: 'Salt Lake County Q1 2026 Market Report',
      description: 'Median price trends, days on market, list-to-sale ratio, and inventory levels across all Salt Lake County submarkets. 42 pages of actionable data.',
      badge: 'Most Downloaded',
      stats: ['42 pages', 'Updated March 2026', 'SLC metro coverage'],
    },
    {
      id: 'utah-valley-q1-2026',
      title: 'Utah Valley Q1 2026 Market Report',
      description: 'Provo, Orem, Lehi, Saratoga Springs, Eagle Mountain, and American Fork. The fastest-growing corridor in Utah — analyzed in depth.',
      badge: 'High Growth Area',
      stats: ['38 pages', 'Updated March 2026', '8 city breakdowns'],
    },
    {
      id: 'commercial-utah-q1-2026',
      title: 'Commercial Utah Q1 2026 Investment Report',
      description: 'Cap rates, vacancy rates, and absorption data for retail, office, industrial, and multi-family across Utah. Institutional-grade data, free.',
      badge: 'Investor Favorite',
      stats: ['55 pages', 'Updated March 2026', '4 asset classes'],
    },
  ]

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReport) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          lead_type: 'market_report_download',
          source: 'market-report',
          message: `Report requested: ${selectedReport}`,
          first_name: '',
          last_name: '',
        }),
      })
      const data = await res.json()
      if (data.success || res.ok) {
        setSuccess(true)
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main style={{ background: '#0A0A0A', minHeight: '100vh', paddingTop: '72px' }}>

        {/* Hero */}
        <section style={{
          padding: 'clamp(64px, 8vw, 120px) 32px 80px',
          background: 'linear-gradient(135deg, #0A0A0A 0%, #0f0f0f 100%)',
          borderBottom: '1px solid rgba(201,168,76,0.12)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Background grid texture */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(rgba(201,168,76,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            pointerEvents: 'none',
          }} />
          <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '24px' }}>
              Free Market Intelligence
            </div>
            <h1 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(36px, 5.5vw, 72px)',
              fontWeight: '300',
              color: '#F5F3EE',
              lineHeight: '1.05',
              marginBottom: '24px',
            }}>
              Utah Real Estate<br />
              <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>Market Reports</span>
            </h1>
            <p style={{ fontSize: '18px', color: '#888', lineHeight: '1.8', maxWidth: '640px', marginBottom: '16px' }}>
              Free monthly analysis — updated every quarter.
            </p>
            <p style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontStyle: 'italic',
              fontSize: 'clamp(16px, 2vw, 22px)',
              color: '#C9A84C',
            }}>
              &ldquo;Get the same data the big brokerages pay thousands for — free.&rdquo;
            </p>

            {/* Stats bar */}
            <div style={{
              display: 'flex', gap: '40px', flexWrap: 'wrap',
              marginTop: '48px', paddingTop: '32px',
              borderTop: '1px solid rgba(201,168,76,0.12)',
            }}>
              {[
                { value: 'Monthly', label: 'Update Frequency' },
                { value: 'WFRMLS', label: 'Data Source' },
                { value: '500+', label: 'Agents Use This Data' },
                { value: 'Free', label: 'Always' },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', fontWeight: '600', color: '#C9A84C', lineHeight: '1' }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '4px' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Report Cards */}
        <section style={{ padding: '80px 32px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '16px' }}>
                Q1 2026 Reports
              </div>
              <h2 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(28px, 4vw, 48px)',
                fontWeight: '300', color: '#F5F3EE',
              }}>
                Choose Your Report
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {reports.map(report => (
                <div
                  key={report.id}
                  style={{
                    padding: '36px 32px',
                    background: selectedReport === report.id
                      ? 'rgba(201,168,76,0.08)'
                      : 'rgba(255,255,255,0.02)',
                    border: selectedReport === report.id
                      ? '1px solid rgba(201,168,76,0.5)'
                      : '1px solid rgba(201,168,76,0.1)',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                  }}
                  onClick={() => setSelectedReport(report.id)}
                >
                  {/* Badge */}
                  <div style={{
                    position: 'absolute', top: '16px', right: '16px',
                    background: 'rgba(201,168,76,0.15)',
                    border: '1px solid rgba(201,168,76,0.3)',
                    borderRadius: '20px',
                    padding: '4px 12px',
                    fontSize: '11px', color: '#C9A84C',
                    letterSpacing: '0.06em',
                  }}>
                    {report.badge}
                  </div>

                  <div style={{ width: '40px', height: '2px', background: '#C9A84C', marginBottom: '20px' }} />

                  <h3 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '22px', color: '#F5F3EE',
                    marginBottom: '16px', lineHeight: '1.2',
                    paddingRight: '60px',
                  }}>
                    {report.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#777', lineHeight: '1.8', marginBottom: '24px' }}>
                    {report.description}
                  </p>

                  {/* Stats chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                    {report.stats.map(stat => (
                      <span key={stat} style={{
                        padding: '4px 12px',
                        background: 'rgba(255,255,255,0.04)',
                        borderRadius: '4px',
                        fontSize: '12px', color: '#666',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}>
                        {stat}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedReport(report.id) }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      background: selectedReport === report.id
                        ? 'linear-gradient(135deg, #C9A84C, #E2C070)'
                        : 'transparent',
                      border: selectedReport === report.id
                        ? 'none'
                        : '1px solid rgba(201,168,76,0.4)',
                      color: selectedReport === report.id ? '#0A0A0A' : '#C9A84C',
                      padding: '12px 24px', borderRadius: '8px',
                      fontWeight: '600', fontSize: '14px',
                      cursor: 'pointer', letterSpacing: '0.04em',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {selectedReport === report.id ? '✓ Selected' : 'Download Free'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Email Capture Form */}
        <section style={{
          padding: '80px 32px',
          background: 'rgba(201,168,76,0.03)',
          borderTop: '1px solid rgba(201,168,76,0.08)',
          borderBottom: '1px solid rgba(201,168,76,0.08)',
        }}>
          <div style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '16px' }}>
              Instant Download
            </div>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: '300', color: '#F5F3EE',
              marginBottom: '16px',
            }}>
              Enter Your Email to<br />
              <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>Download Instantly</span>
            </h2>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '40px' }}>
              {selectedReport
                ? `You selected: ${reports.find(r => r.id === selectedReport)?.title}`
                : 'Select a report above, then enter your email below.'}
            </p>

            {success ? (
              <div style={{
                textAlign: 'center', padding: '48px 32px',
                background: 'rgba(201,168,76,0.05)',
                border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: '16px',
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                <div style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '24px', color: '#F5F3EE', marginBottom: '12px',
                }}>
                  Check your inbox!
                </div>
                <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.7' }}>
                  Your report is on its way. If you don&apos;t see it in 5 minutes, check your spam folder or call{' '}
                  <a href="tel:8016358462" style={{ color: '#C9A84C' }}>801.635.8462</a>
                </p>
              </div>
            ) : (
              <form onSubmit={handleDownload} style={{
                background: 'rgba(22,22,22,0.8)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '40px',
              }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '12px', color: '#666',
                    display: 'block', marginBottom: '6px',
                    letterSpacing: '0.05em', textAlign: 'left',
                  }}>
                    Email Address *
                  </label>
                  <input
                    className="input-field"
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>

                {error && (
                  <div style={{
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: '8px', padding: '12px',
                    fontSize: '13px', color: '#ef4444', marginBottom: '16px',
                  }}>
                    {error}
                  </div>
                )}

                {!selectedReport && (
                  <div style={{
                    background: 'rgba(201,168,76,0.08)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    borderRadius: '8px', padding: '12px',
                    fontSize: '13px', color: '#C9A84C', marginBottom: '16px',
                  }}>
                    Please select a report above first
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !selectedReport}
                  className="btn-gold"
                  style={{ width: '100%', justifyContent: 'center', opacity: (loading || !selectedReport) ? 0.6 : 1 }}
                >
                  {loading ? 'Sending...' : 'Send Me the Report →'}
                </button>

                <p style={{ fontSize: '11px', color: '#444', textAlign: 'center', marginTop: '12px' }}>
                  No spam. Unsubscribe anytime. Or call directly:{' '}
                  <a href="tel:8016358462" style={{ color: '#C9A84C' }}>801.635.8462</a>
                </p>
              </form>
            )}
          </div>
        </section>

        {/* Trust Stats */}
        <section style={{ padding: '64px 32px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { icon: '📅', text: 'Updated monthly' },
                { icon: '📊', text: 'Based on live WFRMLS data' },
                { icon: '👥', text: '500+ agents use this data' },
              ].map(item => (
                <div key={item.text} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                }}>
                  <span style={{ fontSize: '24px' }}>{item.icon}</span>
                  <span style={{ fontSize: '15px', color: '#888' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{
          padding: '80px 32px',
          background: 'rgba(255,255,255,0.01)',
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}>
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '16px' }}>
                FAQ
              </div>
              <h2 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: '300', color: '#F5F3EE',
              }}>
                Questions About the Reports
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                {
                  q: 'Are these reports really free?',
                  a: 'Yes, completely free. Gurpreet believes informed clients make better decisions — and better clients. No credit card, no subscription. Just enter your email and you receive the report instantly.',
                },
                {
                  q: 'How current is the data?',
                  a: 'Reports are updated quarterly, with key metrics refreshed monthly. All data is sourced directly from WFRMLS (Wasatch Front Regional MLS), the official data source for Utah real estate. This is the same data your agent uses — now available to you directly.',
                },
                {
                  q: 'What is included in each report?',
                  a: 'Each report covers median sale price, average days on market, list-to-sale price ratio, active inventory levels, new listings vs. closed sales, and month-over-month and year-over-year comparisons. Commercial reports also include cap rates, vacancy rates, and absorption rates by asset class.',
                },
              ].map((item, i) => (
                <div
                  key={item.q}
                  style={{
                    padding: '32px 0',
                    borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  }}
                >
                  <h3 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '22px', color: '#F5F3EE',
                    marginBottom: '12px', lineHeight: '1.2',
                  }}>
                    {item.q}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#777', lineHeight: '1.8' }}>{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
