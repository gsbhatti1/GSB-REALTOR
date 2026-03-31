import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import LeadForm from '@/components/ui/LeadForm'
import Link from 'next/link'
import { Metadata } from 'next'

const cityMap: Record<string, { display: string; daysOnMarket: number; medianPrice: string; marketType: string; trend: string }> = {
  'west-jordan': {
    display: 'West Jordan',
    daysOnMarket: 18,
    medianPrice: '$485,000',
    marketType: "seller's",
    trend: 'up 6.2% year-over-year',
  },
  'sandy': {
    display: 'Sandy',
    daysOnMarket: 14,
    medianPrice: '$520,000',
    marketType: "seller's",
    trend: 'up 5.8% year-over-year',
  },
  'south-jordan': {
    display: 'South Jordan',
    daysOnMarket: 16,
    medianPrice: '$565,000',
    marketType: "seller's",
    trend: 'up 7.1% year-over-year',
  },
  'salt-lake-city': {
    display: 'Salt Lake City',
    daysOnMarket: 22,
    medianPrice: '$460,000',
    marketType: 'balanced',
    trend: 'up 4.3% year-over-year',
  },
  'draper': {
    display: 'Draper',
    daysOnMarket: 19,
    medianPrice: '$610,000',
    marketType: "seller's",
    trend: 'up 8.2% year-over-year',
  },
  'herriman': {
    display: 'Herriman',
    daysOnMarket: 21,
    medianPrice: '$495,000',
    marketType: "seller's",
    trend: 'up 9.4% year-over-year',
  },
  'riverton': {
    display: 'Riverton',
    daysOnMarket: 17,
    medianPrice: '$540,000',
    marketType: "seller's",
    trend: 'up 6.7% year-over-year',
  },
  'lehi': {
    display: 'Lehi',
    daysOnMarket: 20,
    medianPrice: '$555,000',
    marketType: "seller's",
    trend: 'up 11.3% year-over-year',
  },
  'taylorsville': {
    display: 'Taylorsville',
    daysOnMarket: 24,
    medianPrice: '$410,000',
    marketType: 'balanced',
    trend: 'up 3.9% year-over-year',
  },
  'murray': {
    display: 'Murray',
    daysOnMarket: 20,
    medianPrice: '$425,000',
    marketType: 'balanced',
    trend: 'up 4.8% year-over-year',
  },
}

export function generateStaticParams() {
  return [
    { city: 'west-jordan' },
    { city: 'sandy' },
    { city: 'south-jordan' },
    { city: 'salt-lake-city' },
    { city: 'draper' },
    { city: 'herriman' },
    { city: 'riverton' },
    { city: 'lehi' },
    { city: 'taylorsville' },
    { city: 'murray' },
  ]
}

type Props = {
  params: { city: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cityData = cityMap[params.city]
  const cityName = cityData?.display ?? params.city
  return {
    title: `Sell My Home in ${cityName}, Utah | GSB Realtor — Gurpreet Bhatti`,
    description: `Get a free home valuation in ${cityName}, Utah. Expert seller representation from Gurpreet Bhatti, REALTOR® and USMC Veteran. See what your ${cityName} home is worth today. 801-635-8462.`,
  }
}

export default function SellCityPage({ params }: Props) {
  const cityData = cityMap[params.city] ?? {
    display: params.city.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    daysOnMarket: 21,
    medianPrice: '$480,000',
    marketType: "seller's",
    trend: 'up 5.5% year-over-year',
  }
  const { display: cityName, daysOnMarket, medianPrice, marketType, trend } = cityData

  const sellSteps = [
    {
      step: '01',
      title: 'Free Home Valuation',
      body: `Submit your ${cityName} address or call 801-635-8462. Gurpreet provides a real market analysis specific to your ${cityName} neighborhood within 1 hour — no inflated numbers, no pressure.`,
    },
    {
      step: '02',
      title: 'Strategy Session',
      body: `Meet in person or virtually to review your ${cityName} property's pricing strategy, marketing plan, and what improvements will maximize your sale price in the current ${cityName} market.`,
    },
    {
      step: '03',
      title: 'Listing & Marketing',
      body: `Professional photos, AI video tour, MLS placement, and full social media distribution targeting ${cityName} buyers. Your property reaches every active buyer searching in ${cityName} and surrounding areas.`,
    },
    {
      step: '04',
      title: 'Offers & Negotiation',
      body: `Every ${cityName} offer is presented and explained clearly. Gurpreet negotiates hard on your behalf — price, contingencies, closing timeline, and every term that matters.`,
    },
    {
      step: '05',
      title: 'Close',
      body: `From contract to keys in ${cityName}, Gurpreet manages every deadline, every inspection, every document. You show up to sign. He handles everything else.`,
    },
  ]

  return (
    <>
      <Navbar />
      <main style={{ background: '#0A0A0A', minHeight: '100vh', paddingTop: '72px' }}>

        {/* Hero */}
        <section style={{
          padding: 'clamp(64px, 8vw, 120px) 32px 80px',
          background: 'linear-gradient(135deg, #0A0A0A 0%, #0f0f0f 100%)',
          borderBottom: '1px solid rgba(201,168,76,0.12)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(rgba(201,168,76,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            pointerEvents: 'none',
          }} />
          <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C9A84C' }}>
                Seller Services
              </div>
              <span style={{ color: 'rgba(201,168,76,0.3)', fontSize: '11px' }}>›</span>
              <div style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C9A84C' }}>
                {cityName}, Utah
              </div>
            </div>
            <h1 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(40px, 6vw, 80px)',
              fontWeight: '300',
              color: '#F5F3EE',
              lineHeight: '1.0',
              marginBottom: '24px',
            }}>
              Sell Your Home in<br />
              <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>{cityName}, Utah</span>
            </h1>
            <p style={{ fontSize: '17px', color: '#888', lineHeight: '1.8', maxWidth: '620px', marginBottom: '24px' }}>
              {cityName} is a <strong style={{ color: '#F5F3EE' }}>{marketType} market</strong> right now, with homes averaging{' '}
              <strong style={{ color: '#F5F3EE' }}>{daysOnMarket} days on market</strong>. Median prices are{' '}
              <strong style={{ color: '#C9A84C' }}>{trend}</strong>. Gurpreet Bhatti knows the{' '}
              {cityName} market and will get your home sold at the best price it will bear.
            </p>

            {/* Market stats pills */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '40px' }}>
              {[
                { label: 'Median Price', value: medianPrice },
                { label: 'Days on Market', value: `${daysOnMarket} days` },
                { label: 'Market Type', value: `${marketType.charAt(0).toUpperCase() + marketType.slice(1)} market` },
                { label: 'Trend', value: trend },
              ].map(stat => (
                <div key={stat.label} style={{
                  padding: '10px 20px',
                  background: 'rgba(201,168,76,0.08)',
                  border: '1px solid rgba(201,168,76,0.2)',
                  borderRadius: '8px',
                }}>
                  <div style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>
                    {stat.label}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#C9A84C' }}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link href="/valuation" style={{
                display: 'inline-block', background: '#C9A84C', color: '#0A0A0A',
                padding: '16px 36px', borderRadius: '8px', fontWeight: '700',
                fontSize: '15px', textDecoration: 'none', letterSpacing: '0.04em',
              }}>
                Get Free {cityName} Home Valuation →
              </Link>
              <a href="tel:8016358462" style={{
                display: 'inline-block', border: '1px solid rgba(201,168,76,0.4)',
                color: '#C9A84C', padding: '16px 36px', borderRadius: '8px',
                fontWeight: '600', fontSize: '15px', textDecoration: 'none',
              }}>
                📞 Call 801.635.8462
              </a>
            </div>
          </div>
        </section>

        {/* Why sell with Gurpreet in this city */}
        <section style={{ padding: '80px 32px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '16px' }}>
                Why GSB Realtor in {cityName}
              </div>
              <h2 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(28px, 4vw, 48px)',
                fontWeight: '300', color: '#F5F3EE',
              }}>
                The {cityName} Advantage
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
              {[
                {
                  title: `${cityName} Market Knowledge`,
                  body: `Gurpreet has closed transactions throughout ${cityName} and the surrounding communities. He knows which neighborhoods command premiums, which streets to avoid, and what today\'s ${cityName} buyers are paying.`,
                },
                {
                  title: 'Honest Pricing',
                  body: `Most agents inflate your ${cityName} list price to win your listing, then reduce it later. Gurpreet gives you the real number from day one — because his reputation in ${cityName} matters more than one listing.`,
                },
                {
                  title: 'AI-Powered Marketing',
                  body: `Your ${cityName} listing gets a professional video, drone photography (when applicable), MLS placement, and distribution across YouTube, Instagram, Facebook, and TikTok automatically.`,
                },
                {
                  title: 'Same-Day Response',
                  body: `Every showing request, every offer, every inquiry about your ${cityName} property — responded to the same day. No voicemail black holes. Mission-focused service.`,
                },
              ].map(card => (
                <div key={card.title} style={{
                  padding: '32px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(201,168,76,0.1)',
                  borderRadius: '12px',
                }}>
                  <div style={{ width: '40px', height: '2px', background: '#C9A84C', marginBottom: '20px' }} />
                  <h3 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '22px', color: '#F5F3EE', marginBottom: '12px',
                  }}>
                    {card.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#777', lineHeight: '1.8' }}>{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sell Process */}
        <section style={{
          padding: '80px 32px',
          background: 'rgba(201,168,76,0.03)',
          borderTop: '1px solid rgba(201,168,76,0.08)',
          borderBottom: '1px solid rgba(201,168,76,0.08)',
        }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '16px' }}>
                The Process
              </div>
              <h2 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(28px, 4vw, 48px)',
                fontWeight: '300', color: '#F5F3EE',
              }}>
                How to Sell in {cityName}
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {sellSteps.map((item, i) => (
                <div
                  key={item.step}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr',
                    gap: '24px', padding: '32px 0',
                    borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    alignItems: 'start',
                  }}
                >
                  <div style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '48px', fontWeight: '300',
                    color: 'rgba(201,168,76,0.3)', lineHeight: '1',
                  }}>
                    {item.step}
                  </div>
                  <div>
                    <h3 style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: '24px', color: '#F5F3EE', marginBottom: '8px',
                    }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#777', lineHeight: '1.8' }}>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lead Form */}
        <section style={{ padding: '80px 32px' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '16px' }}>
              Get Started Today
            </div>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: '300', color: '#F5F3EE', marginBottom: '16px',
            }}>
              Ready to Sell in {cityName}?
            </h2>
            <p style={{ fontSize: '15px', color: '#666', marginBottom: '40px' }}>
              Fill out the form and Gurpreet will contact you within the hour with a free {cityName} home valuation.
            </p>
            <LeadForm
              source={`sell-${params.city}`}
              leadType="seller_lead"
              title={`Sell My ${cityName} Home`}
              subtitle={`Gurpreet will send you a free ${cityName} market analysis within the hour.`}
            />
          </div>
        </section>

        {/* Related city links */}
        <section style={{
          padding: '48px 32px',
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', marginBottom: '20px' }}>
              Also Serving
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
              {Object.entries(cityMap)
                .filter(([slug]) => slug !== params.city)
                .slice(0, 6)
                .map(([slug, data]) => (
                  <Link
                    key={slug}
                    href={`/sell/${slug}`}
                    style={{
                      padding: '8px 20px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '20px',
                      fontSize: '13px', color: '#888',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    Sell in {data.display}
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
