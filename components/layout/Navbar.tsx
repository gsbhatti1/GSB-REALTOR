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

const RESOURCES_LINKS = [
  { href: '/blog', label: 'Blog' },
  { href: '/market-reports', label: 'Market Reports' },
  { href: '/testimonials', label: 'Reviews' },
  { href: '/about', label: 'About' },
  { href: '/team', label: 'Team' },
]

const NAV_LINKS = [
  { href: '/search', label: 'Search Homes' },
  { href: '/sell', label: 'Sell' },
  { href: '/commercial', label: 'Commercial' },
  { href: '/investor', label: 'Investor' },
  { href: '/contact', label: 'Contact' },
]

function getCurrentLang(pathname: string) {
  if (pathname.startsWith('/es')) return 'ES'
  if (pathname.startsWith('/pt')) return 'PT'
  if (pathname.startsWith('/zh')) return 'ZH'
  return 'EN'
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)

  const langRef = useRef<HTMLDivElement>(null)
  const resourcesRef = useRef<HTMLDivElement>(null)

  const pathname = usePathname()
  const currentLang = getCurrentLang(pathname)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
      if (resourcesRef.current && !resourcesRef.current.contains(e.target as Node)) {
        setResourcesOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '0 28px', height: '72px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      transition: 'all 0.3s ease',
      background: scrolled ? 'rgba(10,10,10,0.96)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(201,168,76,0.15)' : '1px solid transparent',
    }}>

      {/* Left: Logo */}
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

      {/* Center: Desktop nav links */}
      <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {NAV_LINKS.map(link => (
          <Link key={link.label} href={link.href} className="nav-link">
            {link.label}
          </Link>
        ))}

        {/* Resources dropdown */}
        <div
          ref={resourcesRef}
          style={{ position: 'relative' }}
          onMouseEnter={() => setResourcesOpen(true)}
          onMouseLeave={() => setResourcesOpen(false)}
        >
          <button
            onClick={() => setResourcesOpen(!resourcesOpen)}
            className="nav-link"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '8px 12px',
            }}
          >
            Resources
            <svg
              width="12" height="12" viewBox="0 0 12 12" fill="none"
              style={{
                transition: 'transform 0.2s',
                transform: resourcesOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            >
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Dropdown */}
          {resourcesOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 4px)', left: '50%',
              transform: 'translateX(-50%)',
              background: '#111',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: '12px',
              padding: '8px',
              minWidth: '180px',
              boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
              zIndex: 200,
            }}>
              {RESOURCES_LINKS.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setResourcesOpen(false)}
                  className="dropdown-item"
                  style={{
                    display: 'flex', alignItems: 'center',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: '#AAA',
                    fontSize: '13px',
                    transition: 'all 0.15s',
                    borderLeft: '2px solid transparent',
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Sign In + Lang + Phone */}
      <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

        {/* Language globe */}
        <div ref={langRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            title="Language / Idioma"
            style={{
              background: 'none',
              border: '1px solid rgba(201,168,76,0.25)',
              borderRadius: '6px',
              padding: '5px 8px',
              color: '#C9A84C',
              fontSize: '15px',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center',
              lineHeight: 1,
            }}
          >
            🌐
          </button>
          {langOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              background: '#0f0f0f',
              border: '1px solid rgba(201,168,76,0.25)',
              borderRadius: '10px',
              padding: '8px',
              display: 'flex', flexDirection: 'column', gap: '4px',
              minWidth: '130px',
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
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '8px 12px', borderRadius: '7px',
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

        {/* Sign In button */}
        <Link href="/signin" className="signin-btn" style={{
          fontSize: '12px', fontWeight: '600',
          color: '#C9A84C',
          border: '1px solid rgba(201,168,76,0.35)',
          borderRadius: '7px',
          padding: '7px 14px',
          textDecoration: 'none',
          letterSpacing: '0.04em',
          whiteSpace: 'nowrap',
          transition: 'all 0.2s',
        }}>
          Sign In
        </Link>

        {/* Phone */}
        <a href="tel:8016358462" className="nav-phone" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          color: '#C9A84C', fontWeight: '700', fontSize: '13px',
          textDecoration: 'none',
          letterSpacing: '0.03em', whiteSpace: 'nowrap',
        }}>
          801.635.8462
        </a>
      </div>

      {/* Mobile hamburger */}
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

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: '72px', left: 0, right: 0,
          background: 'rgba(10,10,10,0.98)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(201,168,76,0.2)',
          padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '4px',
        }}>
          {NAV_LINKS.map(link => (
            <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)} style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: '16px', color: '#F5F3EE',
              textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>
              {link.label}
            </Link>
          ))}
          {/* Resources items flat on mobile */}
          {RESOURCES_LINKS.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: '#999',
              textDecoration: 'none', padding: '10px 0 10px 12px',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              borderLeft: '2px solid rgba(201,168,76,0.3)',
              paddingLeft: '16px',
            }}>
              {link.label}
            </Link>
          ))}
          <Link href="/signin" onClick={() => setMenuOpen(false)} style={{
            fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: '#C9A84C',
            textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
            fontWeight: '600',
          }}>
            Sign In
          </Link>
          <Link href="/signup" onClick={() => setMenuOpen(false)} style={{
            fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: '#888',
            textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}>
            Create Account
          </Link>
          {/* Language toggle */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', paddingTop: '8px' }}>
            {LANG_OPTIONS.map(lang => (
              <Link key={lang.code} href={lang.path} onClick={() => {
                setMenuOpen(false)
                if (typeof window !== 'undefined') {
                  localStorage.setItem('gsb_language_selected', lang.code)
                }
              }} style={{
                padding: '7px 12px', border: '1px solid rgba(201,168,76,0.4)',
                borderRadius: '6px', fontSize: '12px', fontWeight: '600',
                color: '#C9A84C', textDecoration: 'none',
                background: currentLang === lang.label ? 'rgba(201,168,76,0.08)' : 'transparent',
                display: 'flex', alignItems: 'center', gap: '5px',
              }}>
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </Link>
            ))}
          </div>
          <a href="tel:8016358462" style={{
            color: '#C9A84C', textDecoration: 'none',
            fontFamily: 'Cormorant Garamond, serif', fontSize: '20px',
            paddingTop: '8px', fontWeight: '600',
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
          padding: 8px 12px;
          border-radius: 7px;
        }
        .nav-link:hover { color: #C9A84C; }
        .dropdown-item:hover {
          color: #C9A84C !important;
          border-left-color: #C9A84C !important;
          background: rgba(201,168,76,0.06) !important;
        }
        .signin-btn:hover {
          background: rgba(201,168,76,0.08) !important;
          border-color: rgba(201,168,76,0.6) !important;
        }
        .nav-phone:hover { opacity: 0.75; }
        /* Desktop: hide hamburger */
        .mobile-menu-btn { display: none !important; }
        @media (max-width: 1024px) {
          .nav-links { display: none !important; }
          .nav-right { display: none !important; }
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
