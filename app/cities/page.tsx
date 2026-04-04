import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Utah Cities — Homes for Sale | GSB Realtor',
  description:
    'Browse homes for sale across Utah's top cities. West Jordan, Sandy, Draper, South Jordan, Provo and more. Expert local guidance from Gurpreet Bhatti, REALTOR® & USMC Veteran.',
  alternates: { canonical: 'https://gsbrealtor.com/cities' },
}

const CITIES = [
  { slug: 'west-jordan', name: 'West Jordan', county: 'Salt Lake', median: '$450K', pop: '~120,000' },
  { slug: 'sandy', name: 'Sandy', county: 'Salt Lake', median: '$500K', pop: '~95,000' },
  { slug: 'draper', name: 'Draper', county: 'Salt Lake', median: '$600K', pop: '~50,000' },
  { slug: 'south-jordan', name: 'South Jordan', county: 'Salt Lake', median: '$520K', pop: '~80,000' },
  { slug: 'provo', name: 'Provo', county: 'Utah', median: '$400K', pop: '~120,000' },
]

export default function CitiesHubPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '72px', background: '#0A0A0A', minHeight: '100vh' }}>
        <section style={{
          padding: 'clamp(48px, 6vw, 80px) 32px',
          background: 'linear-gradient(180deg, #0D0D0D 0%, #0A0A0A 100%)',
          borderBottom: '1px solid rgba(201,168,76,0.12)',
        }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{
              fontSize: '11px', color: '#C9A84C', letterSpacing: '0.14em',
              textTransform: 'uppercase', marginBottom: '12px',
            }}>
              Utah Real Estate by City
            </div>
            <h1 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: '400', color: '#F5F3EE', lineHeight: '1.1',
              marginBottom: '20px',
            }}>
              Homes for Sale in Utah
            </h1>
            <p style={{ fontSize: '17px', color: '#888', lineHeight: '1.8', maxWidth: '680px' }}>
              Explore real estate in Utah&apos;s most popular cities. Each page includes local market data,
              neighborhood insights, and direct MLS search — powered by Gurpreet Bhatti, licensed
              REALTOR&reg; in UT, NV, and WY.
            </p>
          </div>
        </section>

        <section style={{ padding: '64px 32px' }}>
          <div style={{
            maxWidth: '900px', margin: '0 auto',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px',
          }}>
            {CITIES.map(city => (
              <Link key={city.slug} href={`/cities/${city.slug}`} style={{ textDecoration: 'none' }}>
                <article style={{
                  padding: '28px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                  transition: 'border-color 0.2s',
                }}>
                  <h2 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '22px', fontWeight: '600', color: '#F5F3EE',
                    marginBottom: '8px',
                  }}>
                    {city.name}
                  </h2>
                  <div style={{ fontSize: '13px', color: '#555', marginBottom: '12px' }}>
                    {city.county} County &middot; Pop. {city.pop}
                  </div>
                  <div style={{
                    fontSize: '14px', color: '#C9A84C', fontWeight: '600',
                  }}>
                    Median Home: {city.median}
                  </div>
                </article>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link href="/market" style={{
              display: 'inline-block',
              padding: '14px 28px',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px', fontSize: '14px',
              color: 'rgba(245,243,238,0.7)', textDecoration: 'none',
            }}>
              View All 45+ Utah Cities
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
