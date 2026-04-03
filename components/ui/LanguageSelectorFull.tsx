'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

/* ── Photo slides for background ── */
const SLIDES = [
  { image: '/images/gurpreet-standing.jpg',      position: 'center top' },
  { image: '/images/gurpreet-headshot-pro.jpg',   position: 'center top' },
  { image: '/images/gurpreet-headshot-smile.jpg', position: 'center top' },
  { image: '/images/gurpreet-snow.jpg',           position: 'center 30%' },
  { image: '/images/gurpreet-fullbody.jpg',       position: 'center top' },
]

/* ── Language config with SVG flag URLs ── */
const LANGUAGES = [
  { code: 'en', native: 'English',     name: 'English',    country: 'US', flag: 'https://flagcdn.com/w40/us.png' },
  { code: 'es', native: 'Español',     name: 'Spanish',    country: 'MX', flag: 'https://flagcdn.com/w40/mx.png' },
  { code: 'pa', native: 'ਪੰਜਾਬੀ',      name: 'Punjabi',    country: 'IN', flag: 'https://flagcdn.com/w40/in.png' },
  { code: 'ar', native: 'العربية',      name: 'Arabic',     country: 'SA', flag: 'https://flagcdn.com/w40/sa.png' },
  { code: 'zh', native: '中文',          name: 'Chinese',    country: 'CN', flag: 'https://flagcdn.com/w40/cn.png' },
  { code: 'vi', native: 'Tiếng Việt',  name: 'Vietnamese', country: 'VN', flag: 'https://flagcdn.com/w40/vn.png' },
]

/* ── Rotating quotes ── */
const QUOTES = [
  { line1: 'Your Dream Home',     line2: 'Starts Here.' },
  { line1: 'Utah Real Estate',    line2: 'Done Different.' },
  { line1: 'One Call.',           line2: 'Three States.' },
  { line1: "Utah's Market Moves", line2: 'Fast. So Do I.' },
  { line1: 'From Marines',        line2: 'To Main Street.' },
]

/* ── Stats ── */
const STATS = [
  { value: '17K+',   label: 'Listings' },
  { value: '$7.3M+', label: 'Closed' },
  { value: '3',      label: 'States' },
  { value: '< 1hr',  label: 'Response' },
]

/* ── Choose Your Language — in each language ── */
const CHOOSE_LABELS = [
  'Choose Your Language',
  'Elige tu idioma',
  'ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ',
  'اختر لغتك',
  '选择语言',
  'Chọn ngôn ngữ',
]

/* ── Browser language → our code mapping ── */
function detectLanguageCode(): string | null {
  if (typeof navigator === 'undefined') return null
  const browserLang = (navigator.language || '').toLowerCase()
  if (browserLang.startsWith('es')) return 'es'
  if (browserLang.startsWith('pa') || browserLang.startsWith('hi')) return 'pa'
  if (browserLang.startsWith('ar')) return 'ar'
  if (browserLang.startsWith('zh')) return 'zh'
  if (browserLang.startsWith('vi')) return 'vi'
  return 'en'
}

export default function LanguageSelectorFull() {
  const [slide, setSlide]             = useState(0)
  const [quoteIdx, setQuoteIdx]       = useState(0)
  const [quoteFading, setQuoteFading] = useState(false)
  const [hovered, setHovered]         = useState<string | null>(null)
  const [highlighted, setHighlighted] = useState<string | null>(null)
  const [chooseLabelIdx, setChooseLabelIdx] = useState(0)
  const [chooseFade, setChooseFade]         = useState(false)
  const [ready, setReady]             = useState(false)
  const router = useRouter()

  // ── Check for returning visitor ──
  useEffect(() => {
    const saved = localStorage.getItem('gsb_lang')
    if (saved) {
      // Returning visitor — skip welcome, go to search
      router.replace(saved === 'en' ? '/search' : `/${saved}`)
      return
    }

    // Auto-detect device language and highlight that button
    const detected = detectLanguageCode()
    if (detected && detected !== 'en') {
      setHighlighted(detected)
    }
    setReady(true)
  }, [router])

  // ── Rotate slides every 5s ──
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

  // ── Rotate quotes every 4s with fade ──
  useEffect(() => {
    const t = setInterval(() => {
      setQuoteFading(true)
      setTimeout(() => {
        setQuoteIdx(i => (i + 1) % QUOTES.length)
        setQuoteFading(false)
      }, 400)
    }, 4000)
    return () => clearInterval(t)
  }, [])

  // ── Rotate "Choose Your Language" label ──
  useEffect(() => {
    const t = setInterval(() => {
      setChooseFade(true)
      setTimeout(() => {
        setChooseLabelIdx(i => (i + 1) % CHOOSE_LABELS.length)
        setChooseFade(false)
      }, 300)
    }, 2500)
    return () => clearInterval(t)
  }, [])

  const select = useCallback((code: string) => {
    localStorage.setItem('gsb_lang', code)
    if (code === 'en') {
      router.push('/search')
    } else {
      router.push(`/${code}`)
    }
  }, [router])

  // Don't render until we know this isn't a returning visitor
  if (!ready) {
    return (
      <div style={{
        position: 'fixed', inset: 0, background: '#060606', zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: '32px', height: '32px', border: '2px solid rgba(201,168,76,0.3)',
          borderTopColor: '#C9A84C', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  return (
    <>
      <style>{`
        body { overflow: hidden; }

        .lang-btn {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          padding: 14px 18px;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          text-align: left;
          color: #F5F3EE;
          font-family: inherit;
        }
        .lang-btn:hover, .lang-btn.highlighted {
          background: rgba(201,168,76,0.12);
          border-color: rgba(201,168,76,0.7);
          transform: translateX(-4px);
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-in { animation: slideIn 0.7s ease forwards; }

        /* ── Mobile layout: stack vertically ── */
        @media (max-width: 860px) {
          .welcome-right { display: none !important; }
          .welcome-left  { padding: 40px 24px !important; }
          .welcome-quote { font-size: clamp(36px, 9vw, 64px) !important; }
          .lang-panel    { position: static !important; width: 100% !important; margin-top: 28px; }
          .stats-bar     { gap: 20px !important; }
          .mobile-lang-grid { display: grid !important; }
        }
        @media (min-width: 861px) {
          .mobile-lang-grid { display: none !important; }
        }
      `}</style>

      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#060606',
        display: 'flex',
        fontFamily: 'DM Sans, sans-serif',
      }}>

        {/* ── BACKGROUND: Video (when available) or Photo Slides ── */}
        {/*
          To enable video: place your video at /public/videos/gurpreet-hero.mp4
          The component will auto-detect it and use it instead of photo slides.
          For HeyGen live avatar, replace the <video> with their embed widget.
        */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
        }}>
          {/* Video background — uncomment when video is ready:
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/images/gurpreet-standing.jpg"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              filter: 'brightness(0.25)',
            }}
          >
            <source src="/videos/gurpreet-hero.mp4" type="video/mp4" />
          </video>
          */}

          {/* Photo slides (active until video is ready) */}
          {SLIDES.map((s, i) => (
            <div key={i} style={{
              position: 'absolute', inset: 0,
              opacity: slide === i ? 1 : 0,
              transition: 'opacity 1.8s ease-in-out',
            }}>
              <Image
                src={s.image}
                alt="Gurpreet Bhatti"
                fill
                priority={i === 0}
                style={{
                  objectFit: 'cover',
                  objectPosition: s.position,
                  filter: 'brightness(0.25)',
                }}
              />
            </div>
          ))}
        </div>

        {/* Dark gradient overlays */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: 'linear-gradient(105deg, rgba(6,6,6,0.55) 0%, rgba(6,6,6,0.15) 55%, rgba(6,6,6,0.7) 100%)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%',
          background: 'linear-gradient(to top, rgba(6,6,6,1) 0%, rgba(6,6,6,0.6) 50%, transparent 100%)',
          zIndex: 2,
        }} />

        {/* Top gold accent line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px', zIndex: 5,
          background: 'linear-gradient(90deg, transparent 0%, #C9A84C 30%, #E2C070 50%, #C9A84C 70%, transparent 100%)',
        }} />

        {/* Left gold rule */}
        <div style={{
          position: 'absolute', left: 0, top: '10%', bottom: '10%', width: '3px', zIndex: 5,
          background: 'linear-gradient(to bottom, transparent, #C9A84C 30%, #C9A84C 70%, transparent)',
        }} />

        {/* ── MAIN CONTENT LAYER ── */}
        <div style={{
          position: 'relative', zIndex: 6,
          width: '100%', height: '100%',
          display: 'flex', alignItems: 'stretch',
        }}>

          {/* ── LEFT — quotes, stats, CTA ── */}
          <div className="welcome-left" style={{
            flex: '1 1 0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 'clamp(40px, 6vw, 80px) clamp(40px, 6vw, 80px) clamp(40px, 6vw, 80px) clamp(40px, 5vw, 64px)',
          }}>

            {/* Label */}
            <div className="animate-in" style={{
              fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase',
              color: '#C9A84C', marginBottom: '32px',
              animationDelay: '0.1s', opacity: 0,
            }}>
              Gurpreet Bhatti · Realtor® · USMC Veteran
            </div>

            {/* Accent label */}
            <div className="animate-in" style={{
              fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)', marginBottom: '16px',
              animationDelay: '0.2s', opacity: 0,
            }}>
              17,000+ Active Utah Listings
            </div>

            {/* Big rotating quote */}
            <div style={{ marginBottom: '48px', minHeight: 'clamp(100px, 16vw, 180px)' }}>
              <h1 className="welcome-quote" style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(42px, 6.5vw, 96px)',
                fontWeight: '300',
                lineHeight: '0.95',
                letterSpacing: '-0.02em',
                opacity: quoteFading ? 0 : 1,
                transition: 'opacity 0.4s ease',
              }}>
                <span style={{ color: '#F5F3EE', display: 'block' }}>
                  {QUOTES[quoteIdx].line1}
                </span>
                <span style={{ color: '#C9A84C', fontStyle: 'italic', display: 'block' }}>
                  {QUOTES[quoteIdx].line2}
                </span>
              </h1>
            </div>

            {/* Stats bar */}
            <div className="stats-bar animate-in" style={{
              display: 'flex', gap: '40px', flexWrap: 'wrap',
              marginBottom: '40px',
              animationDelay: '0.4s', opacity: 0,
            }}>
              {STATS.map(s => (
                <div key={s.label}>
                  <div style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: 'clamp(22px, 2.5vw, 30px)',
                    color: '#C9A84C', fontWeight: '300', lineHeight: 1,
                  }}>{s.value}</div>
                  <div style={{
                    fontSize: '10px', color: '#888',
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    marginTop: '4px',
                  }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Search Homes CTA */}
            <div className="animate-in" style={{ animationDelay: '0.5s', opacity: 0 }}>
              <button
                onClick={() => select('en')}
                style={{
                  background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
                  border: 'none', borderRadius: '4px',
                  padding: '16px 40px', fontSize: '13px',
                  fontWeight: '700', color: '#0A0A0A',
                  cursor: 'pointer', letterSpacing: '0.1em',
                  textTransform: 'uppercase', fontFamily: 'inherit',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Search Homes →
              </button>
            </div>

            {/* ── Mobile language grid (visible on small screens only) ── */}
            <div className="mobile-lang-grid" style={{
              display: 'none',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              marginTop: '32px',
            }}>
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => select(lang.code)}
                  style={{
                    background: highlighted === lang.code ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${highlighted === lang.code ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '12px',
                    padding: '12px 8px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={lang.flag}
                    alt={lang.name}
                    width={28}
                    height={21}
                    style={{ borderRadius: '2px' }}
                  />
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#F5F3EE' }}>
                    {lang.country}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: highlighted === lang.code ? '#C9A84C' : '#F5F3EE' }}>
                    {lang.native}
                  </span>
                  <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}>
                    {lang.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Continue in English (mobile) */}
            <div className="mobile-lang-grid" style={{
              display: 'none',
              marginTop: '16px',
            }}>
              <button
                onClick={() => select('en')}
                style={{
                  background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)',
                  fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit',
                  padding: '8px 0', gridColumn: '1 / -1',
                }}
              >
                Continue in English →
              </button>
            </div>
          </div>

          {/* ── RIGHT — language panel (desktop) ── */}
          <div className="welcome-right" style={{
            flex: '0 0 clamp(240px, 24vw, 320px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '40px 36px 40px 0',
            gap: '10px',
          }}>

            {/* Rotating "Choose Your Language" label */}
            <div style={{
              fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.25)', marginBottom: '12px', textAlign: 'right',
              minHeight: '16px',
              opacity: chooseFade ? 0 : 1,
              transition: 'opacity 0.3s ease',
            }}>
              {CHOOSE_LABELS[chooseLabelIdx]}
            </div>

            {/* Language buttons — vertical stack */}
            {LANGUAGES.map((lang, i) => (
              <button
                key={lang.code}
                className={`lang-btn animate-in ${highlighted === lang.code ? 'highlighted' : ''}`}
                onClick={() => select(lang.code)}
                onMouseEnter={() => setHovered(lang.code)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: (hovered === lang.code || highlighted === lang.code)
                    ? 'rgba(201,168,76,0.12)'
                    : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${(hovered === lang.code || highlighted === lang.code)
                    ? 'rgba(201,168,76,0.7)'
                    : 'rgba(255,255,255,0.1)'}`,
                  transform: (hovered === lang.code || highlighted === lang.code) ? 'translateX(-4px)' : 'translateX(0)',
                  animationDelay: `${0.15 + i * 0.07}s`,
                  opacity: 0,
                }}
              >
                {/* SVG flag image instead of emoji */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lang.flag}
                  alt={`${lang.name} flag`}
                  width={28}
                  height={21}
                  style={{ borderRadius: '2px', flexShrink: 0 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '14px', fontWeight: '700',
                    color: (hovered === lang.code || highlighted === lang.code) ? '#C9A84C' : '#F5F3EE',
                    transition: 'color 0.2s', lineHeight: 1.2,
                  }}>{lang.native}</div>
                  <div style={{
                    fontSize: '10px', color: 'rgba(255,255,255,0.3)',
                    letterSpacing: '0.05em', marginTop: '2px',
                  }}>{lang.name}</div>
                </div>
                <div style={{
                  fontSize: '11px', fontWeight: '600',
                  color: 'rgba(255,255,255,0.2)',
                  letterSpacing: '0.05em',
                }}>{lang.country}</div>
              </button>
            ))}

            {/* Slide dots */}
            <div style={{
              display: 'flex', gap: '6px', justifyContent: 'flex-end',
              marginTop: '16px',
            }}>
              {SLIDES.map((_, i) => (
                <button key={i} onClick={() => setSlide(i)} style={{
                  width: i === slide ? '24px' : '6px',
                  height: '3px',
                  background: i === slide ? '#C9A84C' : 'rgba(255,255,255,0.25)',
                  border: 'none', cursor: 'pointer', borderRadius: '2px',
                  transition: 'all 0.4s ease', padding: 0,
                }} />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom tagline */}
        <div style={{
          position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 7, fontSize: '11px', color: 'rgba(255,255,255,0.15)',
          letterSpacing: '0.12em', textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>
          No bots. No assistants. When you call, you get Gurpreet. Every time.
        </div>
      </div>
    </>
  )
}
