import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import LeadForm from '@/components/ui/LeadForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Utah Commercial Real Estate | NNN Leases | Tenant Placement | GSB Realtor',
  description: 'Expert commercial real estate in Utah. NNN leases, tenant placement, strip malls, industrial. Gurpreet Bhatti — licensed UT, NV, WY. Call 801-635-8462.',
}

const COMMERCIAL_SERVICES = [
  {
    title: 'NNN Leases',
    icon: '🏢',
    description: 'Triple-net lease acquisitions and dispositions. Gurpreet specializes in credit tenant NNN deals across Utah — from dollar stores to fast food and medical.',
    keywords: ['NNN lease Utah', 'triple net property', 'passive income real estate'],
  },
  {
    title: 'Tenant Placement',
    icon: '🤝',
    description: 'Own a commercial building or retail space? Gurpreet connects landlords with qualified tenants across Salt Lake County and Utah Valley.',
    keywords: ['tenant placement Salt Lake County', 'commercial tenant rep', 'leasing agent Utah'],
  },
  {
    title: 'Strip Malls & Retail',
    icon: '🛒',
    description: 'Buy, sell, or lease strip mall and inline retail space across the Wasatch Front. Strong relationships with local retailers and national franchises.',
    keywords: ['strip mall for sale Utah', 'retail space Utah', 'shopping center investment'],
  },
  {
    title: 'Industrial Space',
    icon: '🏭',
    description: 'Industrial warehouses, flex space, and distribution centers across West Jordan, Salt Lake City, and the I-15 corridor.',
    keywords: ['industrial space West Jordan Utah', 'warehouse Utah', 'flex space Salt Lake'],
  },
  {
    title: 'Office Space',
    icon: '💼',
    description: 'Office acquisitions, leases, and dispositions. Silicon Slopes office, medical office, and executive suites across Utah County and Salt Lake County.',
    keywords: ['office space Utah', 'office for sale Salt Lake City', 'medical office Utah'],
  },
  {
    title: 'Investment Analysis',
    icon: '📊',
    description: 'Cap rate analysis, cash-on-cash returns, debt coverage ratios, and 10-year projections. Free investor tools at gsbrealtor.com/investor.',
    keywords: ['commercial investment analysis', 'cap rate calculator Utah', 'NOI analysis'],
  },
]

const COMMERCIAL_CITIES = [
  'Salt Lake City', 'West Jordan', 'Sandy', 'South Jordan', 'Taylorsville',
  'Murray', 'Draper', 'Herriman', 'Midvale', 'West Valley City',
  'Lehi', 'Orem', 'Provo', 'St. George', 'Ogden',
]

const FAQ = [
  {
    q: 'What is a NNN (triple-net) lease in Utah?',
    a: 'A NNN (triple-net) lease is a commercial lease structure where the tenant pays base rent plus property taxes, building insurance, and maintenance costs. In Utah, NNN properties with credit tenants (national brands, fast food, dollar stores) are popular with investors seeking passive income with minimal landlord responsibility. Cap rates in Utah typically range from 5.0% to 7.5% depending on the tenant and location.',
  },
  {
    q: 'How does tenant placement work for commercial landlords?',
    a: 'Gurpreet works with commercial landlords to market vacant space across multiple platforms, screen prospective tenants, negotiate lease terms, and handle the entire transaction through to executed lease. He serves Salt Lake County and Utah Valley. Fees are typically paid at lease execution as a percentage of total lease value.',
  },
  {
    q: 'Is Utah commercial real estate a good investment in 2026?',
    a: 'Utah continues to rank as one of the top business-friendly states in the nation, with strong population growth driving demand for retail, industrial, and office space. The West Jordan and Lehi corridors have seen particularly strong absorption rates. Industrial vacancy in the Wasatch Front remains below 5%, making commercial a solid long-term play.',
  },
  {
    q: 'What types of commercial properties does Gurpreet specialize in?',
    a: 'Gurpreet specializes in NNN investment properties, strip mall and inline retail, industrial/flex space, and tenant placement across Utah. He is licensed in Utah, Nevada, and Wyoming, allowing him to assist investors comparing markets across the Intermountain West.',
  },
  {
    q: 'Can I use my IRA or 401K to invest in commercial real estate?',
    a: 'Yes. Self-directed IRAs and Solo 401Ks can be used to purchase commercial real estate in Utah. This is a complex strategy that requires a custodian, and Gurpreet works with investors to identify qualifying properties. Read the full guide on the GSB Realtor blog.',
  },
  {
    q: 'What areas in Utah have the best commercial real estate opportunities?',
    a: 'For industrial, West Jordan and Salt Lake City\'s northwest quadrant offer strong value. For retail and strip malls, the I-15 corridor from Lehi to Draper has some of the highest household incomes in the state. For NNN investment, St. George is one of the fastest-growing metros in the country with strong tenant demand.',
  },
]

export default function CommercialPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '72px', background: '#0A0A0A', minHeight: '100vh' }}>

        {/* Hero */}
        <section style={{
          padding: 'clamp(70px, 8vw, 112px) 32px',
          background: 'linear-gradient(180deg, #0D0D0D 0%, #0A0A0A 100%)',
          borderBottom: '1px solid rgba(201,168,76,0.12)',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '64px', alignItems: 'center' }}>
              <div>
                <div style={{
                  fontSize: '11px', color: '#C9A84C', letterSpacing: '0.14em',
                  textTransform: 'uppercase', marginBottom: '20px',
                }}>
                  Commercial Real Estate · Utah
                </div>
                <h1 style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(36px, 5vw, 64px)',
                  fontWeight: '300', color: '#F5F3EE', lineHeight: '1.0',
                  marginBottom: '12px',
                }}>
                  Utah Commercial
                </h1>
                <h2 style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(20px, 2.5vw, 30px)',
                  fontStyle: 'italic', color: '#C9A84C', fontWeight: '400',
                  marginBottom: '28px',
                }}>
                  Real Estate — Done Right
                </h2>
                <p style={{
                  fontSize: '16px', color: '#888', lineHeight: '1.8',
                  marginBottom: '16px', maxWidth: '520px',
                }}>
                  NNN leases, tenant placement, strip malls, industrial, and office space
                  across the Wasatch Front and Southern Utah. Gurpreet Bhatti is a
                  3-state licensed commercial agent who runs the numbers and closes deals.
                </p>
                <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.7', marginBottom: '36px', maxWidth: '520px' }}>
                  Licensed in Utah, Nevada, and Wyoming — with investor-grade tools at{' '}
                  <a href="https://gsbrealtor.com/investor" style={{ color: '#C9A84C', textDecoration: 'none' }}>
                    gsbrealtor.com/investor
                  </a>.
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <a href="#lead-form" style={{
                    display: 'inline-block',
                    background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
                    color: '#0A0A0A', fontWeight: '600', fontSize: '14px',
                    padding: '14px 28px', borderRadius: '8px', textDecoration: 'none',
                    letterSpacing: '0.04em',
                  }}>
                    Discuss Your Deal →
                  </a>
                  <a href="tel:8016358462" style={{
                    display: 'inline-block',
                    background: 'transparent',
                    color: 'rgba(245,243,238,0.8)', fontSize: '14px',
                    padding: '14px 28px', borderRadius: '8px', textDecoration: 'none',
                    border: '1px solid rgba(255,255,255,0.15)',
                  }}>
                    📞 801.635.8462
                  </a>
                </div>
              </div>

              {/* Credential cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { val: 'UT / NV / WY', label: '3-State Licensed', sub: 'Intermountain West' },
                  { val: 'NNN', label: 'Specialist', sub: 'Triple-Net Leases' },
                  { val: '15+', label: 'Cities Served', sub: 'Wasatch Front & Southern UT' },
                  { val: 'USMC', label: 'Veteran', sub: 'Discipline. Integrity.' },
                ].map(s => (
                  <div key={s.label} style={{
                    padding: '24px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '12px',
                  }}>
                    <div style={{
                      fontFamily: 'Cormorant Garamond, serif', fontSize: '28px',
                      fontWeight: '600', color: '#C9A84C', lineHeight: '1', marginBottom: '6px',
                    }}>
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

        {/* Services Grid */}
        <section style={{ padding: '80px 32px', background: '#0A0A0A' }}>
          <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '52px' }}>
              <div style={{
                fontSize: '11px', color: '#C9A84C', letterSpacing: '0.14em',
                textTransform: 'uppercase', marginBottom: '12px',
              }}>
                Commercial Services
              </div>
              <h2 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(28px, 3.5vw, 44px)',
                fontWeight: '400', color: '#F5F3EE',
              }}>
                What Gurpreet Does in Commercial
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px',
            }}>
              {COMMERCIAL_SERVICES.map(service => (
                <div key={service.title} style={{
                  padding: '32px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '16px' }}>{service.icon}</div>
                  <h3 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '22px', fontWeight: '600',
                    color: '#F5F3EE', marginBottom: '12px',
                  }}>
                    {service.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#777', lineHeight: '1.7', marginBottom: '16px' }}>
                    {service.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {service.keywords.map(kw => (
                      <span key={kw} style={{
                        fontSize: '10px', color: '#555', letterSpacing: '0.04em',
                        background: 'rgba(255,255,255,0.03)',
                        padding: '3px 8px', borderRadius: '100px',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}>
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Commercial with Gurpreet */}
        <section style={{
          padding: '80px 32px',
          background: '#0D0D0D',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '64px', alignItems: 'center' }}>
              <div>
                <div style={{
                  fontSize: '11px', color: '#C9A84C', letterSpacing: '0.14em',
                  textTransform: 'uppercase', marginBottom: '12px',
                }}>
                  Why GSB Realtor
                </div>
                <h2 style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(28px, 3.5vw, 44px)',
                  fontWeight: '400', color: '#F5F3EE', lineHeight: '1.1',
                  marginBottom: '24px',
                }}>
                  Commercial Real Estate with a Numbers-First Agent
                </h2>
                <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.8', marginBottom: '20px' }}>
                  Gurpreet Bhatti is licensed in <strong style={{ color: '#F5F3EE' }}>Utah, Nevada, and Wyoming</strong> —
                  giving investors and business owners a single point of contact across the Intermountain West.
                  He doesn&apos;t just find the building. He models the deal.
                </p>
                <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.8', marginBottom: '20px' }}>
                  As an <strong style={{ color: '#F5F3EE' }}>NNN lease specialist</strong>, Gurpreet has deep
                  relationships with 1031 exchange buyers, private equity funds, and local operators
                  looking for credit-tenant triple-net properties.
                </p>
                <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.8', marginBottom: '32px' }}>
                  Use his free{' '}
                  <a href="/investor" style={{ color: '#C9A84C', textDecoration: 'none' }}>investor tools</a>{' '}
                  — cap rate calculator, cash flow projections, and debt coverage ratio tool — to
                  model any property before you offer.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  { title: '3-State Licensed', body: 'Utah, Nevada, and Wyoming. One agent for your Intermountain West portfolio.' },
                  { title: 'NNN Specialist', body: 'Dollar stores, fast food, medical, and mixed-use triple-net properties across Utah.' },
                  { title: 'Free Investor Tools', body: 'Cap rates, NOI, cash-on-cash, DCR — all available free at gsbrealtor.com/investor.' },
                  { title: 'USMC Veteran', body: 'Discipline, integrity, and zero fluff. Gurpreet runs every deal like a mission.' },
                ].map(item => (
                  <div key={item.title} style={{
                    padding: '24px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(201,168,76,0.12)',
                    borderLeft: '3px solid #C9A84C',
                    borderRadius: '0 8px 8px 0',
                  }}>
                    <div style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: '18px', fontWeight: '600',
                      color: '#F5F3EE', marginBottom: '6px',
                    }}>
                      {item.title}
                    </div>
                    <p style={{ fontSize: '13px', color: '#777', lineHeight: '1.6', margin: 0 }}>
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Cities Served */}
        <section style={{ padding: '64px 32px', background: '#0A0A0A' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div style={{
                fontSize: '11px', color: '#C9A84C', letterSpacing: '0.14em',
                textTransform: 'uppercase', marginBottom: '12px',
              }}>
                Commercial Service Area
              </div>
              <h2 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(24px, 3vw, 36px)',
                fontWeight: '400', color: '#F5F3EE',
              }}>
                Utah Cities for Commercial Real Estate
              </h2>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
              {COMMERCIAL_CITIES.map(city => (
                <a
                  key={city}
                  href={`/market/${city.toLowerCase().replace(/\./g, '').replace(/\s+/g, '-')}`}
                  style={{
                    padding: '10px 20px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '100px', fontSize: '14px',
                    color: 'rgba(245,243,238,0.8)', textDecoration: 'none',
                  }}
                >
                  {city}
                </a>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <p style={{ fontSize: '13px', color: '#555' }}>
                Not seeing your city?{' '}
                <a href="tel:8016358462" style={{ color: '#C9A84C', textDecoration: 'none' }}>
                  Call 801.635.8462
                </a>{' '}
                — Gurpreet covers all of Utah plus Nevada and Wyoming.
              </p>
            </div>
          </div>
        </section>

        {/* Lead Form */}
        <section id="lead-form" style={{
          padding: '80px 32px',
          background: '#0D0D0D',
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>
              <div>
                <div style={{
                  fontSize: '11px', color: '#C9A84C', letterSpacing: '0.14em',
                  textTransform: 'uppercase', marginBottom: '12px',
                }}>
                  Get Expert Commercial Help
                </div>
                <h2 style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(26px, 3vw, 38px)',
                  fontWeight: '400', color: '#F5F3EE', lineHeight: '1.1',
                  marginBottom: '20px',
                }}>
                  Ready to Discuss a Commercial Deal?
                </h2>
                <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.8', marginBottom: '24px' }}>
                  Whether you&apos;re buying a NNN investment, placing a tenant, or looking
                  for industrial space in West Jordan — Gurpreet responds within the hour.
                </p>
                <div style={{ marginBottom: '12px' }}>
                  <a href="tel:8016358462" style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '26px', color: '#C9A84C', textDecoration: 'none',
                    display: 'block', marginBottom: '4px',
                  }}>
                    📞 801.635.8462
                  </a>
                  <div style={{ fontSize: '12px', color: '#555' }}>
                    UT Lic# 12907042-SA00 · Dynasty Point Referral Group
                  </div>
                </div>
              </div>
              <LeadForm
                leadType="commercial-page"
                title="Commercial Inquiry"
                subtitle="Tell Gurpreet about your commercial real estate goal."
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{
          padding: '80px 32px',
          background: '#0A0A0A',
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}>
          <div style={{ maxWidth: '860px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '52px' }}>
              <div style={{
                fontSize: '11px', color: '#C9A84C', letterSpacing: '0.14em',
                textTransform: 'uppercase', marginBottom: '12px',
              }}>
                Frequently Asked Questions
              </div>
              <h2 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(26px, 3vw, 40px)',
                fontWeight: '400', color: '#F5F3EE',
              }}>
                Utah Commercial Real Estate — Your Questions Answered
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {FAQ.map((item, i) => (
                <div key={i} style={{
                  padding: '28px 32px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                }}>
                  <h3 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '19px', fontWeight: '600',
                    color: '#F5F3EE', marginBottom: '12px', lineHeight: '1.3',
                  }}>
                    {item.q}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#777', lineHeight: '1.8', margin: 0 }}>
                    {item.a}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <p style={{ fontSize: '15px', color: '#888', marginBottom: '20px' }}>
                Have a question not answered here?
              </p>
              <a href="tel:8016358462" style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
                color: '#0A0A0A', fontWeight: '600', fontSize: '14px',
                padding: '14px 28px', borderRadius: '8px', textDecoration: 'none',
                letterSpacing: '0.04em',
              }}>
                Call Gurpreet — 801.635.8462
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
