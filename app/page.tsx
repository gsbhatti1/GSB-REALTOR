import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PropertyCard from '@/components/listings/PropertyCard'
import LeadForm from '@/components/ui/LeadForm'
import HeroCinematic from '@/components/ui/HeroCinematic'
import { getFeaturedListings } from '@/lib/mls'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function HomePage() {
  const [featuredListings] = await Promise.allSettled([
    getFeaturedListings(),
  ])

  const listings = featuredListings.status === 'fulfilled' ? featuredListings.value : []

  return (
    <>
      <Navbar />
      <main>

        <HeroCinematic />

        {/* ── QUICK SEARCH BAR ── */}
        <section style={{ background: '#111', borderTop: '1px solid rgba(201,168,76,0.15)', padding: '24px 32px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <form action="/search" method="GET" style={{
              display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center',
            }}>
              <input
                name="city" type="text"
                placeholder="Search by city, zip, or neighborhood..."
                style={{
                  flex: '1 1 300px', background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px',
                  padding: '14px 20px', fontSize: '15px', color: '#F5F3EE',
                  outline: 'none', fontFamily: 'DM Sans, sans-serif',
                }}
              />
              <select name="type" style={{
                flex: '0 0 160px', background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px',
                padding: '14px 16px', fontSize: '14px', color: '#888',
                outline: 'none', fontFamily: 'DM Sans, sans-serif',
              }}>
                <option value="">All Types</option>
                <option value="Residential">Residential</option>
                <option value="Commercial Sale">Commercial</option>
                <option value="Land">Land</option>
              </select>
              <button type="submit" style={{
                background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
                border: 'none', borderRadius: '8px',
                padding: '14px 32px', fontSize: '14px',
                fontWeight: '600', color: '#0A0A0A',
                cursor: 'pointer', fontFamily: 'inherit',
                letterSpacing: '0.04em', whiteSpace: 'nowrap',
              }}>
                Search Utah MLS
              </button>
            </form>
          </div>
        </section>

        {/* ── FEATURED LISTINGS ── */}
        <section style={{ padding: '96px 32px', background: '#0D0D0D' }}>
          <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div className="section-label" style={{ marginBottom: '12px' }}>Live from WFRMLS</div>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: '400', color: '#F5F3EE' }}>
                  Featured Utah Listings
                </h2>
              </div>
              <Link href="/search" className="btn-ghost" style={{ fontSize: '13px', padding: '10px 24px' }}>
                View All Listings →
              </Link>
            </div>

            {listings.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {listings.map((property, i) => (
                  <PropertyCard key={property.ListingKey} property={property} priority={i < 3} />
                ))}
              </div>
            ) : (
              <div style={{ padding: '80px 40px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed rgba(201,168,76,0.15)' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
                <p style={{ color: '#888', fontSize: '17px', fontWeight: '500', marginBottom: '12px' }}>
                  17,000+ Active Utah Listings
                </p>
                <p style={{ color: '#555', fontSize: '14px', marginBottom: '28px' }}>
                  Search homes by city, price, bedrooms, and more — updated daily from Utah MLS.
                </p>
                <Link href="/search" style={{ display: 'inline-block', background: '#C9A84C', color: '#0A0A0A', padding: '14px 32px', borderRadius: '8px', fontWeight: '600', fontSize: '15px', textDecoration: 'none' }}>
                  Search All Utah Homes →
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ── FREE HOME VALUATION — BIGGEST LEAD MAGNET ── */}
        <section style={{
          padding: '96px 32px',
          background: 'linear-gradient(135deg, #0A0A0A 0%, #111 50%, #0A0A0A 100%)',
          borderTop: '1px solid rgba(201,168,76,0.12)',
          borderBottom: '1px solid rgba(201,168,76,0.12)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Background texture */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(rgba(201,168,76,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }} />
          <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '64px', alignItems: 'center' }}>
              <div>
                <div className="section-label" style={{ marginBottom: '16px' }}>Free Service</div>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: '300', color: '#F5F3EE', lineHeight: '1.05', marginBottom: '24px' }}>
                  What Is Your<br />
                  <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>Utah Home Worth?</span>
                </h2>
                <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.8', marginBottom: '32px' }}>
                  Get a free, no-obligation market analysis of your home.
                  Gurpreet knows this market better than anyone —
                  he will give you an honest number, not a number designed to win your listing.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {['Completely free, no strings attached', 'Honest market value — not inflated', 'Response within 1 hour', 'No pressure, ever'].map(item => (
                    <div key={item} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{ color: '#C9A84C', fontSize: '16px' }}>✓</span>
                      <span style={{ fontSize: '14px', color: '#888' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <LeadForm
                leadType="market_report"
                title="Get My Free Home Value"
                subtitle="Tell Gurpreet about your property — takes 60 seconds."
              />
            </div>
          </div>
        </section>

        {/* ── WHY GURPREET — DIFFERENTIATION ── */}
        <section style={{ padding: '96px 32px', background: '#0A0A0A' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div className="section-label" style={{ marginBottom: '16px' }}>Why Gurpreet</div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: '400', color: '#F5F3EE' }}>
                Not Just Another Realtor
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
              {[
                {
                  number: '01',
                  title: 'USMC Veteran',
                  body: 'The same discipline, integrity, and mission-focus that served this country now serves you. When Gurpreet says he will get it done — it gets done.',
                },
                {
                  number: '02',
                  title: 'Commercial Expert',
                  body: 'Tenant placement, NNN leasing, strip plazas, commercial sales. Most agents run from commercial. This is where Gurpreet specializes.',
                },
                {
                  number: '03',
                  title: 'Utah + Wyoming + Nevada',
                  body: 'Three-state licensed. Whether you are moving, investing, or expanding — one agent who covers the entire Intermountain West.',
                },
                {
                  number: '04',
                  title: 'Investor Mindset',
                  body: 'Cap rates, cash flow, rental yield, appreciation potential. Gurpreet runs the numbers before you sign anything. Data over emotion.',
                },
              ].map(item => (
                <div key={item.number} className="feature-card" style={{ position: 'relative', overflow: 'hidden' }}>
                  <div style={{
                    position: 'absolute', top: '-10px', right: '16px',
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '72px', fontWeight: '700',
                    color: 'rgba(201,168,76,0.06)',
                    lineHeight: '1',
                    userSelect: 'none',
                  }}>
                    {item.number}
                  </div>
                  <div style={{ fontSize: '12px', color: '#C9A84C', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
                    {item.number}
                  </div>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: '500', color: '#F5F3EE', marginBottom: '12px' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#888', lineHeight: '1.75' }}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── INVESTOR TOOLS TEASER ── */}
        <section style={{ padding: '96px 32px', background: '#0D0D0D' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'center' }}>
              <div>
                <div className="section-label" style={{ marginBottom: '16px' }}>Exclusive Tools</div>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: '400', color: '#F5F3EE', lineHeight: '1.1', marginBottom: '24px' }}>
                  Investor-Grade<br/>Analytics
                </h2>
                <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.8', marginBottom: '32px' }}>
                  Free tools that no other Utah agent offers. Calculate cap rates,
                  project cash flow, analyze NNN leases, and estimate rental yields
                  before you make a single offer.
                </p>
                <Link href="/investor" style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
                  color: '#0A0A0A', fontWeight: '600', fontSize: '14px',
                  padding: '16px 32px', borderRadius: '8px',
                  textDecoration: 'none', letterSpacing: '0.04em',
                }}>
                  Open Investor Tools →
                </Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { icon: '📊', label: 'Cap Rate Calculator' },
                  { icon: '💰', label: 'Cash Flow Projector' },
                  { icon: '🏢', label: 'NNN Lease Analyzer' },
                  { icon: '📈', label: 'Rental Yield Tool' },
                ].map(tool => (
                  <div key={tool.label} style={{
                    padding: '24px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '12px',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>{tool.icon}</div>
                    <div style={{ fontSize: '12px', color: '#888', lineHeight: '1.4' }}>{tool.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CITY SEARCH ── */}
        <section style={{ padding: '96px 32px', background: '#0A0A0A' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <div className="section-label" style={{ marginBottom: '12px' }}>Search By City</div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: '400', color: '#F5F3EE' }}>
                Utah Communities
              </h2>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
              {[
                'Salt Lake City','West Jordan','Sandy','South Jordan',
                'Taylorsville','Murray','Provo','Orem',
                'Ogden','Layton','St. George','Logan',
                'Draper','Herriman','Riverton','Lehi',
                'West Valley City','Millcreek','Cottonwood Heights','Midvale',
              ].map(city => (
                <Link key={city} href={`/search?city=${encodeURIComponent(city)}`} className="city-pill">
                  {city}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT STRIP ── */}
        <section style={{ padding: '96px 32px', background: '#0D0D0D' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '24px' }}>
                <Image
                  src="/images/gurpreet-standing.jpg"
                  alt="Gurpreet Bhatti"
                  width={96}
                  height={96}
                  style={{ borderRadius: '50%', border: '3px solid rgba(201,168,76,0.4)', objectFit: 'cover' }}
                />
                <div>
                  <div className="section-label" style={{ marginBottom: '8px' }}>Your Agent</div>
                  <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: '400', color: '#F5F3EE', lineHeight: '1.05', marginBottom: '16px' }}>
                    Gurpreet Bhatti
                  </h2>
                  <p style={{ fontSize: '14px', color: '#888', lineHeight: '1.8', maxWidth: '400px', marginBottom: '24px' }}>
                    No bots, no assistants, no runaround. When you call or text,
                    you get Gurpreet. Every time. That&apos;s the deal.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <a href="tel:8016358462" style={{ color: '#C9A84C', textDecoration: 'none', fontSize: '22px', fontFamily: 'Cormorant Garamond, serif' }}>
                      📞 801.635.8462
                    </a>
                    <a href="mailto:gsbhatti1@yahoo.com" style={{ color: '#888', textDecoration: 'none', fontSize: '13px' }}>
                      ✉️ gsbhatti1@yahoo.com
                    </a>
                    <div style={{ fontSize: '12px', color: '#555' }}>🏢 Dynasty Point Referral Group · UT Lic# 12907042-SA00</div>
                  </div>
                </div>
              </div>
              <LeadForm leadType="contact_form" title="Let&apos;s Talk" subtitle="Buying, selling, or investing — Gurpreet responds within the hour." />
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
