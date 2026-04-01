'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', path: '/' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇲🇽', path: '/es' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', path: '/pt' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', path: '/zh' },
]

export default function LanguageSelector() {
  const [show, setShow] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Show on first visit, not on language pages themselves
    const selected = localStorage.getItem('gsb_language_selected')
    const isLangPage = ['/es', '/pt', '/zh'].some(p => pathname.startsWith(p))
    if (!selected && !isLangPage) {
      // Small delay so page loads first
      setTimeout(() => setShow(true), 1500)
    }
  }, [pathname])

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
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
      zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(8px)', padding: '20px'
    }}>
      <div style={{
        background: '#0f0f0f', border: '1px solid rgba(201,168,76,0.3)',
        borderRadius: '20px', padding: '40px', maxWidth: '480px', width: '100%',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>🌎</div>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', color: '#F5F3EE', marginBottom: '8px', fontWeight: '300' }}>
          Welcome to GSB Realtor
        </h2>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '32px' }}>
          Select your language / Seleccione su idioma / Selecione seu idioma
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          {LANGUAGES.map(lang => (
            <button key={lang.code} onClick={() => select(lang)} style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px', padding: '16px', cursor: 'pointer',
              transition: 'all 0.2s', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '8px',
              color: '#F5F3EE'
            }}
            onMouseOver={e => (e.currentTarget.style.borderColor = '#C9A84C')}
            onMouseOut={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}>
              <span style={{ fontSize: '32px' }}>{lang.flag}</span>
              <span style={{ fontSize: '15px', fontWeight: '600' }}>{lang.nativeName}</span>
              <span style={{ fontSize: '12px', color: '#666' }}>{lang.name}</span>
            </button>
          ))}
        </div>
        <button onClick={dismiss} style={{
          background: 'none', border: 'none', color: '#555', fontSize: '13px',
          cursor: 'pointer', textDecoration: 'underline'
        }}>
          Continue in English
        </button>
      </div>
    </div>
  )
}
