import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Utah Real Estate by City | GSB Realtor — Gurpreet Bhatti',
  description: 'Search homes for sale in all Utah cities. Live MLS listings, market data, and expert local knowledge from Gurpreet Bhatti, Utah REALTOR® and USMC Veteran.',
}

const UTAH_CITIES = [
  { name: 'Salt Lake City',   slug: 'salt-lake-city',   county: 'Salt Lake',   description: "Utah's capital city with downtown condos, historic avenues, and the state's most active market." },
  { name: 'West Jordan',      slug: 'west-jordan',      county: 'Salt Lake',   description: 'Growing suburban city with excellent schools and fast freeway access to SLC and Provo.' },
  { name: 'Sandy',            slug: 'sandy',            county: 'Salt Lake',   description: 'Premier community with top-rated schools, close to Big Cottonwood Canyon skiing.' },
  { name: 'South Jordan',     slug: 'south-jordan',     county: 'Salt Lake',   description: "One of Utah's fastest-growing cities with new construction and retail." },
  { name: 'Taylorsville',     slug: 'taylorsville',     county: 'Salt Lake',   description: 'Central Salt Lake County city with affordable homes and easy I-215 access.' },
  { name: 'Murray',           slug: 'murray',           county: 'Salt Lake',   description: 'Central location with TRAX access, Intermountain Medical Center, and vibrant retail.' },
  { name: 'Draper',           slug: 'draper',           county: 'Salt Lake',   description: 'Affluent foothills community with tech companies, luxury homes, and mountain views.' },
  { name: 'Herriman',         slug: 'herriman',         county: 'Salt Lake',   description: 'Booming southwest Salt Lake County with new construction and excellent value.' },
  { name: 'Riverton',         slug: 'riverton',         county: 'Salt Lake',   description: 'Quiet suburban city with top schools, parks, and growing commercial development.' },
  { name: 'Lehi',             slug: 'lehi',             county: 'Utah',        description: 'Silicon Slopes headquarters — Adobe, IM Flash, and hundreds of tech companies.' },
  { name: 'West Valley City', slug: 'west-valley-city', county: 'Salt Lake',   description: "Salt Lake County's second-largest city with diverse neighborhoods and affordable housing." },
  { name: 'Millcreek',        slug: 'millcreek',        county: 'Salt Lake',   description: 'Incorporated 2017 — walkable neighborhoods, canyon access, and artsy local culture.' },
  { name: 'Cottonwood Heights', slug: 'cottonwood-heights', county: 'Salt Lake', description: 'Ski country living with Big and Little Cottonwood Canyons in your backyard.' },
  { name: 'Midvale',          slug: 'midvale',          county: 'Salt Lake',   description: 'Affordable central location with TRAX access and strong rental market.' },
  { name: 'Holladay',         slug: 'holladay',         county: 'Salt Lake',   description: 'Upscale east-side community with luxury homes and Cottonwood access.' },
  { name: 'Bountiful',        slug: 'bountiful',        county: 'Davis',       description: 'First city settled in Utah after SLC — stunning valley views and strong community.' },
  { name: 'North Salt Lake',  slug: 'north-salt-lake',  county: 'Davis',       description: "Close-in Davis County with I-15 and Legacy Highway access — commuter's dream." },
  { name: 'Farmington',       slug: 'farmington',       county: 'Davis',       description: 'Station Park mixed-use development, TRAX access, and executive-level neighborhoods.' },
  { name: 'Kaysville',        slug: 'kaysville',        county: 'Davis',       description: 'Classic Davis County community — tree-lined streets, fruit trees, and top schools.' },
  { name: 'Layton',           slug: 'layton',           county: 'Davis',       description: "Davis County's largest city, home to Hill AFB, with excellent schools." },
  { name: 'Ogden',            slug: 'ogden',            county: 'Weber',       description: 'Historic mountain city with affordable housing and Ogden River revitalization.' },
  { name: 'Roy',              slug: 'roy',              county: 'Weber',       description: 'Affordable Weber County city adjacent to Ogden with Hill AFB proximity.' },
  { name: 'Clearfield',       slug: 'clearfield',       county: 'Davis',       description: 'Strategic Davis County location near Hill AFB with affordable housing.' },
  { name: 'West Haven',       slug: 'west-haven',       county: 'Weber',       description: 'Fast-growing Weber County city with new builds and lakeside access.' },
  { name: 'Provo',            slug: 'provo',            county: 'Utah',        description: "BYU college town with a booming tech sector — Utah Valley's largest city." },
  { name: 'Orem',             slug: 'orem',             county: 'Utah',        description: 'UVU campus city with a strong mix of residential, retail, and commercial real estate.' },
  { name: 'Springville',      slug: 'springville',      county: 'Utah',        description: 'Art City of Utah — charming community just south of Provo.' },
  { name: 'Spanish Fork',     slug: 'spanish-fork',     county: 'Utah',        description: 'Fast-growing Utah Valley city with new development and exceptional value.' },
  { name: 'American Fork',    slug: 'american-fork',    county: 'Utah',        description: "Historic Utah Valley city on Orem's north border — strong local economy." },
  { name: 'Highland',         slug: 'highland',         county: 'Utah',        description: 'Upscale Utah Valley community with large lots and Alpine schools.' },
  { name: 'Alpine',           slug: 'alpine',           county: 'Utah',        description: "Exclusive foothill community — large estates, low density, Utah's best schools." },
  { name: 'Saratoga Springs', slug: 'saratoga-springs', county: 'Utah',        description: "Lakefront Silicon Slopes city — one of Utah's fastest growing with tech-fueled demand." },
  { name: 'Eagle Mountain',   slug: 'eagle-mountain',   county: 'Utah',        description: 'Affordable western Utah County with explosive growth and large family-friendly lots.' },
  { name: 'St. George',       slug: 'st-george',        county: 'Washington',  description: "Southern Utah's hottest market. Red rock views, warm weather, and rapid growth." },
  { name: 'Washington',       slug: 'washington',       county: 'Washington',  description: 'Fastest-growing Washington County city adjacent to St. George.' },
  { name: 'Hurricane',        slug: 'hurricane',        county: 'Washington',  description: 'Zion National Park gateway with affordable Southern Utah land and homes.' },
  { name: 'Cedar City',       slug: 'cedar-city',       county: 'Iron',        description: 'Southern Utah university city — gateway to Zion and Bryce Canyon.' },
  { name: 'Logan',            slug: 'logan',            county: 'Cache',       description: 'USU college town in Cache Valley — affordable, family-friendly, and growing.' },
  { name: 'North Logan',      slug: 'north-logan',      county: 'Cache',       description: 'Residential Cache Valley city directly north of Logan with strong growth.' },
  { name: 'Hyde Park',        slug: 'hyde-park',        county: 'Cache',       description: 'Small Cache Valley community with affordable lots and rural character.' },
  { name: 'Brigham City',     slug: 'brigham-city',     county: 'Box Elder',   description: 'Historic Box Elder County seat with affordable homes and I-15 access.' },
  { name: 'Tooele',           slug: 'tooele',           county: 'Tooele',      description: 'Affordable western community with growing industrial and military presence.' },
  { name: 'Grantsville',      slug: 'grantsville',      county: 'Tooele',      description: 'Rural Tooele County with large lots, open space, and extreme affordability.' },
  { name: 'Heber City',       slug: 'heber-city',       county: 'Wasatch',     description: 'Heber Valley gem near Sundance and Deer Creek — resort living with authentic roots.' },
  { name: 'Park City',        slug: 'park-city',        county: 'Summit',      description: "World-class ski resort, Sundance Film Festival, and Utah's luxury market leader." },
  { name: 'Moab',             slug: 'moab',             county: 'Grand',       description: 'Adventure tourism capital — Airbnb investment and unique desert real estate.' },
  { name: 'Vernal',           slug: 'vernal',           county: 'Uintah',      description: 'Uinta Basin energy hub with affordable land and investment opportunity.' },
  { name: 'Price',            slug: 'price',            county: 'Carbon',      description: 'Carbon County college town with low prices and central Utah location.' },
  { name: 'Richfield',        slug: 'richfield',        county: 'Sevier',      description: 'Central Utah crossroads with affordable homes and agricultural land.' },
  { name: 'Payson',           slug: 'payson',           county: 'Utah',        description: 'Southern Utah Valley with affordable land, mountain proximity, and growing infrastructure.' },
]

// Group cities by region
const REGIONS = [
  {
    name: 'Salt Lake Valley',
    cities: ['salt-lake-city','west-jordan','sandy','south-jordan','taylorsville','murray','draper','herriman','riverton','west-valley-city','millcreek','cottonwood-heights','midvale','holladay'],
  },
  {
    name: 'Davis & Weber Counties',
    cities: ['bountiful','north-salt-lake','farmington','kaysville','layton','clearfield','ogden','roy','west-haven'],
  },
  {
    name: 'Utah Valley',
    cities: ['provo','orem','lehi','springville','spanish-fork','american-fork','highland','alpine','saratoga-springs','eagle-mountain','payson'],
  },
  {
    name: 'Southern Utah',
    cities: ['st-george','washington','hurricane','cedar-city','moab','richfield'],
  },
  {
    name: 'Northern & Eastern Utah',
    cities: ['logan','north-logan','hyde-park','brigham-city','vernal','price'],
  },
  {
    name: 'Mountain & Resort Communities',
    cities: ['park-city','heber-city','tooele','grantsville'],
  },
]

export default function MarketIndexPage() {
  const cityMap = Object.fromEntries(UTAH_CITIES.map(c => [c.slug, c]))

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '72px', background: '#0A0A0A', minHeight: '100vh' }}>

        {/* Hero */}
        <section style={{
          padding: 'clamp(60px, 7vw, 96px) 32px',
          background: 'linear-gradient(180deg, #0D0D0D 0%, #0A0A0A 100%)',
          borderBottom: '1px solid rgba(201,168,76,0.12)',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{
              fontSize: '11px', color: '#C9A84C', letterSpacing: '0.14em',
              textTransform: 'uppercase', marginBottom: '20px',
            }}>
              Utah Real Estate · All 50 Cities
            </div>
            <h1 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(36px, 5vw, 68px)',
              fontWeight: '300', color: '#F5F3EE', lineHeight: '1.0',
              marginBottom: '12px',
            }}>
              Utah Real Estate
            </h1>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(18px, 2.5vw, 26px)',
              fontStyle: 'italic', color: '#C9A84C', fontWeight: '400',
              marginBottom: '28px',
            }}>
              Search by City
            </h2>
            <p style={{
              fontSize: '16px', color: '#888', lineHeight: '1.8',
              marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px',
            }}>
              Live WFRMLS listings, neighborhood insights, and expert guidance from
              Gurpreet Bhatti — your Utah REALTOR® and USMC Veteran.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/search" style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
                color: '#0A0A0A', fontWeight: '600', fontSize: '14px',
                padding: '14px 28px', borderRadius: '8px', textDecoration: 'none',
                letterSpacing: '0.04em',
              }}>
                Search All Utah Listings →
              </Link>
              <a href="tel:8016358462" style={{
                display: 'inline-block',
                background: 'transparent',
                color: 'rgba(245,243,238,0.8)', fontSize: '14px',
                padding: '14px 28px', borderRadius: '8px', textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.15)',
              }}>
                📞 Call Gurpreet
              </a>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <section style={{
          padding: '28px 32px',
          background: 'rgba(201,168,76,0.04)',
          borderBottom: '1px solid rgba(201,168,76,0.1)',
        }}>
          <div style={{
            maxWidth: '1200px', margin: '0 auto',
            display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'center',
          }}>
            {[
              { val: '50', label: 'Utah Cities Served' },
              { val: 'Live', label: 'WFRMLS Data' },
              { val: 'UT/NV/WY', label: '3-State Licensed' },
              { val: '801.635.8462', label: 'Direct Line' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'Cormorant Garamond, serif', fontSize: '24px',
                  fontWeight: '600', color: '#C9A84C', lineHeight: '1', marginBottom: '4px',
                }}>
                  {s.val}
                </div>
                <div style={{ fontSize: '12px', color: '#666', letterSpacing: '0.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* City grid by region */}
        {REGIONS.map(region => {
          const regionCities = region.cities.map(slug => cityMap[slug]).filter(Boolean)
          return (
            <section key={region.name} style={{
              padding: '64px 32px',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}>
              <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
                <div style={{ marginBottom: '36px' }}>
                  <div style={{
                    fontSize: '11px', color: '#C9A84C', letterSpacing: '0.14em',
                    textTransform: 'uppercase', marginBottom: '8px',
                  }}>
                    Utah Real Estate
                  </div>
                  <h2 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: 'clamp(24px, 3vw, 36px)',
                    fontWeight: '400', color: '#F5F3EE',
                  }}>
                    {region.name}
                  </h2>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '16px',
                }}>
                  {regionCities.map(city => (
                    <Link
                      key={city.slug}
                      href={`/market/${city.slug}`}
                      style={{
                        display: 'block', textDecoration: 'none',
                        padding: '24px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '12px',
                        transition: 'all 0.2s',
                      }}
                      className="city-card"
                    >
                      <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'flex-start', marginBottom: '10px',
                      }}>
                        <h3 style={{
                          fontFamily: 'Cormorant Garamond, serif',
                          fontSize: '20px', fontWeight: '600',
                          color: '#F5F3EE', lineHeight: '1.1',
                        }}>
                          {city.name}
                        </h3>
                        <span style={{
                          fontSize: '10px', color: '#C9A84C',
                          letterSpacing: '0.1em', textTransform: 'uppercase',
                          background: 'rgba(201,168,76,0.08)',
                          padding: '3px 8px', borderRadius: '100px',
                          whiteSpace: 'nowrap', marginLeft: '8px', marginTop: '2px',
                        }}>
                          {city.county} Co.
                        </span>
                      </div>
                      <p style={{
                        fontSize: '13px', color: '#666', lineHeight: '1.6',
                        marginBottom: '14px',
                      }}>
                        {city.description}
                      </p>
                      <div style={{
                        fontSize: '12px', color: '#C9A84C',
                        display: 'flex', alignItems: 'center', gap: '4px',
                      }}>
                        View Listings →
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )
        })}

        {/* CTA section */}
        <section style={{
          padding: '80px 32px',
          background: 'linear-gradient(180deg, #0D0D0D 0%, #0A0A0A 100%)',
          borderTop: '1px solid rgba(201,168,76,0.12)',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <div style={{
              fontSize: '11px', color: '#C9A84C', letterSpacing: '0.14em',
              textTransform: 'uppercase', marginBottom: '16px',
            }}>
              Work With Gurpreet
            </div>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: '300', color: '#F5F3EE', lineHeight: '1.1',
              marginBottom: '20px',
            }}>
              Not Sure Which City is Right For You?
            </h2>
            <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.8', marginBottom: '36px' }}>
              Gurpreet Bhatti has sold in every corner of Utah — from Park City luxury
              to Eagle Mountain new builds. Tell him your budget and priorities and he&apos;ll
              point you to the right market.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/contact" style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
                color: '#0A0A0A', fontWeight: '600', fontSize: '14px',
                padding: '16px 32px', borderRadius: '8px', textDecoration: 'none',
                letterSpacing: '0.04em',
              }}>
                Get Expert Guidance →
              </Link>
              <a href="tel:8016358462" style={{
                display: 'inline-block',
                background: 'transparent',
                color: 'rgba(245,243,238,0.8)', fontSize: '14px',
                padding: '16px 32px', borderRadius: '8px', textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.15)',
              }}>
                📞 801.635.8462
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />

      <style>{`
        .city-card:hover {
          border-color: rgba(201,168,76,0.3) !important;
          background: rgba(201,168,76,0.04) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </>
  )
}
