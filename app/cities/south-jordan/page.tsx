import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Homes for Sale in South Jordan, Utah | GSB Realtor',
  description:
    'Search homes for sale in South Jordan, Utah. Population ~80,000, master-planned communities, median home price ~$520K. Expert local guidance from Gurpreet Bhatti, REALTOR®.',
  alternates: { canonical: 'https://gsbrealtor.com/cities/south-jordan' },
}

export default function SouthJordanPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '72px', background: '#0A0A0A', minHeight: '100vh' }}>
        <section style={{
          padding: 'clamp(48px, 6vw, 80px) 32px',
          background: 'linear-gradient(180deg, #0D0D0D 0%, #0A0A0A 100%)',
          borderBottom: '1px solid rgba(201,168,76,0.12)',
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '28px', fontSize: '13px', color: '#555', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Link href="/" style={{ color: '#555', textDecoration: 'none' }}>Home</Link>
              <span>/</span>
              <Link href="/cities" style={{ color: '#555', textDecoration: 'none' }}>Cities</Link>
              <span>/</span>
              <span style={{ color: '#888' }}>South Jordan</span>
            </div>
            <h1 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: '400', color: '#F5F3EE', lineHeight: '1.1',
              marginBottom: '20px',
            }}>
              South Jordan Utah Real Estate
            </h1>
            <p style={{ fontSize: '17px', color: '#888', lineHeight: '1.8', maxWidth: '680px' }}>
              South Jordan is one of Utah&apos;s fastest-growing cities with a population of approximately 80,000.
              Known for its master-planned communities including Daybreak and the District, South Jordan offers
              new construction, excellent Jordan School District schools, and proximity to the Silicon Slopes
              tech corridor. The city features the Bangerter Highway interchange for fast commutes and a median
              home price of approximately $520,000.
            </p>
          </div>
        </section>

        <section style={{ padding: '64px 32px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '48px' }}>
              <Link href="/search?city=South Jordan" style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
                color: '#0A0A0A', fontWeight: '600', fontSize: '14px',
                padding: '14px 28px', borderRadius: '8px', textDecoration: 'none',
              }}>
                Search South Jordan Homes
              </Link>
              <Link href="/valuation" style={{
                display: 'inline-block', background: 'transparent',
                color: 'rgba(245,243,238,0.8)', fontSize: '14px',
                padding: '14px 28px', borderRadius: '8px', textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.15)',
              }}>
                Get Free Home Valuation
              </Link>
            </div>

            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif', fontSize: '26px',
              fontWeight: '600', color: '#F5F3EE', marginBottom: '24px',
            }}>
              Nearby Cities
            </h2>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {['West Jordan', 'Sandy', 'Draper', 'Riverton', 'Herriman'].map(city => (
                <Link key={city} href={`/market/${city.toLowerCase().replace(/ /g, '-')}`} style={{
                  fontSize: '14px', color: '#C9A84C', textDecoration: 'none',
                  padding: '8px 16px', border: '1px solid rgba(201,168,76,0.2)',
                  borderRadius: '8px',
                }}>
                  {city}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["LocalBusiness", "RealEstateAgent"],
            "name": "GSB Realtor — South Jordan",
            "description": "Expert real estate services in South Jordan, Utah. Buy or sell homes with Gurpreet Bhatti, licensed REALTOR®.",
            "url": "https://gsbrealtor.com/cities/south-jordan",
            "telephone": "+1-801-635-8462",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "South Jordan",
              "addressRegion": "UT",
              "addressCountry": "US"
            },
            "areaServed": {
              "@type": "City",
              "name": "South Jordan",
              "containedInPlace": { "@type": "State", "name": "Utah" }
            },
            "agent": {
              "@type": "Person",
              "name": "Gurpreet Bhatti",
              "jobTitle": "REALTOR®"
            }
          })}}
        />
      </main>
      <Footer />
    </>
  )
}
