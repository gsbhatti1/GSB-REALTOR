'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const LANG_OPTIONS = [
  { code: 'en', flag: '🇺🇸', label: 'EN', path: '/' },
  { code: 'es', flag: '🇲🇽', label: 'ES', path: '/es' },
  { code: 'pt', flag: '🇧🇷', label: 'PT', path: '/pt' },
  { code: 'zh', flag: '🇨🇳', label: 'ZH', path: '/zh' },
]

function getCurrentLang(pathname: string) {
  if (pathname.startsWith('/es')) return 'ES'
  if (pathname.startsWith('/pt')) return 'PT'
  if (pathname.startsWith('/zh')) return 'ZH'
  return 'EN'
}

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [langOpen,  setLangOpen]  = useState(false)
  const langRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const currentLang = getCurrentLang(pathname)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Close lang dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const navLinks = [
    { href: '/search',         label: 'Search Homes' },
    { href: '/sell',           label: 'Sell Your Home' },
    { href: '/commercial',     label: 'Commercial' },
    { href: '/investor',       label: 'Investor Tools' },
    { href: '/testimonials',   label: 'Reviews' },
    { href: '/market-reports', label: 'Market Reports',  hideBelow1280: true },
    { href: '/blog',           label: 'Blog',            hideBelow1280: true },
    { href: '/about',          label: 'About',           hideBelow1280: true },
    { href: '/contact',        label: 'Contact' },
    { href: '/saved',          label: '❤️ Saved' },
  ]

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '0 24px', height: '72px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      transition: 'all 0.3s ease',
      background: scrolled ? 'rgba(10,10,10,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(201,168,76,0.15)' : '1px solid transparent',
    }}>

      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
        <Image
          src="/images/gurpreet-headshot.jpg"
          alt="Gurpreet Bhatti"
          width={36} height={36}
          style={{ borderRadius: '50%', border: '2px solid rgba(201,168,76,0.5)', objectFit: 'cover' }}
        />
        <div>
          <div className="nav-logo-name" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', fontWeight: '600', color: '#F5F3EE', lineHeight: '1.1' }}>
            GSB Realtor
          </div>
          <div className="nav-logo-sub" style={{ fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C9A84C', lineHeight: '1.1' }}>
            Gurpreet Bhatti · REALTOR®
          </div>
        </div>
      </Link>

      {/* Desktop links */}
      <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {navLinks.map(link => (
          <Link
            key={link.label}
            href={link.href}
            className={`nav-link${link.hideBelow1280 ? ' hide-below-1280' : ''}`}
          >
            {link.label}
          </Link>
        ))}

        {/* Language dropdown */}
        <div ref={langRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            style={{
              background: 'none',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: '6px',
              padding: '4px 10px',
              color: '#C9A84C',
              fontSize: '12px',
              cursor: 'pointer',
              letterSpacing: '0.05em',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            🌐 {currentLang}
          </button>
          {langOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              background: '#0f0f0f',
              border: '1px solid rgba(201,168,76,0.25)',
              borderRadius: '10px',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              minWidth: '120px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              zIndex: 200,
            }}>
              {LANG_OPTIONS.map(lang => (
                <Link
                  key={lang.code}
                  href={lang.path}
                  onClick={() => {
                    setLangOpen(false)
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('gsb_language_selected', lang.code)
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    borderRadius: '7px',
                    textDecoration: 'none',
                    color: currentLang === lang.label ? '#C9A84C' : '#888',
                    fontSize: '13px',
                    background: currentLang === lang.label ? 'rgba(201,168,76,0.08)' : 'transparent',
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{lang.flag}</span>
                  <span>{lang.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Sign In — subtle */}
        <Link href="/login" style={{
          fontSize: '12px',
          color: 'rgba(245,243,238,0.45)',
          textDecoration: 'none',
          letterSpacing: '0.04em',
          whiteSpace: 'nowrap',
          transition: 'color 0.2s',
        }}
        onMouseOver={e => (e.currentTarget.style.color = '#C9A84C')}
        onMouseOut={e => (e.currentTarget.style.color = 'rgba(245,243,238,0.45)')}>
          Sign In
        </Link>

        <a href="tel:8016358462" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
          color: '#0A0A0A', fontWeight: '600', fontSize: '12px',
          padding: '9px 16px', borderRadius: '8px', textDecoration: 'none',
          letterSpacing: '0.04em', whiteSpace: 'nowrap',
        }}>
          📞 801.635.8462
        </a>
      </div>

      {/* Mobile button — shown only via CSS media query, never inline display:none */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="mobile-menu-btn"
        aria-label="Toggle menu"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#F5F3EE' }}
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          {menuOpen ? (
            <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
          ) : (
            <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
          )}
        </svg>
      </button>

      {/* Mobile dropdown */}
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
          <Link href="/login" onClick={() => setMenuOpen(false)} style={{
            fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: '#C9A84C',
            textDecoration: 'none', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            Sign In / Create Account
          </Link>
          {/* Language toggle in mobile */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            {LANG_OPTIONS.map(lang => (
              <Link key={lang.code} href={lang.path} onClick={() => {
                setMenuOpen(false)
                if (typeof window !== 'undefined') {
                  localStorage.setItem('gsb_language_selected', lang.code)
                }
              }} style={{
                padding: '8px 14px', border: '1px solid rgba(201,168,76,0.5)',
                borderRadius: '6px', fontSize: '13px', fontWeight: '600',
                color: '#C9A84C', textDecoration: 'none',
                background: currentLang === lang.label ? 'rgba(201,168,76,0.08)' : 'transparent',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <span>{lang.flag}</span>
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
        .nav-link {
          font-family: DM Sans, sans-serif;
          font-size: 13px;
          color: rgba(245,243,238,0.75);
          text-decoration: none;
          transition: color 0.2s;
          letter-spacing: 0.01em;
          white-space: nowrap;
        }
        .nav-link:hover { color: #C9A84C; }
        /* Desktop: hide hamburger */
        .mobile-menu-btn { display: none !important; }
        @media (max-width: 1280px) {
          .hide-below-1280 { display: none !important; }
        }
        @media (max-width: 1100px) {
          .nav-links { display: none !important; }
          .mobile-menu-btn { display: flex !important; align-items: center; justify-content: center; }
        }
        @media (max-width: 480px) {
          .nav-logo-name { font-size: 15px !important; }
          .nav-logo-sub { display: none !important; }
        }
      `}</style>
    </nav>
  )
}
