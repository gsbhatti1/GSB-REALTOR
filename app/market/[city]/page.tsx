import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PropertyCard from '@/components/listings/PropertyCard'
import LeadForm from '@/components/ui/LeadForm'
import { searchProperties, formatPrice } from '@/lib/mls'
import type { Metadata } from 'next'

export const revalidate = 3600 // Revalidate hourly

// All 50 Utah cities for SEO pages
const UTAH_CITIES: Record<string, { name: string; county: string; description: string; zipCodes: string[] }> = {
  'salt-lake-city': {
    name: 'Salt Lake City',
    county: 'Salt Lake',
    description: 'Utah\'s capital and largest city. Downtown condos, historic avenues, and everything in between.',
    zipCodes: ['84101', '84102', '84103', '84104', '84105', '84106', '84108', '84111', '84115', '84116'],
  },
  'west-jordan': {
    name: 'West Jordan',
    county: 'Salt Lake',
    description: 'Growing suburban city with excellent schools and fast freeway access to SLC and Provo.',
    zipCodes: ['84081', '84084', '84088'],
  },
  'sandy': {
    name: 'Sandy',
    county: 'Salt Lake',
    description: 'Premier suburban community with top-rated schools, close to Big Cottonwood Canyon skiing.',
    zipCodes: ['84070', '84092', '84093', '84094'],
  },
  'south-jordan': {
    name: 'South Jordan',
    county: 'Salt Lake',
    description: 'One of Utah\'s fastest-growing cities with new construction, retail, and family amenities.',
    zipCodes: ['84009', '84095'],
  },
  'taylorsville': {
    name: 'Taylorsville',
    county: 'Salt Lake',
    description: 'Central Salt Lake County city with affordable homes and easy I-215 access.',
    zipCodes: ['84118', '84123', '84129'],
  },
  'murray': {
    name: 'Murray',
    county: 'Salt Lake',
    description: 'Central location with TRAX access, Intermountain Medical Center, and vibrant retail corridor.',
    zipCodes: ['84107', '84117', '84121', '84157'],
  },
  'provo': {
    name: 'Provo',
    county: 'Utah',
    description: 'BYU college town with a booming tech sector — Utah Valley\'s largest city.',
    zipCodes: ['84601', '84602', '84603', '84604', '84605', '84606'],
  },
  'orem': {
    name: 'Orem',
    county: 'Utah',
    description: 'UVU campus city with a strong mix of residential, retail, and commercial real estate.',
    zipCodes: ['84057', '84058', '84059', '84097'],
  },
  'ogden': {
    name: 'Ogden',
    county: 'Weber',
    description: 'Historic mountain city with affordable housing, Ogden River revitalization, and ski access.',
    zipCodes: ['84401', '84403', '84404', '84405', '84408'],
  },
  'layton': {
    name: 'Layton',
    county: 'Davis',
    description: 'Davis County\'s largest city, home to Hill AFB, with excellent schools and tight-knit community.',
    zipCodes: ['84040', '84041'],
  },
  'st-george': {
    name: 'St. George',
    county: 'Washington',
    description: 'Southern Utah\'s hottest market. Red rock views, warm weather, and rapid growth.',
    zipCodes: ['84770', '84771', '84780', '84790'],
  },
  'logan': {
    name: 'Logan',
    county: 'Cache',
    description: 'USU college town in Cache Valley — affordable, family-friendly, and growing.',
    zipCodes: ['84321', '84322'],
  },
  'draper': {
    name: 'Draper',
    county: 'Salt Lake',
    description: 'Affluent foothills community with tech companies, luxury homes, and mountain views.',
    zipCodes: ['84020'],
  },
  'herriman': {
    name: 'Herriman',
    county: 'Salt Lake',
    description: 'Booming southwest Salt Lake County with new construction and excellent value.',
    zipCodes: ['84096'],
  },
  'riverton': {
    name: 'Riverton',
    county: 'Salt Lake',
    description: 'Quiet suburban city with top schools, parks, and growing commercial development.',
    zipCodes: ['84065'],
  },
  'lehi': {
    name: 'Lehi',
    county: 'Utah',
    description: 'Silicon Slopes headquarters. Adobe, IM Flash, and hundreds of tech companies call Lehi home.',
    zipCodes: ['84043'],
  },
  'west-valley-city': {
    name: 'West Valley City',
    county: 'Salt Lake',
    description: 'Salt Lake County\'s second-largest city with diverse neighborhoods and affordable housing.',
    zipCodes: ['84119', '84120', '84128'],
  },
  'millcreek': {
    name: 'Millcreek',
    county: 'Salt Lake',
    description: 'Incorporated 2017 — walkable neighborhoods, canyon access, and artsy local culture.',
    zipCodes: ['84106', '84109', '84117'],
  },
  'cottonwood-heights': {
    name: 'Cottonwood Heights',
    county: 'Salt Lake',
    description: 'Ski country living with Big and Little Cottonwood Canyons in your backyard.',
    zipCodes: ['84047', '84121'],
  },
  'midvale': {
    name: 'Midvale',
    county: 'Salt Lake',
    description: 'Affordable central location with TRAX access and strong rental market.',
    zipCodes: ['84047'],
  },
  'bountiful': {
    name: 'Bountiful',
    county: 'Davis',
    description: 'First city settled in Utah after SLC — stunning valley views and strong community.',
    zipCodes: ['84010'],
  },
  'holladay': {
    name: 'Holladay',
    county: 'Salt Lake',
    description: 'Upscale east-side community with luxury homes, top schools, and Cottonwood access.',
    zipCodes: ['84117', '84124'],
  },
  'springville': {
    name: 'Springville',
    county: 'Utah',
    description: 'Art City of Utah — charming community just south of Provo with strong residential market.',
    zipCodes: ['84663'],
  },
  'spanish-fork': {
    name: 'Spanish Fork',
    county: 'Utah',
    description: 'Fast-growing Utah Valley city with new development and exceptional value for families.',
    zipCodes: ['84660'],
  },
  'payson': {
    name: 'Payson',
    county: 'Utah',
    description: 'Southern Utah Valley with affordable land, mountain proximity, and growing infrastructure.',
    zipCodes: ['84651'],
  },
  'clearfield': {
    name: 'Clearfield',
    county: 'Davis',
    description: 'Strategic Davis County location near Hill AFB with affordable housing and strong rental demand.',
    zipCodes: ['84015'],
  },
  'syracuse': {
    name: 'Syracuse',
    county: 'Davis',
    description: 'Lakeside Davis County city with new construction and rapid population growth.',
    zipCodes: ['84075'],
  },
  'farmington': {
    name: 'Farmington',
    county: 'Davis',
    description: 'Station Park mixed-use development, TRAX access, and executive-level neighborhoods.',
    zipCodes: ['84025'],
  },
  'kaysville': {
    name: 'Kaysville',
    county: 'Davis',
    description: 'Classic Davis County community — tree-lined streets, fruit trees, and top schools.',
    zipCodes: ['84037'],
  },
  'clinton': {
    name: 'Clinton',
    county: 'Davis',
    description: 'Affordable North Davis County city near Hill AFB with growing residential inventory.',
    zipCodes: ['84015'],
  },
  'north-salt-lake': {
    name: 'North Salt Lake',
    county: 'Davis',
    description: 'Close-in Davis County with I-15 and Legacy Highway access — commuter\'s dream.',
    zipCodes: ['84054'],
  },
  'woods-cross': {
    name: 'Woods Cross',
    county: 'Davis',
    description: 'Small city with excellent TRAX connection and FrontRunner access to SLC.',
    zipCodes: ['84087'],
  },
  'centerville': {
    name: 'Centerville',
    county: 'Davis',
    description: 'Hillside community with panoramic views of the Wasatch Front and Great Salt Lake.',
    zipCodes: ['84014'],
  },
  'bluffdale': {
    name: 'Bluffdale',
    county: 'Salt Lake',
    description: 'Rapid growth with large lots, new builds, and NSA data center as anchor employer.',
    zipCodes: ['84065'],
  },
  'saratoga-springs': {
    name: 'Saratoga Springs',
    county: 'Utah',
    description: 'Lakefront Silicon Slopes city — one of Utah\'s fastest growing with tech-fueled demand.',
    zipCodes: ['84045'],
  },
  'eagle-mountain': {
    name: 'Eagle Mountain',
    county: 'Utah',
    description: 'Affordable western Utah County with explosive growth and large family-friendly lots.',
    zipCodes: ['84005'],
  },
  'american-fork': {
    name: 'American Fork',
    county: 'Utah',
    description: 'Historic Utah Valley city on Orem\'s north border — strong local economy and schools.',
    zipCodes: ['84003'],
  },
  'highland': {
    name: 'Highland',
    county: 'Utah',
    description: 'Upscale Utah Valley community with large lots, Alpine schools, and mountain views.',
    zipCodes: ['84003'],
  },
  'alpine': {
    name: 'Alpine',
    county: 'Utah',
    description: 'Exclusive foothill community — large estates, low density, and some of Utah\'s best schools.',
    zipCodes: ['84004'],
  },
  'cedar-city': {
    name: 'Cedar City',
    county: 'Iron',
    description: 'Southern Utah university city gateway to Zion and Bryce Canyon. Growing fast.',
    zipCodes: ['84720', '84721'],
  },
  'washington': {
    name: 'Washington',
    county: 'Washington',
    description: 'Fastest-growing Washington County city adjacent to St. George — desert luxury living.',
    zipCodes: ['84780'],
  },
  'ivins': {
    name: 'Ivins',
    county: 'Washington',
    description: 'Red Mountain and Snow Canyon access — retirement and resort living in Southern Utah.',
    zipCodes: ['84738'],
  },
  'santa-clara': {
    name: 'Santa Clara',
    county: 'Washington',
    description: 'Historic pioneer community adjacent to St. George with distinctive red rock character.',
    zipCodes: ['84765'],
  },
  'hurricane': {
    name: 'Hurricane',
    county: 'Washington',
    description: 'Zion National Park gateway with affordable Southern Utah land and homes.',
    zipCodes: ['84737'],
  },
  'moab': {
    name: 'Moab',
    county: 'Grand',
    description: 'Adventure tourism capital. Investment rentals, Airbnb, and unique desert real estate.',
    zipCodes: ['84532'],
  },
}

type Params = { city: string }

export async function generateStaticParams() {
  return Object.keys(UTAH_CITIES).map(city => ({ city }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const cityData = UTAH_CITIES[params.city]
  if (!cityData) return { title: 'City Not Found' }

  return {
    title: `${cityData.name} Homes for Sale | Utah MLS | GSB Realtor`,
    description: `Search all ${cityData.name}, Utah homes for sale. Live WFRMLS data. Work with Gurpreet Bhatti — your local ${cityData.name} real estate expert. ${cityData.description}`,
    keywords: [
      `${cityData.name} homes for sale`,
      `${cityData.name} real estate`,
      `${cityData.name} Utah homes`,
      `${cityData.name} MLS listings`,
      `houses for sale ${cityData.name} Utah`,
      'Gurpreet Bhatti realtor',
    ],
    openGraph: {
      title: `${cityData.name} Homes for Sale | GSB Realtor`,
      description: `Live Utah MLS listings in ${cityData.name}. Expert local agent. Search now.`,
    },
  }
}

export default async function CityPage({ params }: { params: Params }) {
  const cityData = UTAH_CITIES[params.city]
  if (!cityData) notFound()

  // Fetch live listings for this city
  const result = await searchProperties({
    city: cityData.name,
    status: 'Active',
    top: 12,
    orderBy: 'OnMarketDate desc',
  }).catch(() => ({ properties: [], total: 0, hasMore: false }))

  const { properties, total } = result

  // Calculate quick stats
  const prices = properties.map(p => p.ListPrice).filter(Boolean)
  const avgPrice = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0
  const medianPrice = prices.length ? [...prices].sort((a, b) => a - b)[Math.floor(prices.length / 2)] : 0

  const otherCities = Object.entries(UTAH_CITIES)
    .filter(([slug]) => slug !== params.city)
    .slice(0, 12)
    .map(([slug, data]) => ({ slug, name: data.name }))

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '72px', background: '#0A0A0A', minHeight: '100vh' }}>

        {/* Hero */}
        <section style={{
          padding: 'clamp(60px, 7vw, 96px) 32px',
          background: 'linear-gradient(180deg, #0D0D0D 0%, #0A0A0A 100%)',
          borderBottom: '1px solid rgba(201,168,76,0.12)',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Breadcrumb */}
            <div style={{ marginBottom: '24px', fontSize: '13px', color: '#555', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Link href="/" style={{ color: '#555', textDecoration: 'none' }}>Home</Link>
              <span>/</span>
              <Link href="/search" style={{ color: '#555', textDecoration: 'none' }}>Search</Link>
              <span>/</span>
              <span style={{ color: '#888' }}>{cityData.name}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#C9A84C', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>
                  {cityData.county} County · Utah
                </div>
                <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: '300', color: '#F5F3EE', lineHeight: '1.0', marginBottom: '8px' }}>
                  {cityData.name}
                </h1>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(20px, 2.5vw, 28px)', fontStyle: 'italic', color: '#C9A84C', fontWeight: '400', marginBottom: '24px' }}>
                  Homes for Sale
                </h2>
                <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.8', marginBottom: '32px', maxWidth: '500px' }}>
                  {cityData.description} Browse all live {cityData.name} listings directly
                  from WFRMLS — Utah&apos;s official MLS. Updated every 5 minutes.
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <Link href={`/search?city=${encodeURIComponent(cityData.name)}`} style={{
                    display: 'inline-block',
                    background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
                    color: '#0A0A0A', fontWeight: '600', fontSize: '14px',
                    padding: '14px 28px', borderRadius: '8px', textDecoration: 'none',
                    letterSpacing: '0.04em',
                  }}>
                    Search All {cityData.name} Listings →
                  </Link>
                  <Link href="/contact" style={{
                    display: 'inline-block',
                    background: 'transparent',
                    color: 'rgba(245,243,238,0.8)', fontSize: '14px',
                    padding: '14px 28px', borderRadius: '8px', textDecoration: 'none',
                    border: '1px solid rgba(255,255,255,0.15)',
                  }}>
                    Talk to Gurpreet
                  </Link>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { val: total.toLocaleString() || '—', label: 'Active Listings', sub: 'Live from WFRMLS' },
                  { val: avgPrice ? formatPrice(avgPrice) : '—', label: 'Average Price', sub: 'Active listings' },
                  { val: medianPrice ? formatPrice(medianPrice) : '—', label: 'Median Price', sub: 'Current market' },
                  { val: cityData.county, label: 'County', sub: 'Utah' },
                ].map(s => (
                  <div key={s.label} style={{
                    padding: '24px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '12px',
                  }}>
                    <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: '600', color: '#C9A84C', lineHeight: '1', marginBottom: '6px' }}>
                      {s.val}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: '#F5F3EE', marginBottom: '2px' }}>{s.label}</div>
                    <div style={{ fontSize: '11px', color: '#555' }}>{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Listings */}
        <section style={{ padding: '80px 32px', background: '#0A0A0A' }}>
          <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#C9A84C', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>Live from WFRMLS</div>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: '400', color: '#F5F3EE' }}>
                  {properties.length > 0 ? `${properties.length} Featured ${cityData.name} Homes` : `${cityData.name} Listings`}
                </h2>
              </div>
              <Link href={`/search?city=${encodeURIComponent(cityData.name)}`} style={{
                padding: '10px 24px', background: 'transparent', fontSize: '13px',
                border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px',
                color: 'rgba(245,243,238,0.7)', textDecoration: 'none',
              }}>
                View All {total}+ Listings →
              </Link>
            </div>

            {properties.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {properties.map((property, i) => (
                  <PropertyCard key={property.ListingKey} property={property} priority={i < 4} />
                ))}
              </div>
            ) : (
              <div style={{ padding: '64px 40px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed rgba(201,168,76,0.15)' }}>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>🏠</div>
                <p style={{ color: '#555', fontSize: '15px', marginBottom: '8px' }}>
                  Live {cityData.name} listings will appear here once the WFRMLS token is active.
                </p>
                <Link href={`/search?city=${encodeURIComponent(cityData.name)}`} style={{ color: '#C9A84C', textDecoration: 'none', fontSize: '14px' }}>
                  Search {cityData.name} Listings →
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* About this city + Lead capture */}
        <section style={{ padding: '80px 32px', background: '#0D0D0D', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'start' }}>
              <div>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: '400', color: '#F5F3EE', marginBottom: '24px', lineHeight: '1.1' }}>
                  Buying or Selling in<br />{cityData.name}?
                </h2>
                <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.8', marginBottom: '24px' }}>
                  Gurpreet Bhatti knows {cityData.name} real estate. He was born and raised
                  in the Salt Lake Valley and has been representing buyers, sellers, and investors
                  across every Utah market for years.
                </p>
                <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.8', marginBottom: '32px' }}>
                  Whether you are a first-time buyer or a seasoned investor looking at commercial
                  properties in {cityData.county} County — Gurpreet runs the numbers, tells you
                  the truth, and closes deals. That&apos;s it.
                </p>

                {/* ZIP codes */}
                {cityData.zipCodes.length > 0 && (
                  <div style={{ marginBottom: '32px' }}>
                    <div style={{ fontSize: '11px', color: '#C9A84C', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
                      ZIP Codes Served
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {cityData.zipCodes.map(zip => (
                        <Link key={zip} href={`/search?city=${encodeURIComponent(cityData.name)}`} style={{
                          padding: '6px 14px', background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)', borderRadius: '100px',
                          fontSize: '13px', color: '#888', textDecoration: 'none',
                        }}>
                          {zip}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <a href="tel:8016358462" style={{ color: '#C9A84C', fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', textDecoration: 'none', display: 'block', marginBottom: '8px' }}>
                  📞 801.635.8462
                </a>
                <div style={{ fontSize: '12px', color: '#555' }}>UT Lic# 12907042-SA00 · Dynasty Point Referral Group</div>
              </div>

              <LeadForm
                leadType="contact_form"
                title={`Get Expert Help in ${cityData.name}`}
                subtitle={`Gurpreet knows ${cityData.name} better than anyone. Responds within the hour.`}
              />
            </div>
          </div>
        </section>

        {/* Other cities */}
        <section style={{ padding: '64px 32px', background: '#0A0A0A', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ fontSize: '11px', color: '#C9A84C', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>Explore Utah</div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: '400', color: '#F5F3EE' }}>
                Search Other Utah Cities
              </h2>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
              {otherCities.map(({ slug, name }) => (
                <Link key={slug} href={`/market/${slug}`} style={{
                  padding: '10px 20px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '100px', fontSize: '14px',
                  color: 'rgba(245,243,238,0.8)', textDecoration: 'none',
                  transition: 'all 0.2s',
                }}>
                  {name}
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
