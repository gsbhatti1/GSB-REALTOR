import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroCinematic from '@/components/ui/HeroCinematic'
import LeadForm from '@/components/ui/LeadForm'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Utah Homes for Sale | GSB Realtor — Gurpreet Bhatti, REALTOR® & USMC Veteran',
  description:
    'Search 17,000+ Utah MLS listings. Buy, sell, or invest in residential and commercial real estate with Gurpreet Bhatti — licensed in UT, NV, WY. Call 801-635-8462.',
  alternates: { canonical: 'https://gsbrealtor.com/home' },
}

const TOP_CITIES = [
  { name: 'Salt Lake City', slug: 'salt-lake-city' },
  { name: 'West Jordan', slug: 'west-jordan' },
  { name: 'Sandy', slug: 'sandy' },
  { name: 'South Jordan', slug: 'south-jordan' },
  { name: 'Draper', slug: 'draper' },
  { name: 'Lehi', slug: 'lehi' },
  { name: 'Provo', slug: 'provo' },
  { name: 'Ogden', slug: 'ogden' },
  { name: 'St. George', slug: 'st-george' },
  { name: 'Park City', slug: 'park-city' },
  { name: 'Herriman', slug: 'herriman' },
  { name: 'Riverton', slug: 'riverton' },
]

const SERVICES = [
  {
    icon: '🏠',
    title: 'Buy a Home',
    description:
      'Search all Utah MLS listings. Get instant alerts. Gurpreet negotiates hard so you pay less.',
    href: '/search',
    cta: 'Search Homes',
  },
  {
    icon: '💰',
    title: 'Sell Your Home',
    description:
      'Free home valuation. Professional marketing. Honest pricing strategy — no inflated numbers.',
    href: '/sell',
    cta: 'Get Valuation',
  },
  {
    icon: '🏢',
    title: 'Commercial',
    description:
      'NNN leases, tenant placement, strip malls, industrial. Three-state licensing for serious investors.',
    href: '/commercial',
    cta: 'Explore Commercial',
  },
  {
    icon: '📈',
    title: 'Invest',
    description:
      'Cap rate analysis, 1031 exchanges, multi-family, and passive income strategy across Utah.',
    href: '/investor',
    cta: 'Investor Hub',
  },
]

export default function HomeContentPage() {
  return (
    <>
      <Navbar />

      {/* ── Hero (full-viewport cinematic) ── */}
      <HeroCinematic />

      {/* ── Services Grid ── */}
      <section
        style={{
          padding: 'clamp(64px, 8vw, 120px) 32px',
          background: '#0A0A0A',
          borderTop: '1px solid rgba(201,168,76,0.08)',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div
            className="section-label"
            style={{ textAlign: 'center', marginBottom: '16px' }}
          >
            What Can Gurpreet Help With?
          </div>
          <h2
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: '300',
              color: '#F5F3EE',
              textAlign: 'center',
              marginBottom: '56px',
            }}
          >
            Full-Service Real Estate
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '24px',
            }}
          >
            {SERVICES.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="feature-card"
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <div style={{ fontSize: '36px', marginBottom: '16px' }}>
                  {s.icon}
                </div>
                <h3
                  style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '24px',
                    fontWeight: '400',
                    color: '#F5F3EE',
                    marginBottom: '12px',
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#888',
                    lineHeight: '1.7',
                    marginBottom: '20px',
                  }}
                >
                  {s.description}
                </p>
                <span
                  style={{
                    fontSize: '13px',
                    color: '#C9A84C',
                    letterSpacing: '0.06em',
                  }}
                >
                  {s.cta} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Browse by City ── */}
      <section
        style={{
          padding: 'clamp(64px, 8vw, 100px) 32px',
          background: '#0D0D0D',
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div
            className="section-label"
            style={{ textAlign: 'center', marginBottom: '16px' }}
          >
            Explore Utah
          </div>
          <h2
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(28px, 3.5vw, 44px)',
              fontWeight: '300',
              color: '#F5F3EE',
              textAlign: 'center',
              marginBottom: '40px',
            }}
          >
            Browse Homes by City
          </h2>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '12px',
            }}
          >
            {TOP_CITIES.map((c) => (
              <Link
                key={c.slug}
                href={`/market/${c.slug}`}
                className="city-pill"
              >
                {c.name}
              </Link>
            ))}
            <Link
              href="/market"
              className="city-pill"
              style={{ color: '#C9A84C', borderColor: 'rgba(201,168,76,0.3)' }}
            >
              View All 45+ Cities →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Gurpreet / Trust Section ── */}
      <section
        style={{
          padding: 'clamp(64px, 8vw, 120px) 32px',
          background: '#0A0A0A',
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div className="section-label" style={{ marginBottom: '16px' }}>
            Why GSB?
          </div>
          <h2
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(28px, 3.5vw, 48px)',
              fontWeight: '300',
              color: '#F5F3EE',
              marginBottom: '32px',
            }}
          >
            Marine Discipline.{' '}
            <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>
              Real Estate Results.
            </span>
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: '#888',
              lineHeight: '1.8',
              marginBottom: '48px',
            }}
          >
            Gurpreet Bhatti served in the United States Marine Corps before
            entering real estate. He brings the same discipline, accountability,
            and mission-first mentality to every transaction. Licensed in Utah,
            Nevada, and Wyoming — he speaks six languages and responds in under
            an hour.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '24px',
              marginBottom: '48px',
            }}
          >
            {[
              { value: 'UT · NV · WY', label: 'Three-State License' },
              { value: '6', label: 'Languages Spoken' },
              { value: '$7.3M+', label: 'Volume Closed' },
              { value: '< 1hr', label: 'Avg. Response Time' },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  padding: '24px 16px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                }}
              >
                <div
                  style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '28px',
                    fontWeight: '400',
                    color: '#C9A84C',
                    marginBottom: '6px',
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: '12px', color: '#888', letterSpacing: '0.04em' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/about"
              className="btn-ghost"
              style={{ padding: '14px 32px' }}
            >
              Read Gurpreet&apos;s Story
            </Link>
            <Link
              href="/track-record"
              className="btn-ghost"
              style={{ padding: '14px 32px' }}
            >
              View Track Record
            </Link>
            <Link
              href="/testimonials"
              className="btn-ghost"
              style={{ padding: '14px 32px' }}
            >
              Client Reviews
            </Link>
          </div>
        </div>
      </section>

      {/* ── Languages Served ── */}
      <section
        style={{
          padding: '56px 32px',
          background: '#0D0D0D',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          textAlign: 'center',
        }}
      >
        <div className="section-label" style={{ marginBottom: '20px' }}>
          We Speak Your Language
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '16px',
            maxWidth: '700px',
            margin: '0 auto',
          }}
        >
          {[
            { flag: 'https://flagcdn.com/w40/us.png', label: 'English', href: '/' },
            { flag: 'https://flagcdn.com/w40/mx.png', label: 'Español', href: '/es' },
            { flag: 'https://flagcdn.com/w40/in.png', label: 'ਪੰਜਾਬੀ', href: '/pa' },
            { flag: 'https://flagcdn.com/w40/sa.png', label: 'العربية', href: '/ar' },
            { flag: 'https://flagcdn.com/w40/cn.png', label: '中文', href: '/zh' },
            { flag: 'https://flagcdn.com/w40/vn.png', label: 'Tiếng Việt', href: '/vi' },
          ].map((lang) => (
            <Link
              key={lang.href}
              href={lang.href}
              className="city-pill"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={lang.flag} alt="" width={24} height={18} style={{ borderRadius: '2px' }} />
              {lang.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Contact CTA + Lead Form ── */}
      <section
        style={{
          padding: 'clamp(64px, 8vw, 100px) 32px',
          background: '#0A0A0A',
          borderTop: '1px solid rgba(201,168,76,0.12)',
        }}
      >
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <LeadForm
            title="Ready to Make a Move?"
            subtitle="Tell Gurpreet what you're looking for. He responds fast — usually within minutes."
            leadType="homepage_form"
          />
        </div>
      </section>

      <Footer />
    </>
  )
}
