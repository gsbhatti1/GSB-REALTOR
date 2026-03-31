import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import LeadForm from '@/components/ui/LeadForm'
import Link from 'next/link'

export const metadata = {
  title: 'Sell Your Utah Home | GSB Realtor — Gurpreet Bhatti',
  description: 'Get a free home valuation and expert seller representation from Gurpreet Bhatti, Utah REALTOR® and USMC Veteran. Commercial and residential. 801-635-8462.',
}

export default function SellPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: '#0A0A0A', minHeight: '100vh', paddingTop: '72px' }}>

        {/* Hero */}
        <section style={{
          padding: 'clamp(64px, 8vw, 120px) 32px 80px',
          background: 'linear-gradient(135deg, #0A0A0A 0%, #0f0f0f 100%)',
          borderBottom: '1px solid rgba(201,168,76,0.12)',
        }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '24px' }}>
              Seller Services
            </div>
            <h1 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(40px, 6vw, 80px)',
              fontWeight: '300',
              color: '#F5F3EE',
              lineHeight: '1.0',
              marginBottom: '24px',
            }}>
              Sell Smarter.<br />
              <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>Get More.</span>
            </h1>
            <p style={{ fontSize: '17px', color: '#888', lineHeight: '1.8', maxWidth: '600px', marginBottom: '40px' }}>
              Gurpreet Bhatti doesn&apos;t inflate your list price to win your listing.
              He gives you an honest number, a proven strategy, and a Marine&apos;s commitment
              to getting it sold — at the best price the market will support.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link href="/valuation" style={{
                display: 'inline-block', background: '#C9A84C', color: '#0A0A0A',
                padding: '16px 36px', borderRadius: '8px', fontWeight: '700',
                fontSize: '15px', textDecoration: 'none', letterSpacing: '0.04em',
              }}>
                Get Free Home Valuation →
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

        {/* Why sell with Gurpreet */}
        <section style={{ padding: '80px 32px', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '16px' }}>Why GSB Realtor</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '300', color: '#F5F3EE' }}>
              What Sets This Apart
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            {[
              {
                title: 'Honest Pricing',
                body: 'Most agents tell you what you want to hear to win the listing, then reduce the price later. Gurpreet gives you the real number from day one — because his reputation matters more than one listing.',
              },
              {
                title: 'Commercial + Residential',
                body: 'Selling a strip mall, NNN property, office space, or residential home — Gurpreet is licensed and experienced across all asset types. Utah, Nevada, and Wyoming.',
              },
              {
                title: 'Same-Day Response',
                body: 'Every lead inquiry, every showing request, every offer — responded to the same day. No voicemail black holes. No delayed callbacks. Mission-focused service.',
              },
              {
                title: 'AI-Powered Marketing',
                body: 'Your listing gets an AI-generated property video, professional photos, MLS placement, and distribution across YouTube, Instagram, Facebook, and TikTok automatically.',
              },
              {
                title: 'USMC Veteran Work Ethic',
                body: 'Gurpreet served in the United States Marine Corps. That discipline and commitment to mission carries directly into how he negotiates, communicates, and closes.',
              },
              {
                title: 'Three-State Coverage',
                body: 'Licensed in Utah (UT# 12907042-SA00), Nevada (NV# S.0201351), and Wyoming (WY# RE-17041). One agent, three markets, zero hand-offs.',
              },
            ].map(card => (
              <div key={card.title} style={{
                padding: '32px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(201,168,76,0.1)',
                borderRadius: '12px',
              }}>
                <div style={{ width: '40px', height: '2px', background: '#C9A84C', marginBottom: '20px' }} />
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', color: '#F5F3EE', marginBottom: '12px' }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#777', lineHeight: '1.8' }}>{card.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section style={{
          padding: '80px 32px',
          background: 'rgba(201,168,76,0.03)',
          borderTop: '1px solid rgba(201,168,76,0.08)',
          borderBottom: '1px solid rgba(201,168,76,0.08)',
        }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '16px' }}>The Process</div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '300', color: '#F5F3EE' }}>
                How It Works
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                { step: '01', title: 'Free Valuation', body: 'Submit your address at gsbrealtor.com/valuation or call 801-635-8462. Gurpreet provides a real market analysis within 1 hour — no inflated numbers, no pressure.' },
                { step: '02', title: 'Strategy Session', body: 'Meet in person or virtually to review pricing strategy, marketing plan, timing, and what improvements (if any) will move the needle on your sale price.' },
                { step: '03', title: 'Listing & Marketing', body: 'Professional photos, AI video tour, MLS placement, and full social media distribution — all handled. Your property reaches every active buyer in Utah.' },
                { step: '04', title: 'Offers & Negotiation', body: 'Every offer is presented and explained clearly. Gurpreet negotiates hard on your behalf — price, contingencies, closing timeline, and every term that matters.' },
                { step: '05', title: 'Close', body: 'From contract to keys, Gurpreet manages every deadline, every inspection, every document. You show up to sign. He handles everything else.' },
              ].map((item, i) => (
                <div key={item.step} style={{
                  display: 'grid', gridTemplateColumns: '80px 1fr',
                  gap: '24px', padding: '32px 0',
                  borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  alignItems: 'start',
                }}>
                  <div style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '48px', fontWeight: '300',
                    color: 'rgba(201,168,76,0.3)', lineHeight: '1',
                  }}>{item.step}</div>
                  <div>
                    <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', color: '#F5F3EE', marginBottom: '8px' }}>
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
            <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '16px' }}>Get Started</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '300', color: '#F5F3EE', marginBottom: '16px' }}>
              Ready to Sell?
            </h2>
            <p style={{ fontSize: '15px', color: '#666', marginBottom: '40px' }}>
              Fill out the form and Gurpreet will contact you within the hour.
            </p>
            <LeadForm source="sell-page" />
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
