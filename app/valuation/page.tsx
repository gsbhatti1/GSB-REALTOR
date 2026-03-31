'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import type { Metadata } from 'next'

// Note: metadata must be in a server component — for SEO use generateMetadata or a wrapper
// This page's title/description is set via layout

export default function ValuationPage() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    address: '',
    city: '',
    zip: '84084',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    yearBuilt: '',
    condition: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    timeline: '',
    notes: '',
  })

  const update = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          phone: form.phone,
          lead_type: 'market_report',
          message: `HOME VALUATION REQUEST\n\nProperty: ${form.address}, ${form.city}, UT ${form.zip}\nBeds: ${form.bedrooms} | Baths: ${form.bathrooms} | Sq Ft: ${form.sqft}\nYear Built: ${form.yearBuilt} | Condition: ${form.condition}\nSelling Timeline: ${form.timeline}\nNotes: ${form.notes}`,
          source: 'valuation_page',
        }),
      })
      setSubmitted(true)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '14px 16px',
    fontSize: '15px',
    color: '#F5F3EE',
    outline: 'none',
    fontFamily: 'DM Sans, sans-serif',
    transition: 'border-color 0.2s',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '8px',
  }

  const UTAH_CITIES = [
    'Salt Lake City', 'West Jordan', 'Sandy', 'South Jordan', 'Taylorsville',
    'Murray', 'Provo', 'Orem', 'Ogden', 'Layton', 'St. George', 'Logan',
    'Draper', 'Herriman', 'Riverton', 'Lehi', 'West Valley City', 'Millcreek',
    'Cottonwood Heights', 'Midvale', 'Bountiful', 'Holladay', 'Magna', 'Roy',
  ]

  return (
    <>
      <Navbar />
      <style>{`
        @media (max-width: 600px) {
          .val-two-col { grid-template-columns: 1fr !important; }
          .val-four-col { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
      <main style={{ paddingTop: '72px', background: '#0A0A0A', minHeight: '100vh' }}>

        {/* Hero */}
        <section style={{
          padding: 'clamp(60px, 8vw, 96px) 32px',
          background: 'linear-gradient(180deg, #0D0D0D 0%, #0A0A0A 100%)',
          borderBottom: '1px solid rgba(201,168,76,0.12)',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              marginBottom: '28px',
              background: 'rgba(201,168,76,0.08)',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: '100px',
              padding: '8px 20px',
            }}>
              <span style={{ width: '6px', height: '6px', background: '#4ade80', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 8px #4ade80' }} />
              <span style={{ fontSize: '12px', color: '#C9A84C', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Free — No Obligation
              </span>
            </div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(36px, 5vw, 68px)', fontWeight: '300', color: '#F5F3EE', lineHeight: '1.0', marginBottom: '8px' }}>
              What Is Your
            </h1>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(36px, 5vw, 68px)', fontWeight: '600', fontStyle: 'italic', background: 'linear-gradient(135deg, #C9A84C, #E2C070)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: '1.05', marginBottom: '28px' }}>
              Utah Home Worth?
            </h1>
            <p style={{ fontSize: '16px', color: '#888', lineHeight: '1.8', maxWidth: '560px', margin: '0 auto 40px' }}>
              Get a free, honest home valuation from Gurpreet Bhatti — a number based on
              real data, not what you want to hear. No pressure. No spam. Just facts.
            </p>
            {/* Stats */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
              {[
                { val: '+340%', label: 'More Seller Leads' },
                { val: '< 1 Hr', label: 'Response Time' },
                { val: '100%', label: 'Free, No Strings' },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '32px', fontWeight: '600', color: '#C9A84C' }}>{s.val}</div>
                  <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '4px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form */}
        <section style={{ padding: '80px 32px' }}>
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>

            {submitted ? (
              /* ── SUCCESS STATE ── */
              <div style={{
                padding: '64px 48px',
                background: 'rgba(74,222,128,0.04)',
                border: '1px solid rgba(74,222,128,0.2)',
                borderRadius: '20px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '56px', marginBottom: '24px' }}>🏠</div>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '36px', fontWeight: '400', color: '#F5F3EE', marginBottom: '16px' }}>
                  Got It — Gurpreet Is On It
                </h2>
                <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.8', marginBottom: '32px' }}>
                  He will personally review your property details and send you
                  a full market analysis within the hour. No bot. No assistant. Just Gurpreet.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                  <a href="tel:8016358462" style={{ color: '#C9A84C', fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', textDecoration: 'none' }}>
                    📞 801.635.8462
                  </a>
                  <p style={{ fontSize: '12px', color: '#555' }}>Or wait — he will reach out to you first.</p>
                </div>
              </div>
            ) : (
              /* ── FORM ── */
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '20px',
                padding: 'clamp(32px, 5vw, 56px)',
              }}>
                {/* Step indicators */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '40px' }}>
                  {[1, 2, 3].map(s => (
                    <div key={s} style={{ flex: 1, height: '3px', borderRadius: '2px', background: s <= step ? 'linear-gradient(90deg, #C9A84C, #E2C070)' : 'rgba(255,255,255,0.08)', transition: 'background 0.3s' }} />
                  ))}
                </div>

                <form onSubmit={handleSubmit}>

                  {/* STEP 1 — Property Details */}
                  {step === 1 && (
                    <div>
                      <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: '400', color: '#F5F3EE', marginBottom: '8px' }}>
                        Tell me about your property
                      </h2>
                      <p style={{ fontSize: '14px', color: '#666', marginBottom: '32px' }}>Step 1 of 3 — basic property info</p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                          <label style={labelStyle}>Street Address *</label>
                          <input required value={form.address} onChange={e => update('address', e.target.value)} placeholder="e.g. 1234 Oak Lane" style={inputStyle} />
                        </div>
                        <div className="val-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div>
                            <label style={labelStyle}>City *</label>
                            <select required value={form.city} onChange={e => update('city', e.target.value)} style={inputStyle}>
                              <option value="">Select city...</option>
                              {UTAH_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                          <div>
                            <label style={labelStyle}>ZIP Code *</label>
                            <input required value={form.zip} onChange={e => update('zip', e.target.value)} placeholder="84084" maxLength={5} style={inputStyle} />
                          </div>
                        </div>
                        <div className="val-four-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                          <div>
                            <label style={labelStyle}>Beds</label>
                            <select value={form.bedrooms} onChange={e => update('bedrooms', e.target.value)} style={inputStyle}>
                              <option value="">Any</option>
                              {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                          </div>
                          <div>
                            <label style={labelStyle}>Baths</label>
                            <select value={form.bathrooms} onChange={e => update('bathrooms', e.target.value)} style={inputStyle}>
                              <option value="">Any</option>
                              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                          </div>
                          <div>
                            <label style={labelStyle}>Sq Ft</label>
                            <input value={form.sqft} onChange={e => update('sqft', e.target.value)} placeholder="2,000" style={inputStyle} />
                          </div>
                          <div>
                            <label style={labelStyle}>Year Built</label>
                            <input value={form.yearBuilt} onChange={e => update('yearBuilt', e.target.value)} placeholder="2005" maxLength={4} style={inputStyle} />
                          </div>
                        </div>
                        <div>
                          <label style={labelStyle}>Property Condition</label>
                          <select value={form.condition} onChange={e => update('condition', e.target.value)} style={inputStyle}>
                            <option value="">Select condition...</option>
                            <option value="Excellent">Excellent — Like new, fully updated</option>
                            <option value="Good">Good — Well maintained, minor updates needed</option>
                            <option value="Average">Average — Standard condition</option>
                            <option value="Fair">Fair — Needs some work</option>
                            <option value="Needs Work">Needs Work — Fixer upper / investor special</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        style={{
                          marginTop: '32px', width: '100%',
                          background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
                          color: '#0A0A0A',
                          fontWeight: '600', fontSize: '15px',
                          padding: '16px', borderRadius: '10px',
                          border: 'none', cursor: 'pointer',
                          fontFamily: 'inherit', letterSpacing: '0.04em',
                          transition: 'all 0.2s',
                        }}
                      >
                        Continue →
                      </button>
                    </div>
                  )}

                  {/* STEP 2 — Selling Timeline */}
                  {step === 2 && (
                    <div>
                      <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: '400', color: '#F5F3EE', marginBottom: '8px' }}>
                        What is your timeline?
                      </h2>
                      <p style={{ fontSize: '14px', color: '#666', marginBottom: '32px' }}>Step 2 of 3 — helps Gurpreet prioritize your valuation</p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                        {[
                          { val: 'ASAP — ready to list now', label: 'ASAP', sub: 'Ready to list immediately' },
                          { val: '1-3 months', label: '1–3 Months', sub: 'Planning to sell soon' },
                          { val: '3-6 months', label: '3–6 Months', sub: 'Getting a sense of value' },
                          { val: '6-12 months', label: '6–12 Months', sub: 'Early research stage' },
                          { val: 'Just curious', label: 'Just Curious', sub: 'Not actively planning to sell' },
                        ].map(option => (
                          <button
                            key={option.val}
                            type="button"
                            onClick={() => { update('timeline', option.val); setStep(3) }}
                            style={{
                              padding: '16px 20px',
                              background: form.timeline === option.val ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.02)',
                              border: `1px solid ${form.timeline === option.val ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.07)'}`,
                              borderRadius: '10px', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.15s',
                            }}
                          >
                            <div>
                              <div style={{ fontSize: '15px', fontWeight: '500', color: '#F5F3EE', marginBottom: '2px' }}>{option.label}</div>
                              <div style={{ fontSize: '12px', color: '#666' }}>{option.sub}</div>
                            </div>
                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${form.timeline === option.val ? '#C9A84C' : 'rgba(255,255,255,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              {form.timeline === option.val && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#C9A84C' }} />}
                            </div>
                          </button>
                        ))}
                      </div>

                      <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit', padding: '8px 0' }}>
                        ← Back
                      </button>
                    </div>
                  )}

                  {/* STEP 3 — Contact Info */}
                  {step === 3 && (
                    <div>
                      <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: '400', color: '#F5F3EE', marginBottom: '8px' }}>
                        Where should Gurpreet send it?
                      </h2>
                      <p style={{ fontSize: '14px', color: '#666', marginBottom: '32px' }}>Step 3 of 3 — your contact info</p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="val-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div>
                            <label style={labelStyle}>First Name *</label>
                            <input required value={form.firstName} onChange={e => update('firstName', e.target.value)} placeholder="Gurpreet" style={inputStyle} />
                          </div>
                          <div>
                            <label style={labelStyle}>Last Name *</label>
                            <input required value={form.lastName} onChange={e => update('lastName', e.target.value)} placeholder="Bhatti" style={inputStyle} />
                          </div>
                        </div>
                        <div>
                          <label style={labelStyle}>Email Address *</label>
                          <input required type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@email.com" style={inputStyle} />
                        </div>
                        <div>
                          <label style={labelStyle}>Phone Number</label>
                          <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="801-555-5555" style={inputStyle} />
                        </div>
                        <div>
                          <label style={labelStyle}>Anything else Gurpreet should know?</label>
                          <textarea value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Unique features, recent upgrades, HOA info..." rows={3} style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading || !form.firstName || !form.email}
                        style={{
                          marginTop: '32px', width: '100%',
                          background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
                          color: '#0A0A0A', fontWeight: '700', fontSize: '15px',
                          padding: '18px', borderRadius: '10px',
                          border: 'none', cursor: loading ? 'wait' : 'pointer',
                          fontFamily: 'inherit', letterSpacing: '0.04em',
                          opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s',
                        }}
                      >
                        {loading ? 'Sending...' : 'Get My Free Home Value →'}
                      </button>

                      <p style={{ marginTop: '16px', fontSize: '12px', color: '#444', textAlign: 'center' }}>
                        Zero spam. Gurpreet personally responds — usually within the hour.
                      </p>

                      <button type="button" onClick={() => setStep(2)} style={{ display: 'block', margin: '12px auto 0', background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit', padding: '8px 0' }}>
                        ← Back
                      </button>
                    </div>
                  )}

                </form>
              </div>
            )}

            {/* Trust signals */}
            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
              {[
                '🎖️ USMC Veteran',
                '🔒 100% Free',
                '⚡ Responds in < 1hr',
                '📍 Utah Expert',
              ].map(s => (
                <div key={s} style={{ fontSize: '13px', color: '#555' }}>{s}</div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
