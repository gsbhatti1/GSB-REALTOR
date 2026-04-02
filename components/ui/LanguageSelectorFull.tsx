'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const SLIDES = [
  { image: '/images/gurpreet-headshot-pro.jpg', position: 'center top' },
  { image: '/images/gurpreet-standing.jpg',     position: 'center top' },
  { image: '/images/gurpreet-headshot-smile.jpg', position: 'center top' },
]

const LANGUAGES = [
  { flag: '🇺🇸', native: 'English',     name: 'English',    code: 'en' },
  { flag: '🇲🇽', native: 'Español',     name: 'Spanish',    code: 'es' },
  { flag: '🇮🇳', native: 'ਪੰਜਾਬੀ',     name: 'Punjabi',    code: 'pa' },
  { flag: '🇸🇦', native: 'العربية',     name: 'Arabic',     code: 'ar' },
  { flag: '🇨🇳', native: '中文',         name: 'Chinese',    code: 'zh' },
  { flag: '🇻🇳', native: 'Tiếng Việt', name: 'Vietnamese', code: 'vi' },
]

const QUOTES = [
  { line1: 'Your Dream Home',      line2: 'Starts Here.' },
  { line1: 'Utah Real Estate',     line2: 'Done Different.' },
  { line1: 'One Call.',            line2: 'Three States.' },
  { line1: "Utah's Market Moves",  line2: 'Fast. So Do I.' },
  { line1: 'From Marines',         line2: 'To Main Street.' },
]

const STATS = [
  { value: '17K+',  label: 'Active Listings' },
  { value: '$7.3M+',label: 'Volume Closed' },
  { value: '6',     label: 'Languages Served' },
  { value: '< 1hr', label: 'Response Time' },
]

export default function LanguageSelectorFull() {
  const [slide, setSlide]             = useState(0)
  const [quoteIdx, setQuoteIdx]       = useState(0)
  const [quoteFading, setQuoteFading] = useState(false)
  const [hovered, setHovered]         = useState<string | null>(null)
  const router = useRouter()

  // Rotate slides every 5s
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

  // Rotate quotes every 4s with fade
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

  const select = (code: string) => {
    localStorage.setItem('gsb_lang', code)
    router.push('/search')
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow: hidden; }

        .lang-btn {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          padding: 14px 18px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          text-align: left;
          color: #F5F3EE;
        }
        .lang-btn:hover {
          background: rgba(201,168,76,0.12);
          border-color: rgba(201,168,76,0.7);
          transform: translateX(-4px);
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-in { animation: slideIn 0.7s ease forwards; }

        @media (max-width: 860px) {
          .welcome-right { display: none !important; }
          .welcome-left  { padding: 40px 28px !important; }
          .welcome-quote { font-size: clamp(36px, 9vw, 64px) !important; }
          .lang-panel    { position: static !important; width: 100% !important; margin-top: 28px; }
          .stats-bar     { gap: 20px !important; }
        }
      `}</style>

      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#060606',
        display: 'flex',
        fontFamily: 'DM Sans, sans-serif',
      }}>

        {/* ── BACKGROUND SLIDES ── */}
        {SLIDES.map((s, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            opacity: slide === i ? 1 : 0,
            transition: 'opacity 1.8s ease-in-out',
            zIndex: 1,
          }}>
            <Image
              src={s.image}
              alt="Gurpreet Bhatti"
              fill
              priority={i === 0}
              style={{
                objectFit: 'cover',
                objectPosition: s.position,
                filter: 'brightness(0.28)',
              }}
            />
          </div>
        ))}

        {/* Dark gradient: heavier on right so text stays readable */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: 'linear-gradient(105deg, rgba(6,6,6,0.55) 0%, rgba(6,6,6,0.15) 55%, rgba(6,6,6,0.7) 100%)',
        }} />

        {/* Bottom fade to black */}
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
          </div>

          {/* ── RIGHT — language panel ── */}
          <div className="welcome-right" style={{
            flex: '0 0 clamp(220px, 22vw, 300px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '40px 32px 40px 0',
            gap: '10px',
          }}>

            {/* Panel label */}
            <div style={{
              fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.25)', marginBottom: '12px', textAlign: 'right',
            }}>
              Choose Your Language
            </div>

            {/* Language buttons — vertical stack */}
            {LANGUAGES.map((lang, i) => (
              <button
                key={lang.code}
                className="lang-btn animate-in"
                onClick={() => select(lang.code)}
                onMouseEnter={() => setHovered(lang.code)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: hovered === lang.code ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${hovered === lang.code ? 'rgba(201,168,76,0.7)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '14px',
                  padding: '14px 18px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  textAlign: 'left',
                  color: '#F5F3EE',
                  transform: hovered === lang.code ? 'translateX(-4px)' : 'translateX(0)',
                  animationDelay: `${0.15 + i * 0.07}s`,
                  opacity: 0,
                  fontFamily: 'inherit',
                }}
              >
                <span style={{ fontSize: '26px', lineHeight: 1, flexShrink: 0 }}>{lang.flag}</span>
                <div>
                  <div style={{
                    fontSize: '14px', fontWeight: '700',
                    color: hovered === lang.code ? '#C9A84C' : '#F5F3EE',
                    transition: 'color 0.2s', lineHeight: 1.2,
                  }}>{lang.native}</div>
                  <div style={{
                    fontSize: '10px', color: 'rgba(255,255,255,0.3)',
                    letterSpacing: '0.05em', marginTop: '2px',
                  }}>{lang.name}</div>
                </div>
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
      </div>
    </>
  )
}
