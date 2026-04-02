'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const LANGUAGES = [
  { code: 'en', flag: '🇺🇸', name: 'English', native: 'English', path: '/' },
  { code: 'es', flag: '🇲🇽', name: 'Spanish', native: 'Español', path: '/es' },
  { code: 'pt', flag: '🇧🇷', name: 'Portuguese', native: 'Português', path: '/pt' },
  { code: 'zh', flag: '🇨🇳', name: 'Chinese', native: '中文', path: '/zh' },
  { code: 'ar', flag: '🇸🇦', name: 'Arabic', native: 'العربية', path: '/ar' },
  { code: 'fa', flag: '🇮🇷', name: 'Persian/Farsi', native: 'فارسی', path: '/fa' },
]

const QUOTES = [
  'Your Dream Home in Utah Starts Here.',
  'Find Your Perfect Place in the Beehive State.',
  'Utah Real Estate — Done Different.',
]

export default function LanguageSelector() {
  const [show, setShow] = useState(false)
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [hoveredLang, setHoveredLang] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const selected = localStorage.getItem('gsb_language_selected')
    const isLangPage = ['/es', '/pt', '/zh', '/ar', '/fa'].some(p => pathname.startsWith(p))
    if (!selected && !isLangPage) {
      // Show immediately on first visit (no delay)
      setShow(true)
    }
  }, [pathname])

  useEffect(() => {
    if (!show) return
    const interval = setInterval(() => {
      setQuoteIndex(i => (i + 1) % QUOTES.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [show])

  const select = (lang: typeof LANGUAGES[0]) => {
    localStorage.setItem('gsb_language_selected', lang.code)
    setShow(false)
    if (lang.code !== 'en') {
      router.push(lang.path)
    }
  }

  const dismiss = () => {
    localStorage.setItem('gsb_language_selected', 'en')
    setShow(false)
  }

  if (!show) return null

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'linear-gradient(135deg, rgba(10,8,5,0.97) 0%, rgba(20,15,5,0.97) 50%, rgba(10,8,5,0.97) 100%)',
      zIndex: 99999,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(12px)',
      padding: '20px',
      overflowY: 'auto',
    }}>

      {/* Gold gradient accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
        background: 'linear-gradient(90deg, transparent, #C9A84C, #E2C070, #C9A84C, transparent)',
      }} />

      {/* Content */}
      <div style={{ maxWidth: '680px', width: '100%', textAlign: 'center' }}>

        {/* Logo / Brand */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '13px', letterSpacing: '0.2em',
            textTransform: 'uppercase', color: '#C9A84C',
            marginBottom: '4px',
          }}>
            GSB Realtor
          </div>
          <div style={{
            fontSize: '10px', letterSpacing: '0.16em',
            textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)',
          }}>
            Gurpreet Bhatti · REALTOR®
          </div>
        </div>

        {/* Animated Quote */}
        <div style={{ minHeight: '48px', marginBottom: '32px', padding: '0 16px' }}>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(22px, 5vw, 36px)',
            fontWeight: '300',
            color: '#F5F3EE',
            lineHeight: '1.3',
            transition: 'opacity 0.5s',
            margin: 0,
          }}>
            {QUOTES[quoteIndex]}
          </h1>
        </div>

        {/* Language selection label */}
        <p style={{
          color: 'rgba(255,255,255,0.4)',
          fontSize: '12px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: '20px',
        }}>
          Select your language / Seleccione su idioma / Selecione seu idioma
        </p>

        {/* Language grid — 2x3 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '32px',
        }}>
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => select(lang)}
              onMouseEnter={() => setHoveredLang(lang.code)}
              onMouseLeave={() => setHoveredLang(null)}
              style={{
                background: hoveredLang === lang.code
                  ? 'rgba(201,168,76,0.08)'
                  : 'rgba(255,255,255,0.03)',
                border: hoveredLang === lang.code
                  ? '1px solid rgba(201,168,76,0.6)'
                  : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '20px 12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                transform: hoveredLang === lang.code ? 'scale(1.03)' : 'scale(1)',
                color: '#F5F3EE',
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: '40px', lineHeight: 1 }}>{lang.flag}</span>
              <span style={{
                fontSize: '15px',
                fontWeight: '700',
                color: hoveredLang === lang.code ? '#C9A84C' : '#F5F3EE',
                transition: 'color 0.2s',
                direction: lang.code === 'ar' || lang.code === 'fa' ? 'rtl' : 'ltr',
              }}>
                {lang.native}
              </span>
              <span style={{ fontSize: '11px', color: '#555' }}>{lang.name}</span>
            </button>
          ))}
        </div>

        {/* Gurpreet's quote */}
        <div style={{
          padding: '20px 24px',
          background: 'rgba(201,168,76,0.05)',
          border: '1px solid rgba(201,168,76,0.15)',
          borderRadius: '16px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          textAlign: 'left',
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #C9A84C, #A8863A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px', flexShrink: 0,
          }}>
            G
          </div>
          <div>
            <p style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '16px',
              color: '#F5F3EE',
              fontStyle: 'italic',
              margin: '0 0 4px 0',
              lineHeight: '1.5',
            }}>
              &ldquo;I speak your language — let me help you find your home in Utah.&rdquo;
            </p>
            <p style={{ fontSize: '11px', color: '#C9A84C', margin: 0, letterSpacing: '0.04em' }}>
              — Gurpreet Bhatti, REALTOR®
            </p>
          </div>
        </div>

        {/* Dismiss */}
        <button
          onClick={dismiss}
          style={{
            background: 'none', border: 'none',
            color: 'rgba(255,255,255,0.25)',
            fontSize: '12px', cursor: 'pointer',
            textDecoration: 'underline',
            letterSpacing: '0.04em',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}
        >
          Continue in English
        </button>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .lang-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}
