'use client'
import { useState } from 'react'
import Link from 'next/link'

const TESTIMONIALS = [
  {
    id: '1',
    name: 'Sarah M.',
    location: 'West Jordan, UT',
    type: 'First-Time Buyer',
    rating: 5,
    date: 'March 2024',
    photo: null,
    story:
      "I was terrified of buying my first home. Gurpreet walked me through every step — the pre-approval, the inspection, the negotiations — without making me feel stupid for not knowing things. He found me a home in Taylorsville under my budget with a 3-car garage I didn't even think I could afford. He responded to my texts at 10pm and never once made me feel like a small client. I referred him to my sister the week after closing.",
    highlight: 'Responded at 10pm. Never made me feel small.',
    language: 'en',
    featured: true,
  },
  {
    id: '2',
    name: 'Carlos & Maria R.',
    location: 'West Valley City, UT',
    type: 'Spanish-Speaking Buyers',
    rating: 5,
    date: 'October 2024',
    photo: null,
    story:
      'Llevábamos meses buscando agente que hablara español y entendiera nuestra situación. Gurpreet nos atendió en español desde el primer día. Encontró la casa perfecta en West Valley — 4 habitaciones, cerca de la escuela de nuestros hijos. Explicó todo el proceso con paciencia y honestidad. Para nuestra familia, fue el mejor regalo del año.',
    highlight: 'Nos atendió en español desde el primer día.',
    language: 'es',
    featured: false,
  },
  {
    id: '3',
    name: 'David K.',
    location: 'South Jordan, UT',
    type: 'Commercial Investor',
    rating: 5,
    date: 'September 2023',
    photo: null,
    story:
      "I was looking for a NNN property with a solid tenant and a cap rate above 6%. Gurpreet didn't try to sell me something just to close — he actually talked me OUT of two deals that looked good on paper but had lease issues I hadn't caught. The deal he helped me close on South Jordan office condos was exactly what I needed. That level of honesty is rare. I've sent him two other investor friends since.",
    highlight: 'He talked me OUT of two bad deals. That honesty is rare.',
    language: 'en',
    featured: false,
  },
  {
    id: '4',
    name: 'The Patel Family',
    location: 'Herriman, UT',
    type: 'Relocation from California',
    rating: 5,
    date: 'July 2024',
    photo: null,
    story:
      "We relocated from the Bay Area and didn't know Utah at all. Gurpreet spent three hours on a Zoom call with us before we ever flew out — explaining neighborhoods, school districts, commute times, the HOA differences. When we arrived for our tour weekend, he had 8 homes lined up that perfectly matched what we'd discussed. We made an offer on the second home we saw. Closed in 28 days. He made a stressful move feel manageable.",
    highlight: '8 homes lined up that perfectly matched what we discussed.',
    language: 'en',
    featured: false,
  },
  {
    id: '5',
    name: 'Brandon W.',
    location: 'Murray, UT',
    type: 'VA Loan Buyer',
    rating: 5,
    date: 'February 2024',
    photo: null,
    story:
      "As a fellow veteran, I wanted to work with someone who understood what it means to use a VA loan without judgment. Gurpreet not only knew the VA process cold — he found sellers who were willing to work with VA financing in a competitive market. He's a Marine. He knows what it means to be prepared and to never quit. I trusted him with the biggest purchase of my life. He delivered.",
    highlight: "He's a Marine. He knows what it means to never quit.",
    language: 'en',
    featured: false,
  },
  {
    id: '6',
    name: 'Linda & James T.',
    location: 'Sandy, UT',
    type: 'Sellers',
    rating: 5,
    date: 'July 2023',
    photo: null,
    story:
      "We were nervous about pricing our home — we'd heard horror stories about agents inflating prices to win the listing then reducing later. Gurpreet gave us a number that was lower than two other agents quoted. We almost went with someone else. He explained why: 'Price it right and you'll get multiple offers. Price it high and you'll sit.' We listed on a Thursday, had 11 showings over the weekend, and accepted an offer $22,000 over asking on Monday. Gurpreet was right.",
    highlight: '11 showings over the weekend. Accepted $22K over asking.',
    language: 'en',
    featured: false,
  },
  {
    id: '7',
    name: 'Simranjit S.',
    location: 'West Jordan, UT',
    type: 'Punjabi-Speaking Buyer',
    rating: 5,
    date: 'November 2024',
    photo: null,
    story:
      'ਗੁਰਪ੍ਰੀਤ ਜੀ ਨੇ ਸਾਡੀ ਬਹੁਤ ਮਦਦ ਕੀਤੀ। ਉਹਨਾਂ ਨੇ ਪੰਜਾਬੀ ਵਿੱਚ ਸਾਰੀ ਗੱਲਬਾਤ ਕੀਤੀ ਅਤੇ ਸਾਨੂੰ ਪੂਰੀ ਪ੍ਰਕਿਰਿਆ ਸਮਝਾਈ। West Jordan ਵਿੱਚ ਸਾਡਾ ਘਰ ਮਿਲਿਆ ਅਤੇ ਅਸੀਂ ਬਹੁਤ ਖੁਸ਼ ਹਾਂ। ਉਹ ਸੱਚਮੁੱਚ ਸਾਡੇ ਭਾਈਚਾਰੇ ਦੀ ਪਰਵਾਹ ਕਰਦੇ ਹਨ।',
    highlight: 'ਪੰਜਾਬੀ ਵਿੱਚ ਸੇਵਾ ਕੀਤੀ। ਸਾਡੇ ਭਾਈਚਾਰੇ ਦੀ ਪਰਵਾਹ ਕਰਦੇ ਹਨ।',
    language: 'pa',
    featured: false,
  },
  {
    id: '8',
    name: 'Michael H.',
    location: 'Bluffdale, UT',
    type: 'Luxury Buyer',
    rating: 5,
    date: 'August 2023',
    photo: null,
    story:
      "We purchased a $2.75M home in Bluffdale and needed an agent who could operate at that level without being intimidated by the price. Gurpreet negotiated with confidence and didn't flinch when things got complicated at inspection. He secured $85,000 in concessions I wouldn't have known to ask for. For a transaction of that size, having someone who stays calm and strategic is everything.",
    highlight:
      "Secured $85,000 in concessions I wouldn't have known to ask for.",
    language: 'en',
    featured: false,
  },
]

const STATS = [
  { value: '$7.3M+', label: 'Residential Volume' },
  { value: '11', label: 'Closed Transactions' },
  { value: '3 States', label: 'Licensed' },
  { value: '100%', label: 'Client Recommended' },
]

const LANG_BADGES: Record<string, { label: string; flag: string }> = {
  es: { label: 'Español', flag: '🇲🇽' },
  pa: { label: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: '3px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i <= rating ? '#C9A84C' : 'rgba(201,168,76,0.2)'}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
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

  const featured = TESTIMONIALS.find(t => t.featured)
  const rest = TESTIMONIALS.filter(t => !t.featured)

  return (
    <>
      {/* Hero */}
      <section
        style={{
          padding: 'clamp(64px, 8vw, 100px) 32px 64px',
          background: 'linear-gradient(135deg, #0A0A0A 0%, #0f0f0f 100%)',
          borderBottom: '1px solid rgba(201,168,76,0.12)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(rgba(201,168,76,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#C9A84C',
              marginBottom: '20px',
            }}
          >
            Client Reviews
          </div>
          <h1
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(36px, 5vw, 72px)',
              fontWeight: '300',
              color: '#F5F3EE',
              lineHeight: '1.05',
              marginBottom: '16px',
            }}
          >
            What Our Clients Say
          </h1>

          {/* Aggregate rating */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '32px',
            }}
          >
            <StarRating rating={5} />
            <span
              style={{
                color: '#C9A84C',
                fontSize: '22px',
                fontFamily: 'Cormorant Garamond, serif',
                fontWeight: '600',
              }}
            >
              4.9
            </span>
            <span style={{ color: '#666', fontSize: '14px' }}>
              (8 reviews)
            </span>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'clamp(24px, 4vw, 64px)',
              flexWrap: 'wrap',
              marginBottom: '40px',
              padding: '28px 32px',
              background: 'rgba(201,168,76,0.04)',
              border: '1px solid rgba(201,168,76,0.12)',
              borderRadius: '16px',
              maxWidth: '720px',
              margin: '0 auto 40px',
            }}
          >
            {STATS.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: 'clamp(22px, 3vw, 32px)',
                    fontWeight: '600',
                    color: '#C9A84C',
                    lineHeight: '1',
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: '#555',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginTop: '4px',
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Google Reviews link */}
          <a
            href="https://www.google.com/maps/search/Gurpreet+Bhatti+Realtor+Utah"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 24px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#888',
              textDecoration: 'none',
              fontSize: '13px',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            See us on Google Reviews
          </a>
        </div>
      </section>

      {/* Featured Testimonial */}
      {featured && (
        <section style={{ padding: '72px 32px 0', background: '#0A0A0A' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div
              style={{
                padding: '48px',
                background:
                  'linear-gradient(135deg, rgba(201,168,76,0.06), rgba(201,168,76,0.02))',
                border: '1px solid rgba(201,168,76,0.25)',
                borderRadius: '20px',
                position: 'relative',
              }}
            >
              {/* Big quote mark */}
              <div
                style={{
                  position: 'absolute',
                  top: '24px',
                  left: '40px',
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '120px',
                  color: 'rgba(201,168,76,0.08)',
                  lineHeight: 1,
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >
                &ldquo;
              </div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginBottom: '24px',
                  }}
                >
                  <StarRating rating={featured.rating} />
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#C9A84C',
                      background: 'rgba(201,168,76,0.1)',
                      border: '1px solid rgba(201,168,76,0.25)',
                      borderRadius: '4px',
                      padding: '3px 10px',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {featured.type}
                  </span>
                </div>

                <blockquote
                  style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: 'clamp(18px, 2.2vw, 24px)',
                    color: 'rgba(245,243,238,0.82)',
                    lineHeight: '1.75',
                    margin: '0 0 24px 0',
                    fontWeight: '300',
                    fontStyle: 'italic',
                  }}
                >
                  &ldquo;{featured.story}&rdquo;
                </blockquote>

                {/* Highlighted sentence */}
                <div
                  style={{
                    padding: '14px 20px',
                    background: 'rgba(201,168,76,0.08)',
                    borderLeft: '3px solid #C9A84C',
                    borderRadius: '0 8px 8px 0',
                    marginBottom: '24px',
                  }}
                >
                  <p
                    style={{
                      fontSize: '15px',
                      color: '#C9A84C',
                      margin: 0,
                      fontWeight: '500',
                      fontStyle: 'italic',
                    }}
                  >
                    &ldquo;{featured.highlight}&rdquo;
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #C9A84C, #A8863A)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#0A0A0A',
                      fontFamily: 'Cormorant Garamond, serif',
                    }}
                  >
                    {featured.name[0]}
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: '600',
                        color: '#F5F3EE',
                        fontSize: '16px',
                      }}
                    >
                      {featured.name}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      {featured.location} · {featured.date}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Grid */}
      <section style={{ padding: '56px 32px 80px', background: '#0A0A0A' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '24px',
            }}
          >
            {rest.map(t => (
              <div
                key={t.id}
                style={{
                  padding: '32px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(201,168,76,0.12)',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {/* Header row */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '8px',
                    flexWrap: 'wrap',
                  }}
                >
                  <StarRating rating={t.rating} />
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {t.language !== 'en' && LANG_BADGES[t.language] && (
                      <span
                        style={{
                          fontSize: '11px',
                          color: '#C9A84C',
                          background: 'rgba(201,168,76,0.08)',
                          border: '1px solid rgba(201,168,76,0.2)',
                          borderRadius: '4px',
                          padding: '2px 8px',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {LANG_BADGES[t.language].flag}{' '}
                        {LANG_BADGES[t.language].label}
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: '11px',
                        color: '#555',
                        background: 'rgba(201,168,76,0.05)',
                        border: '1px solid rgba(201,168,76,0.1)',
                        borderRadius: '4px',
                        padding: '2px 8px',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {t.type}
                    </span>
                  </div>
                </div>

                {/* Story */}
                <blockquote
                  style={{
                    fontSize: '14px',
                    color: 'rgba(245,243,238,0.68)',
                    lineHeight: '1.85',
                    margin: 0,
                    fontStyle: 'italic',
                    flex: 1,
                  }}
                >
                  &ldquo;{t.story}&rdquo;
                </blockquote>

                {/* Highlight */}
                <div
                  style={{
                    padding: '10px 14px',
                    background: 'rgba(201,168,76,0.06)',
                    borderLeft: '2px solid rgba(201,168,76,0.6)',
                    borderRadius: '0 6px 6px 0',
                  }}
                >
                  <p
                    style={{
                      fontSize: '13px',
                      color: '#C9A84C',
                      margin: 0,
                      fontWeight: '500',
                      fontStyle: 'italic',
                    }}
                  >
                    &ldquo;{t.highlight}&rdquo;
                  </p>
                </div>

                {/* Attribution */}
                <div
                  style={{
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    flexWrap: 'wrap',
                    gap: '4px',
                  }}
                >
                  <div>
                    <div
                      style={{ fontWeight: '600', color: '#F5F3EE', fontSize: '14px' }}
                    >
                      {t.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#555', marginTop: '2px' }}>
                      {t.location}
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#444' }}>{t.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Submit Review */}
      <section
        style={{
          padding: '80px 32px',
          background: '#0D0D0D',
          borderTop: '1px solid rgba(201,168,76,0.1)',
        }}
      >
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div
              style={{
                fontSize: '11px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#C9A84C',
                marginBottom: '16px',
              }}
            >
              Share Your Experience
            </div>
            <h2
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(28px, 3.5vw, 44px)',
                fontWeight: '300',
                color: '#F5F3EE',
              }}
            >
              Submit Your Review
            </h2>
            <p
              style={{
                color: '#666',
                fontSize: '14px',
                marginTop: '12px',
                lineHeight: '1.7',
              }}
            >
              Worked with Gurpreet? We&apos;d love to hear about your experience.
              Reviews are reviewed before being published.
            </p>
          </div>

          {submitSuccess ? (
            <div
              style={{
                padding: '32px',
                background: 'rgba(201,168,76,0.06)',
                border: '1px solid rgba(201,168,76,0.3)',
                borderRadius: '16px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>🌟</div>
              <h3
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '24px',
                  color: '#F5F3EE',
                  marginBottom: '8px',
                }}
              >
                Thank You!
              </h3>
              <p style={{ color: '#888', fontSize: '14px' }}>
                Your review has been submitted and will appear after a quick
                review. We appreciate your feedback!
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                padding: '40px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(201,168,76,0.12)',
                borderRadius: '16px',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      color: '#888',
                      marginBottom: '6px',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Your Name *
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Jane D."
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      fontSize: '14px',
                      color: '#F5F3EE',
                      outline: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      color: '#888',
                      marginBottom: '6px',
                      letterSpacing: '0.04em',
                    }}
                  >
                    City
                  </label>
                  <input
                    value={form.city}
                    onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    placeholder="Salt Lake City"
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      fontSize: '14px',
                      color: '#F5F3EE',
                      outline: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    color: '#888',
                    marginBottom: '6px',
                    letterSpacing: '0.04em',
                  }}
                >
                  Transaction Type
                </label>
                <select
                  value={form.transaction_type}
                  onChange={e =>
                    setForm(f => ({ ...f, transaction_type: e.target.value }))
                  }
                  style={{
                    width: '100%',
                    background: '#111',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '14px',
                    color: '#F5F3EE',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                >
                  <option value="bought">Home Purchase</option>
                  <option value="sold">Home Sale</option>
                  <option value="invested">Investment Property</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    color: '#888',
                    marginBottom: '10px',
                    letterSpacing: '0.04em',
                  }}
                >
                  Rating *
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, rating: star }))}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                    >
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill={
                          star <= form.rating
                            ? '#C9A84C'
                            : 'rgba(201,168,76,0.2)'
                        }
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    color: '#888',
                    marginBottom: '6px',
                    letterSpacing: '0.04em',
                  }}
                >
                  Your Review *
                </label>
                <textarea
                  required
                  value={form.review}
                  onChange={e =>
                    setForm(f => ({ ...f, review: e.target.value }))
                  }
                  placeholder="Share your experience working with Gurpreet..."
                  rows={5}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '14px',
                    color: '#F5F3EE',
                    outline: 'none',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {submitError && (
                <div
                  style={{
                    color: '#e55',
                    fontSize: '13px',
                    padding: '10px 14px',
                    background: 'rgba(255,80,80,0.08)',
                    border: '1px solid rgba(255,80,80,0.2)',
                    borderRadius: '8px',
                  }}
                >
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: submitting
                    ? 'rgba(201,168,76,0.4)'
                    : 'linear-gradient(135deg, #C9A84C, #E2C070)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '14px 28px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#0A0A0A',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  letterSpacing: '0.04em',
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Review →'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section
        style={{
          padding: '64px 32px',
          background: '#0A0A0A',
          borderTop: '1px solid rgba(201,168,76,0.1)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(24px, 3vw, 40px)',
              fontWeight: '300',
              color: '#F5F3EE',
              marginBottom: '16px',
            }}
          >
            Ready to Write Your Own Story?
          </h3>
          <p
            style={{
              color: '#888',
              fontSize: '15px',
              lineHeight: '1.7',
              marginBottom: '32px',
            }}
          >
            Join Utah families who found their dream home, sold for top dollar,
            or built lasting wealth through real estate with Gurpreet Bhatti.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link
              href="/search"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
                color: '#0A0A0A',
                fontWeight: '600',
                fontSize: '14px',
                padding: '14px 28px',
                borderRadius: '8px',
                textDecoration: 'none',
                letterSpacing: '0.04em',
              }}
            >
              Search Utah Homes →
            </Link>
            <a
              href="tel:8016358462"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'transparent',
                color: 'rgba(245,243,238,0.8)',
                fontSize: '14px',
                padding: '14px 28px',
                borderRadius: '8px',
                textDecoration: 'none',
                letterSpacing: '0.04em',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              📞 801.635.8462
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
