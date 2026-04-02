'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const HERO_SLIDES = [
  {
    image: '/images/gurpreet-standing.jpg',
    headline: 'Utah Real Estate',
    subheadline: 'Done Different.',
    accent: 'Integrity. Discipline. Results.',
  },
  {
    image: '/images/gurpreet-headshot-pro.jpg',
    headline: 'Your Dream Home',
    subheadline: 'Starts Here.',
    accent: '17,000+ Active Utah Listings',
  },
  {
    image: '/images/gurpreet-headshot-smile.jpg',
    headline: 'USMC Veteran',
    subheadline: 'REALTOR®',
    accent: 'UT · NV · WY Licensed',
  },
]

export default function HeroCinematic() {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % HERO_SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .hero-content { padding: 0 24px !important; padding-top: 72px !important; }
          .hero-stats { gap: 24px !important; }
          .hero-ctas { flex-direction: column !important; }
          .hero-ctas a { text-align: center; justify-content: center !important; }
        }
      `}</style>

      {/* Hero — Full Viewport */}
      <section style={{
        position: 'relative',
        height: '100vh',
        minHeight: '600px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}>
        {/* TODO: When video is ready, replace image slides with:
          <video autoPlay muted loop playsInline style={{objectFit:'cover',width:'100%',height:'100%',filter:'brightness(0.35)'}}>
            <source src="/videos/gurpreet-hero.mp4" type="video/mp4" />
          </video>
        */}

        {/* Sliding background photos */}
        {HERO_SLIDES.map((slide, i) => (
          <div key={i} style={{
            position: 'absolute',
            inset: 0,
            opacity: activeSlide === i ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out',
            zIndex: 1,
          }}>
            <Image
              src={slide.image}
              alt={slide.headline}
              fill
              priority={i === 0}
              style={{
                objectFit: 'cover',
                objectPosition: 'center top',
                filter: 'brightness(0.35)',
              }}
            />
          </div>
        ))}

        {/* Gold gradient overlay at bottom */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: 'linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,0.3) 40%, transparent 70%)',
        }} />

        {/* Left edge gold accent line */}
        <div style={{
          position: 'absolute', left: 0, top: '15%', bottom: '15%',
          width: '3px', background: 'linear-gradient(to bottom, transparent, #C9A84C, transparent)',
          zIndex: 3,
        }} />

        {/* Content */}
        <div className="hero-content" style={{
          position: 'relative', zIndex: 4,
          maxWidth: '1200px', margin: '0 auto',
          padding: '0 48px',
          paddingTop: '72px',
          width: '100%',
        }}>
          {/* Slide accent label */}
          <div style={{
            fontSize: '11px', letterSpacing: '0.2em',
            textTransform: 'uppercase', color: '#C9A84C',
            marginBottom: '24px',
            transition: 'opacity 0.8s',
          }}>
            {HERO_SLIDES[activeSlide].accent}
          </div>

          {/* Main headline */}
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(52px, 8vw, 110px)',
            fontWeight: '300',
            color: '#F5F3EE',
            lineHeight: '0.95',
            margin: '0 0 8px 0',
            letterSpacing: '-0.02em',
          }}>
            {HERO_SLIDES[activeSlide].headline}
          </h1>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(52px, 8vw, 110px)',
            fontWeight: '300',
            fontStyle: 'italic',
            color: '#C9A84C',
            lineHeight: '0.95',
            margin: '0 0 40px 0',
            letterSpacing: '-0.02em',
          }}>
            {HERO_SLIDES[activeSlide].subheadline}
          </h1>

          {/* CTA Buttons */}
          <div className="hero-ctas" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '60px' }}>
            <Link href="/search" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#C9A84C', color: '#0A0A0A',
              padding: '16px 36px', borderRadius: '4px',
              fontWeight: '700', fontSize: '14px',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              textDecoration: 'none',
            }}>
              Search Homes →
            </Link>
            <a href="tel:8016358462" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              border: '1px solid rgba(245,243,238,0.4)', color: '#F5F3EE',
              padding: '16px 36px', borderRadius: '4px',
              fontWeight: '600', fontSize: '14px',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              textDecoration: 'none',
            }}>
              📞 801.635.8462
            </a>
          </div>

          {/* Stats bar */}
          <div className="hero-stats" style={{
            display: 'flex', gap: '48px', flexWrap: 'wrap',
          }}>
            {[
              { value: '17K+', label: 'Active Listings' },
              { value: '$7.3M+', label: 'Volume Closed' },
              { value: '6', label: 'Languages Served' },
              { value: '< 1hr', label: 'Response Time' },
            ].map(stat => (
              <div key={stat.label}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', color: '#C9A84C', fontWeight: '300' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '11px', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slide dots */}
        <div style={{
          position: 'absolute', bottom: '32px', left: '48px',
          display: 'flex', gap: '8px', zIndex: 4,
        }}>
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setActiveSlide(i)} style={{
              width: i === activeSlide ? '28px' : '8px',
              height: '3px',
              background: i === activeSlide ? '#C9A84C' : 'rgba(255,255,255,0.3)',
              border: 'none', cursor: 'pointer', borderRadius: '2px',
              transition: 'all 0.4s ease', padding: 0,
            }} />
          ))}
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '32px', right: '48px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: '8px', zIndex: 4, color: '#888', fontSize: '10px',
          letterSpacing: '0.15em', textTransform: 'uppercase',
        }}>
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, transparent, #C9A84C)' }} />
          Scroll
        </div>
      </section>
    </>
  )
}
