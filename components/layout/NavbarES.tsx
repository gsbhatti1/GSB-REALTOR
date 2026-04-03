'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const FLAG_LANGS = [
  { flag: 'https://flagcdn.com/w40/us.png', code: 'US', label: 'English', href: '/search', lang: 'en' },
  { flag: 'https://flagcdn.com/w40/mx.png', code: 'MX', label: 'Español', href: '/es', lang: 'es' },
  { flag: 'https://flagcdn.com/w40/in.png', code: 'IN', label: 'ਪੰਜਾਬੀ', href: '/pa', lang: 'pa' },
  { flag: 'https://flagcdn.com/w40/sa.png', code: 'SA', label: 'العربية', href: '/ar', lang: 'ar' },
  { flag: 'https://flagcdn.com/w40/cn.png', code: 'CN', label: '中文', href: '/zh', lang: 'zh' },
  { flag: 'https://flagcdn.com/w40/vn.png', code: 'VN', label: 'Tiếng Việt', href: '/vi', lang: 'vi' },
]

export default function NavbarES() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const navLinks = [
    { href: '/search',       label: 'Buscar Casas' },
    { href: '/es#vender',    label: 'Vender' },
    { href: '/commercial',   label: 'Comercial' },
    { href: '/investor',     label: 'Inversiones' },
    { href: '/testimonials', label: 'Reseñas' },
    { href: '/contact',      label: 'Contacto' },
  ]

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '0 32px', height: '72px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      transition: 'all 0.3s ease',
      background: scrolled ? 'rgba(10,10,10,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(201,168,76,0.15)' : '1px solid transparent',
    }}>
      <Link href="/es" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
        <Image src="/images/gurpreet-headshot-smile.jpg" alt="Gurpreet Bhatti" width={36} height={36}
          style={{ borderRadius: '50%', border: '2px solid rgba(201,168,76,0.5)', objectFit: 'cover' }} />
        <div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', fontWeight: '600', color: '#F5F3EE', lineHeight: '1.1' }}>
            GSB Realtor
          </div>
          <div style={{ fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C9A84C', lineHeight: '1.1' }}>
            Gurpreet Bhatti · REALTOR®
          </div>
        </div>
      </Link>

      <div className="nav-links-es" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {navLinks.map(link => (
          <Link key={link.label} href={link.href} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(245,243,238,0.75)', textDecoration: 'none' }}>
            {link.label}
          </Link>
        ))}

        {/* Language dropdown */}
        <div
          style={{ position: 'relative' }}
          onMouseEnter={() => setLangOpen(true)}
          onMouseLeave={() => setTimeout(() => setLangOpen(false), 150)}
        >
          <button style={{
            background: 'none', border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '6px', padding: '5px 10px', cursor: 'pointer',
            color: '#C9A84C', fontSize: '12px', fontWeight: '600',
            display: 'flex', alignItems: 'center', gap: '4px',
          }}>
            🌐 <span style={{ fontSize: '11px' }}>Languages</span>
          </button>
          {langOpen && (
            <div
              style={{
                position: 'absolute', top: 'calc(100% + 4px)', right: 0,
                background: '#111', border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: '10px', padding: '8px', minWidth: '160px',
                zIndex: 200, display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: '4px', boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
              }}
              onMouseEnter={() => setLangOpen(true)}
              onMouseLeave={() => setLangOpen(false)}
            >
              {FLAG_LANGS.map(l => (
                <Link key={l.href} href={l.href}
                  onClick={() => {
                    setLangOpen(false)
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('gsb_lang', l.lang)
                    }
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '7px 10px', borderRadius: '6px',
                    color: pathname === l.href || (l.href !== '/' && pathname.startsWith(l.href)) ? '#C9A84C' : '#888',
                    fontSize: '12px', textDecoration: 'none',
                    transition: 'all 0.15s',
                    background: pathname === l.href || (l.href !== '/' && pathname.startsWith(l.href)) ? 'rgba(201,168,76,0.1)' : 'transparent',
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = 'rgba(201,168,76,0.1)'
                    e.currentTarget.style.color = '#C9A84C'
                  }}
                  onMouseOut={e => {
                    const isActive = pathname === l.href || (l.href !== '/' && pathname.startsWith(l.href))
                    e.currentTarget.style.background = isActive ? 'rgba(201,168,76,0.1)' : 'transparent'
                    e.currentTarget.style.color = isActive ? '#C9A84C' : '#888'
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={l.flag} alt={l.label} width={20} height={15} style={{ borderRadius: '1px' }} />
                  <span>{l.code}</span> <span>{l.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <a href="tel:8016358462" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
          color: '#0A0A0A', fontWeight: '600', fontSize: '13px',
          padding: '10px 20px', borderRadius: '8px', textDecoration: 'none',
        }}>
          📞 801.635.8462
        </a>
      </div>

      <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu-btn-es"
        style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#F5F3EE' }}>
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          {menuOpen ? (
            <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
          ) : (
            <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
          )}
        </svg>
      </button>

      {menuOpen && (
        <div style={{
          position: 'absolute', top: '72px', left: 0, right: 0,
          background: 'rgba(10,10,10,0.98)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(201,168,76,0.2)',
          padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px',
        }}>
          {navLinks.map(link => (
            <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)} style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: '#F5F3EE',
              textDecoration: 'none', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              {link.label}
            </Link>
          ))}
          {/* Language grid on mobile — 3 columns */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px',
            paddingTop: '8px',
          }}>
            {FLAG_LANGS.map(lang => (
              <Link key={lang.label} href={lang.href} onClick={() => {
                setMenuOpen(false)
                if (typeof window !== 'undefined') {
                  localStorage.setItem('gsb_lang', lang.lang)
                }
              }} style={{
                padding: '7px 12px', border: '1px solid rgba(201,168,76,0.4)',
                borderRadius: '6px', fontSize: '12px', fontWeight: '600',
                color: '#C9A84C', textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: '5px',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={lang.flag} alt={lang.label} width={20} height={15} style={{ borderRadius: '1px' }} />
                <span>{lang.label}</span>
              </Link>
            ))}
          </div>
          <a href="tel:8016358462" style={{
            color: '#C9A84C', textDecoration: 'none',
            fontFamily: 'Cormorant Garamond, serif', fontSize: '20px',
          }}>
            📞 801.635.8462
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 1100px) {
          .nav-links-es { display: none !important; }
          .mobile-menu-btn-es { display: block !important; }
        }
      `}</style>
    </nav>
  )
}
