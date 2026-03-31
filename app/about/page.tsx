import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import LeadForm from '@/components/ui/LeadForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Gurpreet Bhatti — Utah REALTOR® & USMC Veteran',
  description: 'Meet Gurpreet Bhatti — USMC Veteran, REALTOR®, and commercial real estate specialist serving Utah, Wyoming, and Nevada. Dynasty Point Referral Group.',
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <style>{`
        @media (max-width: 768px) {
          .about-hero-grid { grid-template-columns: 1fr !important; }
          .about-hero-image { display: none !important; }
          .about-photo-grid { grid-template-columns: 1fr !important; }
          .about-photo-img { height: 300px !important; }
        }
      `}</style>
      <main style={{ paddingTop: '72px', background: '#0A0A0A', minHeight: '100vh' }}>

        {/* ── HERO ── */}
        <section className="about-hero-grid" style={{
          minHeight: '70vh',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          position: 'relative',
          overflow: 'hidden',
          background: '#0A0A0A',
        }}>
          <div style={{ padding: 'clamp(60px, 8vw, 120px) clamp(32px, 5vw, 80px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="section-label" style={{ marginBottom: '16px' }}>The Agent Behind GSB</div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(40px, 5vw, 72px)', fontWeight: '300', color: '#F5F3EE', lineHeight: '1.0', marginBottom: '8px' }}>
              Gurpreet Bhatti
            </h1>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(20px, 2.5vw, 32px)', fontStyle: 'italic', color: '#C9A84C', fontWeight: '400', marginBottom: '32px' }}>
              REALTOR® · USMC Veteran · Your Utah Expert
            </h2>
            <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.9', maxWidth: '500px', marginBottom: '40px' }}>
              Some agents became realtors because it sounded easy.
              Gurpreet became one because he is wired for service —
              the same way he was wired in the Marines.
              Mission first. No excuses. Get the job done.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <a href="tel:8016358462" style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
                color: '#0A0A0A', fontWeight: '600', fontSize: '14px',
                padding: '14px 28px', borderRadius: '8px', textDecoration: 'none',
              }}>
                Call 801.635.8462
              </a>
              <Link href="/contact" style={{
                display: 'inline-block',
                background: 'transparent',
                color: 'rgba(245,243,238,0.8)', fontSize: '14px',
                padding: '14px 28px', borderRadius: '8px', textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.15)',
              }}>
                Send a Message
              </Link>
            </div>
          </div>

          <div className="about-hero-image" style={{ position: 'relative', overflow: 'hidden', minHeight: '500px', height: '70vh' }}>
            <Image
              src="/images/gurpreet-fullbody.jpg"
              alt="Gurpreet Bhatti, Utah REALTOR®"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover', objectPosition: 'top center' }}
              priority
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #0A0A0A 0%, transparent 30%)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '25%', background: 'linear-gradient(to top, #0A0A0A, transparent)' }} />
          </div>
        </section>

        {/* ── STORY ── */}
        <section style={{ padding: '96px 32px', background: '#0D0D0D' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '64px' }}>
              <div>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '36px', fontWeight: '400', color: '#F5F3EE', marginBottom: '24px' }}>
                  The Mission Mentality
                </h2>
                <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.9', marginBottom: '20px' }}>
                  Before real estate, Gurpreet served in the United States Marine Corps.
                  That experience shaped everything — the work ethic, the commitment to truth,
                  and the refusal to quit when things get hard.
                </p>
                <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.9', marginBottom: '20px' }}>
                  In real estate, most agents disappear after the contract is signed.
                  Gurpreet is still answering your texts at 9pm because that is what the mission requires.
                </p>
                <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.9' }}>
                  Based in Taylorsville, Utah — born and raised in this market —
                  Gurpreet knows the streets, the neighborhoods, the hidden deals,
                  and the developers before they list anything publicly.
                </p>
              </div>
              <div>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '36px', fontWeight: '400', color: '#F5F3EE', marginBottom: '24px' }}>
                  The Commercial Edge
                </h2>
                <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.9', marginBottom: '20px' }}>
                  Most residential agents avoid commercial real estate entirely —
                  it is too complex, too different, too much math.
                  Gurpreet specializes in it.
                </p>
                <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.9', marginBottom: '20px' }}>
                  Tenant placement, NNN leasing, commercial acquisitions,
                  strip plazas, industrial properties — Gurpreet has done it all
                  and can guide you through every step.
                </p>
                <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.9' }}>
                  Running a business and need space? Investing in commercial real estate?
                  This is where Gurpreet&apos;s expertise separates from every other agent in Utah.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CREDENTIALS ── */}
        <section style={{ padding: '80px 32px', background: '#0A0A0A', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
              {[
                { icon: '🎖️', label: 'USMC Veteran', sub: 'Served with honor' },
                { icon: '🏠', label: 'UT Lic# 12907042', sub: 'Utah licensed' },
                { icon: '⚡', label: 'NV Lic# S.0201351', sub: 'Nevada licensed' },
                { icon: '🏔️', label: 'WY Lic# RE-17041', sub: 'Wyoming licensed' },
                { icon: '🏢', label: 'Commercial Specialist', sub: 'Tenant & NNN focus' },
                { icon: '📍', label: 'Dynasty Point', sub: 'Referral Group' },
              ].map(item => (
                <div key={item.label} style={{
                  padding: '24px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '28px', marginBottom: '10px' }}>{item.icon}</div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#F5F3EE', marginBottom: '4px' }}>{item.label}</div>
                  <div style={{ fontSize: '12px', color: '#555' }}>{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PHOTO SECTION ── */}
        <section style={{ padding: '96px 32px', background: '#0D0D0D' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div className="about-photo-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', borderRadius: '16px', overflow: 'hidden' }}>
              <div className="about-photo-img" style={{ position: 'relative', height: '500px' }}>
                <Image
                  src="/images/gurpreet-hero.jpg"
                  alt="Gurpreet Bhatti, Utah REALTOR"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="section-label" style={{ marginBottom: '16px' }}>Utah Is Home</div>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: '400', color: '#F5F3EE', marginBottom: '24px', lineHeight: '1.1' }}>
                  Born Here.<br/>Built Here.
                </h2>
                <p style={{ fontSize: '14px', color: '#888', lineHeight: '1.9', marginBottom: '24px' }}>
                  Gurpreet is not a transplant chasing Utah&apos;s growth.
                  He grew up here, raised his family here, and is building something
                  here that will outlast any market cycle.
                </p>
                <p style={{ fontSize: '14px', color: '#888', lineHeight: '1.9', marginBottom: '32px' }}>
                  He recently welcomed a newborn to his family — because while
                  most people slow down when life gets hard, Gurpreet builds.
                  That energy is what he brings to every transaction.
                </p>
                <a href="tel:8016358462" style={{
                  display: 'inline-block',
                  color: '#C9A84C', fontSize: '20px',
                  fontFamily: 'Cormorant Garamond, serif',
                  textDecoration: 'none',
                }}>
                  📞 801.635.8462
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section style={{ padding: '96px 32px', background: '#0A0A0A' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: '400', color: '#F5F3EE', marginBottom: '16px' }}>
              Ready to Work Together?
            </h2>
            <p style={{ fontSize: '15px', color: '#888' }}>
              Gurpreet takes on a limited number of clients at a time — so every client gets everything he has.
            </p>
          </div>
          <div style={{ maxWidth: '560px', margin: '0 auto' }}>
            <LeadForm leadType="contact_form" title="Get in Touch" subtitle="Gurpreet responds within the hour — every time." />
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
