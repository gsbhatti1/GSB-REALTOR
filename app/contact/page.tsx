import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import LeadForm from '@/components/ui/LeadForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Gurpreet Bhatti — Utah REALTOR® | 801.635.8462',
  description: 'Contact Gurpreet Bhatti — Utah REALTOR®, USMC Veteran, commercial & residential specialist. Call or text 801-635-8462 anytime.',
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '72px', background: '#0A0A0A', minHeight: '100vh' }}>

        {/* Hero */}
        <section style={{ padding: '80px 32px 48px', textAlign: 'center' }}>
          <div className="section-label" style={{ marginBottom: '16px' }}>Get In Touch</div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(40px, 5vw, 72px)', fontWeight: '300', color: '#F5F3EE', lineHeight: '1.0', marginBottom: '16px' }}>
            Let&apos;s Talk Real Estate
          </h1>
          <p style={{ fontSize: '16px', color: '#888', maxWidth: '500px', margin: '0 auto', lineHeight: '1.8' }}>
            Buying, selling, investing, or leasing — Gurpreet responds to every message personally, within the hour.
          </p>
        </section>

        {/* Contact grid */}
        <section style={{ padding: '48px 32px 96px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '80px', alignItems: 'start' }}>

            {/* Left: Info */}
            <div>
              {/* Photo */}
              <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <Image
                  src="/images/gurpreet-headshot.jpg"
                  alt="Gurpreet Bhatti"
                  width={80} height={80}
                  style={{ borderRadius: '50%', border: '3px solid rgba(201,168,76,0.4)', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', color: '#F5F3EE' }}>Gurpreet Bhatti</div>
                  <div style={{ fontSize: '12px', color: '#C9A84C', letterSpacing: '0.08em' }}>REALTOR® · USMC Veteran</div>
                </div>
              </div>

              {/* Contact methods */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                {[
                  { icon: '📞', label: 'Call or Text', value: '801.635.8462', href: 'tel:8016358462', color: '#C9A84C' },
                  { icon: '✉️', label: 'Email', value: 'gsbhatti1@yahoo.com', href: 'mailto:gsbhatti1@yahoo.com', color: '#888' },
                  { icon: '🌐', label: 'Website', value: 'gsbrealtor.com', href: 'https://gsbrealtor.com', color: '#888' },
                  { icon: '📍', label: 'Office', value: '2629 W 7800 S Suite B\nWest Jordan, UT 84129', href: null, color: '#888' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '2px' }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: '11px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>{item.label}</div>
                      {item.href ? (
                        <a href={item.href} style={{ fontSize: '16px', color: item.color, textDecoration: 'none' }}>{item.value}</a>
                      ) : (
                        <div style={{ fontSize: '15px', color: '#888', whiteSpace: 'pre-line' }}>{item.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* License box */}
              <div style={{ marginTop: '40px', padding: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px' }}>
                <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Licensing</div>
                <div style={{ fontSize: '13px', color: '#666', lineHeight: '2' }}>
                  <div>Utah · Lic# 12907042-SA00</div>
                  <div>Nevada · Lic# S.0201351</div>
                  <div>Wyoming · Lic# RE-17041</div>
                  <div style={{ marginTop: '8px', color: '#444' }}>Dynasty Point Referral Group</div>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <LeadForm
              leadType="contact_form"
              title="Send a Message"
              subtitle="Gurpreet reads every message personally — usually within the hour."
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
