'use client'
import { useState } from 'react'
import Link from 'next/link'

const HARDCODED_TESTIMONIALS = [
  {
    id: '1',
    name: 'Sarah M.',
    city: 'West Jordan',
    rating: 5,
    review: 'Gurpreet made buying my first home completely stress-free. He walked me through every step of the process, explained everything in plain language, and negotiated an amazing deal. I was approved with a VA loan and Gurpreet knew exactly how to navigate the process. I closed on my dream home in 32 days. Could not recommend him more.',
    transaction_type: 'bought',
    date: 'March 2024',
  },
  {
    id: '2',
    name: 'James & Linda T.',
    city: 'Sandy',
    rating: 5,
    review: 'We listed our Sandy home expecting a long wait in a tough market. Gurpreet priced it perfectly, staged it beautifully with professional photos, and we had three offers in under a week — all above asking. We sold for $28,000 over list price. His negotiation skills are exceptional. He treated our family\'s biggest asset like it was his own.',
    transaction_type: 'sold',
    date: 'January 2024',
  },
  {
    id: '3',
    name: 'Marco Rodriguez',
    city: 'Salt Lake City',
    rating: 5,
    review: 'Being able to work with a realtor who communicates clearly and keeps things straightforward was everything for us. Gurpreet helped us find the perfect commercial space for our restaurant expansion — he knew the SLC market cold, understood NNN leases, and got us fantastic terms. A true professional who never wastes your time.',
    transaction_type: 'commercial',
    date: 'November 2023',
  },
  {
    id: '4',
    name: 'David K.',
    city: 'South Jordan',
    rating: 5,
    review: 'I came to Gurpreet looking for an investment property and was immediately impressed by his analytical approach. He ran a full cap rate analysis, modeled cash-on-cash returns, and helped me compare three different duplexes side by side. I bought a property that is already cash-flowing from day one. He thinks like an investor, not just a salesperson.',
    transaction_type: 'invested',
    date: 'October 2023',
  },
  {
    id: '5',
    name: 'The Patel Family',
    city: 'Herriman',
    rating: 5,
    review: 'We relocated from the Bay Area and had to buy a home without being able to visit in person first. Gurpreet did video walkthroughs, answered 100 questions over text at all hours, and represented us as if we were there. We moved into a gorgeous Herriman home and love it. He made a scary long-distance purchase feel completely safe.',
    transaction_type: 'bought',
    date: 'August 2023',
  },
  {
    id: '6',
    name: 'Brandon W.',
    city: 'Murray',
    rating: 5,
    review: 'As a fellow veteran, I wanted to work with someone who understood VA loans inside and out. Gurpreet was perfect — he maximized every benefit I was entitled to, pushed back hard on the seller to cover closing costs, and got me into a great Murray home with zero down. His military background showed in his discipline and follow-through. Semper Fi.',
    transaction_type: 'bought',
    date: 'June 2023',
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: '3px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i <= rating ? '#C9A84C' : 'rgba(201,168,76,0.2)'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  )
}

const TRANSACTION_LABELS: Record<string, string> = {
  bought: 'Home Purchase',
  sold: 'Home Sale',
  invested: 'Investment Property',
  commercial: 'Commercial',
}

export default function TestimonialsClient() {
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: '',
    city: '',
    rating: 5,
    review: '',
    transaction_type: 'bought',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSubmitSuccess(true)
        setForm({ name: '', city: '', rating: 5, review: '', transaction_type: 'bought' })
      } else {
        const data = await res.json()
        setSubmitError(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setSubmitError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const avgRating = HARDCODED_TESTIMONIALS.reduce((sum, t) => sum + t.rating, 0) / HARDCODED_TESTIMONIALS.length

  return (
    <>
      {/* Hero */}
      <section style={{
        padding: 'clamp(64px, 8vw, 100px) 32px 64px',
        background: 'linear-gradient(135deg, #0A0A0A 0%, #0f0f0f 100%)',
        borderBottom: '1px solid rgba(201,168,76,0.12)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(201,168,76,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '20px' }}>
            Client Reviews
          </div>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(36px, 5vw, 72px)',
            fontWeight: '300', color: '#F5F3EE',
            lineHeight: '1.05', marginBottom: '16px',
          }}>
            What Our Clients Say
          </h1>

          {/* Aggregate rating */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
            <StarRating rating={Math.round(avgRating)} />
            <span style={{ color: '#C9A84C', fontSize: '22px', fontFamily: 'Cormorant Garamond, serif', fontWeight: '600' }}>
              {avgRating.toFixed(1)}
            </span>
            <span style={{ color: '#666', fontSize: '14px' }}>
              ({HARDCODED_TESTIMONIALS.length} reviews)
            </span>
          </div>

          <p style={{ color: '#888', fontSize: '15px', maxWidth: '500px', margin: '0 auto 32px', lineHeight: '1.7' }}>
            Real stories from buyers, sellers, and investors across Utah.
            Gurpreet Bhatti — REALTOR®, USMC Veteran.
          </p>

          {/* Google Reviews link */}
          <a
            href="https://www.google.com/maps/search/Gurpreet+Bhatti+Realtor+Utah"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '10px 24px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#888', textDecoration: 'none', fontSize: '13px',
              transition: 'border-color 0.2s',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            See us on Google Reviews
          </a>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section style={{ padding: '80px 32px', background: '#0A0A0A' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '28px' }}>
            {HARDCODED_TESTIMONIALS.map(t => (
              <div key={t.id} style={{
                padding: '32px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(201,168,76,0.12)',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                transition: 'border-color 0.2s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <StarRating rating={t.rating} />
                  <span style={{
                    fontSize: '11px', color: '#555',
                    background: 'rgba(201,168,76,0.07)',
                    border: '1px solid rgba(201,168,76,0.15)',
                    borderRadius: '4px', padding: '3px 8px',
                    letterSpacing: '0.04em',
                  }}>
                    {TRANSACTION_LABELS[t.transaction_type] || t.transaction_type}
                  </span>
                </div>

                <blockquote style={{
                  fontSize: '14px', color: 'rgba(245,243,238,0.72)',
                  lineHeight: '1.8', margin: 0,
                  fontStyle: 'italic',
                }}>
                  &ldquo;{t.review}&rdquo;
                </blockquote>

                <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontWeight: '600', color: '#F5F3EE', fontSize: '14px' }}>{t.name}</div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                    {t.city} · {t.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Submit Review */}
      <section style={{
        padding: '80px 32px',
        background: '#0D0D0D',
        borderTop: '1px solid rgba(201,168,76,0.1)',
      }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '16px' }}>
              Share Your Experience
            </div>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(28px, 3.5vw, 44px)',
              fontWeight: '300', color: '#F5F3EE',
            }}>
              Submit Your Review
            </h2>
            <p style={{ color: '#666', fontSize: '14px', marginTop: '12px', lineHeight: '1.7' }}>
              Worked with Gurpreet? We&apos;d love to hear about your experience. Reviews are reviewed before being published.
            </p>
          </div>

          {submitSuccess ? (
            <div style={{
              padding: '32px',
              background: 'rgba(201,168,76,0.06)',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: '16px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>🌟</div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', color: '#F5F3EE', marginBottom: '8px' }}>
                Thank You!
              </h3>
              <p style={{ color: '#888', fontSize: '14px' }}>
                Your review has been submitted and will appear after a quick review. We appreciate your feedback!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{
              display: 'flex', flexDirection: 'column', gap: '20px',
              padding: '40px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(201,168,76,0.12)',
              borderRadius: '16px',
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px', letterSpacing: '0.04em' }}>
                    Your Name *
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Jane D."
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#F5F3EE', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px', letterSpacing: '0.04em' }}>
                    City
                  </label>
                  <input
                    value={form.city}
                    onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    placeholder="Salt Lake City"
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#F5F3EE', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px', letterSpacing: '0.04em' }}>
                  Transaction Type
                </label>
                <select
                  value={form.transaction_type}
                  onChange={e => setForm(f => ({ ...f, transaction_type: e.target.value }))}
                  style={{ width: '100%', background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#F5F3EE', outline: 'none', fontFamily: 'inherit' }}
                >
                  <option value="bought">Home Purchase</option>
                  <option value="sold">Home Sale</option>
                  <option value="invested">Investment Property</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '10px', letterSpacing: '0.04em' }}>
                  Rating *
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, rating: star }))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill={star <= form.rating ? '#C9A84C' : 'rgba(201,168,76,0.2)'}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px', letterSpacing: '0.04em' }}>
                  Your Review *
                </label>
                <textarea
                  required
                  value={form.review}
                  onChange={e => setForm(f => ({ ...f, review: e.target.value }))}
                  placeholder="Share your experience working with Gurpreet..."
                  rows={5}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#F5F3EE', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>

              {submitError && (
                <div style={{ color: '#e55', fontSize: '13px', padding: '10px 14px', background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.2)', borderRadius: '8px' }}>
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: submitting ? 'rgba(201,168,76,0.4)' : 'linear-gradient(135deg, #C9A84C, #E2C070)',
                  border: 'none', borderRadius: '8px', padding: '14px 28px',
                  fontSize: '14px', fontWeight: '600', color: '#0A0A0A',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit', letterSpacing: '0.04em',
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Review →'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{
        padding: '64px 32px',
        background: '#0A0A0A',
        borderTop: '1px solid rgba(201,168,76,0.1)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: '300', color: '#F5F3EE', marginBottom: '16px' }}>
            Ready to Write Your Own Story?
          </h3>
          <p style={{ color: '#888', fontSize: '15px', lineHeight: '1.7', marginBottom: '32px' }}>
            Join hundreds of Utah families who found their dream home, sold for top dollar, or built lasting wealth through real estate with Gurpreet Bhatti.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/search" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
              color: '#0A0A0A', fontWeight: '600', fontSize: '14px',
              padding: '14px 28px', borderRadius: '8px',
              textDecoration: 'none', letterSpacing: '0.04em',
            }}>
              Search Utah Homes →
            </Link>
            <a href="tel:8016358462" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'transparent',
              color: 'rgba(245,243,238,0.8)', fontSize: '14px',
              padding: '14px 28px', borderRadius: '8px',
              textDecoration: 'none', letterSpacing: '0.04em',
              border: '1px solid rgba(255,255,255,0.15)',
            }}>
              📞 801.635.8462
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
