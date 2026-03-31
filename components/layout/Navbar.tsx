'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const navLinks = [
    { href: '/search',         label: 'Search Homes' },
    { href: '/sell',           label: 'Sell Your Home' },
    { href: '/commercial',     label: 'Commercial' },
    { href: '/investor',       label: 'Investor Tools' },
    { href: '/market-reports', label: 'Market Reports' },
    { href: '/blog',           label: 'Blog' },
    { href: '/about',          label: 'About' },
    { href: '/contact',        label: 'Contact' },
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

      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
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
      <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        {navLinks.map(link => (
          <Link key={link.label} href={link.href} className="nav-link">
            {link.label}
          </Link>
        ))}
        {/* Language toggle */}
        <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
          <Link href="/es" style={{
            padding: '5px 10px',
            border: '1px solid rgba(201,168,76,0.5)',
            borderRadius: '4px 0 0 4px',
            fontSize: '11px', fontWeight: '600',
            color: '#C9A84C', textDecoration: 'none',
            letterSpacing: '0.06em',
            background: 'transparent',
            transition: 'all 0.2s',
          }}>
            ES
          </Link>
          <Link href="/" style={{
            padding: '5px 10px',
            border: '1px solid rgba(201,168,76,0.5)',
            borderRadius: '0 4px 4px 0',
            fontSize: '11px', fontWeight: '600',
            color: '#C9A84C', textDecoration: 'none',
            letterSpacing: '0.06em',
            background: 'rgba(201,168,76,0.08)',
            transition: 'all 0.2s',
          }}>
            EN
          </Link>
        </div>
        <a href="tel:8016358462" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
          color: '#0A0A0A', fontWeight: '600', fontSize: '13px',
          padding: '10px 20px', borderRadius: '8px', textDecoration: 'none',
          letterSpacing: '0.04em',
        }}>
          📞 801.635.8462
        </a>
      </div>

      {/* Mobile button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="mobile-menu-btn"
        aria-label="Toggle menu"
        style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#F5F3EE' }}
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
          font-size: 14px;
          color: rgba(245,243,238,0.75);
          text-decoration: none;
          transition: color 0.2s;
          letter-spacing: 0.01em;
        }
        .nav-link:hover { color: #C9A84C; }
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
        @media (max-width: 480px) {
          .nav-logo-name { font-size: 15px !important; }
          .nav-logo-sub { display: none !important; }
        }
      `}</style>
    </nav>
  )
}
