'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'

const LANGUAGES = [
  { flag: '🇺🇸', name: 'English', href: '/', code: 'en' },
  { flag: '🇲🇽', name: 'Español', href: '/es', code: 'es' },
  { flag: '🇮🇳', name: 'ਪੰਜਾਬੀ', href: '/pa', code: 'pa', subtitle: 'Punjabi' },
]

const QUOTES = [
  'Your dream home in Utah starts here.',
  'Real estate done different — with discipline, integrity, and purpose.',
  'From the Marines to Main Street — I close deals with honor.',
  'One call. Three states. Zero excuses.',
  "Utah's market moves fast. So do I.",
]

export default function LanguageSelector() {
  const [show, setShow] = useState(false)
  const [visible, setVisible] = useState(false)
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [quoteFading, setQuoteFading] = useState(false)
  const [hoveredLang, setHoveredLang] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const selected = localStorage.getItem('gsb_lang')
    const isLangPage = ['/es', '/pt', '/zh', '/ar', '/fa', '/pa'].some(p =>
      pathname.startsWith(p)
    )
    if (!selected && !isLangPage) {
      setShow(true)
      // Fade in immediately
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true))
      })
    }
  }, [pathname])

  // Rotate quotes every 4 seconds with smooth fade
  useEffect(() => {
    if (!show) return
    const interval = setInterval(() => {
      setQuoteFading(true)
      setTimeout(() => {
        setQuoteIndex(i => (i + 1) % QUOTES.length)
        setQuoteFading(false)
      }, 400)
    }, 4000)
    return () => clearInterval(interval)
  }, [show])

  const select = useCallback(
    (lang: (typeof LANGUAGES)[0]) => {
      localStorage.setItem('gsb_lang', lang.code)
      setVisible(false)
      setTimeout(() => {
        setShow(false)
        router.push(lang.href)
      }, 350)
    },
    [router]
  )

  const dismiss = useCallback(() => {
    localStorage.setItem('gsb_lang', 'en')
    setVisible(false)
    setTimeout(() => setShow(false), 350)
  }, [])

  if (!show) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background:
          'linear-gradient(160deg, #060606 0%, #0a0a0a 50%, #0f0a00 100%)',
        display: 'flex',
        alignItems: 'stretch',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease',
        overflow: 'hidden',
      }}
    >
      {/* Subtle gold radial glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '30%',
          width: '600px',
          height: '600px',
          background:
            'radial-gradient(ellipse at center, rgba(201,168,76,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '25%',
          width: '400px',
          height: '400px',
          background:
            'radial-gradient(ellipse at center, rgba(201,168,76,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top gold accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background:
            'linear-gradient(90deg, transparent, #C9A84C, #E2C070, #C9A84C, transparent)',
        }}
      />

      {/* LEFT CONTENT */}
      <div
        style={{
          flex: '1 1 55%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'clamp(40px, 6vw, 80px) clamp(32px, 5vw, 72px)',
          maxWidth: '720px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Label */}
        <div
          style={{
            fontSize: '11px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#C9A84C',
            marginBottom: '36px',
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          Gurpreet Bhatti · Realtor® · USMC Veteran
        </div>

        {/* Rotating Quote */}
        <div
          style={{
            minHeight: 'clamp(72px, 12vw, 120px)',
            marginBottom: '48px',
          }}
        >
          <h1
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(28px, 4vw, 52px)',
              fontWeight: '300',
              color: '#F5F3EE',
              lineHeight: '1.15',
              margin: 0,
              opacity: quoteFading ? 0 : 1,
              transition: 'opacity 0.4s ease',
              letterSpacing: '-0.01em',
            }}
          >
            {QUOTES[quoteIndex]}
          </h1>
        </div>

        {/* Language heading — trilingual */}
        <div
          style={{
            fontSize: '11px',
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.3)',
            textTransform: 'uppercase',
            marginBottom: '20px',
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          <span>Choose Your Language</span>
          <span style={{ color: 'rgba(201,168,76,0.3)' }}>/</span>
          <span>Elige tu idioma</span>
          <span style={{ color: 'rgba(201,168,76,0.3)' }}>/</span>
          <span>ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ</span>
        </div>

        {/* Flag Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '40px',
            flexWrap: 'wrap',
          }}
        >
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => select(lang)}
              onMouseEnter={() => setHoveredLang(lang.code)}
              onMouseLeave={() => setHoveredLang(null)}
              style={{
                background:
                  hoveredLang === lang.code
                    ? 'rgba(201,168,76,0.1)'
                    : 'rgba(255,255,255,0.03)',
                border:
                  hoveredLang === lang.code
                    ? '1px solid rgba(201,168,76,0.7)'
                    : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '24px 28px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                transform:
                  hoveredLang === lang.code ? 'scale(1.05)' : 'scale(1)',
                color: '#F5F3EE',
                textAlign: 'center',
                minWidth: '120px',
                flex: '1 1 auto',
                maxWidth: '160px',
              }}
            >
              <span style={{ fontSize: '48px', lineHeight: 1 }}>
                {lang.flag}
              </span>
              <span
                style={{
                  fontSize: '17px',
                  fontWeight: '700',
                  color:
                    hoveredLang === lang.code ? '#C9A84C' : '#F5F3EE',
                  transition: 'color 0.2s',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                {lang.name}
              </span>
              {'subtitle' in lang && lang.subtitle && (
                <span
                  style={{
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.35)',
                    letterSpacing: '0.06em',
                  }}
                >
                  {lang.subtitle}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Skip link */}
        <button
          onClick={dismiss}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.25)',
            fontSize: '13px',
            cursor: 'pointer',
            letterSpacing: '0.04em',
            padding: 0,
            textAlign: 'left',
            transition: 'color 0.2s',
            fontFamily: 'DM Sans, sans-serif',
          }}
          onMouseEnter={e =>
            (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')
          }
          onMouseLeave={e =>
            (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')
          }
        >
          Continue in English →
        </button>
      </div>

      {/* RIGHT — Gurpreet's photo (desktop only) */}
      <div
        className="welcome-photo-side"
        style={{
          flex: '0 0 42%',
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          overflow: 'hidden',
        }}
      >
        {/* Gradient fade on left edge */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '120px',
            height: '100%',
            background:
              'linear-gradient(to right, #060606, transparent)',
            zIndex: 2,
          }}
        />

        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            zIndex: 1,
          }}
        >
          <Image
            src="/images/gurpreet-standing.jpg"
            alt="Gurpreet Bhatti — REALTOR® Utah"
            fill
            style={{
              objectFit: 'cover',
              objectPosition: 'center top',
              filter: 'brightness(0.85)',
            }}
            priority
          />
          {/* Gold overlay gradient at bottom */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '200px',
              background:
                'linear-gradient(to top, rgba(6,6,6,0.9), transparent)',
              zIndex: 3,
            }}
          />
        </div>

        {/* Gold badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            right: '32px',
            zIndex: 4,
            background:
              'linear-gradient(135deg, rgba(10,8,4,0.95), rgba(15,12,4,0.95))',
            border: '1px solid rgba(201,168,76,0.5)',
            borderRadius: '12px',
            padding: '14px 20px',
            textAlign: 'center',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '18px',
              color: '#C9A84C',
              fontWeight: '600',
              lineHeight: '1.2',
            }}
          >
            Serving Utah
          </div>
          <div
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '14px',
              color: 'rgba(201,168,76,0.7)',
              fontWeight: '400',
            }}
          >
            Since 2022
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .welcome-photo-side {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
