'use client'

import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const TEAM = [
  {
    name: 'Gurpreet Bhatti',
    title: 'Founder & Lead REALTOR®',
    dept: 'Leadership',
    bio: 'USMC Veteran and licensed REALTOR® in Utah, Nevada & Wyoming. Built GSB Realtor from the ground up. Commercial specialist: NNN leases, tenant placement, strip malls. Buyer and seller representation across the Wasatch Front.',
    photo: '/images/gurpreet-headshot-smile.jpg',
    tags: ['Founder', 'REALTOR®', 'USMC Veteran', 'Commercial', 'NNN Specialist', 'UT · NV · WY'],
    badge: '⭐ Founder',
    badgeColor: '#C9A84C',
    phone: '801-635-8462',
    email: 'gsbhatti1@gmail.com',
    license: 'UT #12907042-SA00 · NV #S.0201351 · WY #RE-17041',
  },
  {
    name: 'Matthew Dulle',
    title: 'Managing Broker',
    dept: 'Brokerage',
    bio: 'Managing Broker overseeing all GSB Realtor transactions with full compliance and professionalism. The regulatory backbone ensuring every deal closes correctly.',
    photo: null,
    tags: ['Managing Broker', 'Compliance', 'Transaction Oversight'],
    badge: '🏛️ Broker',
    badgeColor: '#6B7280',
    phone: '801-635-8462',
    email: 'matt@gsbrealtor.com',
    license: 'Managing Broker License',
  },
]

export default function TeamPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: '#0A0A0A', minHeight: '100vh', paddingTop: '72px' }}>

        {/* Hero */}
        <section style={{
          padding: 'clamp(80px, 10vw, 120px) 32px 80px',
          borderBottom: '1px solid rgba(201,168,76,0.12)',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '20px' }}>
              The Team
            </div>
            <h1 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(40px, 6vw, 76px)',
              fontWeight: '300',
              color: '#F5F3EE',
              lineHeight: '1.05',
              marginBottom: '24px',
            }}>
              The Team Behind<br />
              <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>GSB Realtor</span>
            </h1>
            <p style={{ fontSize: '17px', color: '#888', lineHeight: '1.8', maxWidth: '480px', margin: '0 auto' }}>
              Real estate expertise backed by technology.
            </p>
          </div>
        </section>

        {/* Team Cards */}
        <section style={{ padding: 'clamp(60px, 8vw, 100px) 32px', maxWidth: '1100px', margin: '0 auto' }}>
          <div className="team-grid">
            {TEAM.map((member) => (
              <div key={member.name} className="team-card" style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '24px',
                overflow: 'hidden',
              }}>
                {/* Photo */}
                <div style={{ position: 'relative', height: '360px', background: '#111' }}>
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      style={{ objectFit: 'cover', objectPosition: 'top center' }}
                    />
                  ) : (
                    <div style={{
                      height: '100%', display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      background: 'linear-gradient(160deg, #111 0%, #181818 100%)',
                    }}>
                      <div style={{
                        width: '100px', height: '100px', borderRadius: '50%',
                        background: 'rgba(201,168,76,0.08)',
                        border: '2px solid rgba(201,168,76,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '44px', marginBottom: '16px', opacity: 0.5,
                      }}>👤</div>
                      <div style={{ color: '#333', fontSize: '13px', letterSpacing: '0.06em' }}>Photo Coming Soon</div>
                    </div>
                  )}

                  {/* Badge overlay */}
                  <div style={{
                    position: 'absolute', top: '18px', left: '18px',
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)',
                    borderRadius: '24px', padding: '5px 14px',
                    fontSize: '12px', color: member.badgeColor, fontWeight: '600',
                    border: `1px solid ${member.badgeColor}50`,
                    letterSpacing: '0.04em',
                  }}>
                    {member.badge}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '36px 36px 40px' }}>
                  <div style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', marginBottom: '8px' }}>
                    {member.dept}
                  </div>
                  <h2 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '32px', fontWeight: '400',
                    color: '#F5F3EE', marginBottom: '6px', lineHeight: '1.1',
                  }}>
                    {member.name}
                  </h2>
                  <div style={{ color: '#C9A84C', fontSize: '13px', fontWeight: '600', marginBottom: '20px', letterSpacing: '0.04em' }}>
                    {member.title}
                  </div>
                  <p style={{ fontSize: '15px', color: '#777', lineHeight: '1.8', marginBottom: '24px' }}>
                    {member.bio}
                  </p>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '28px' }}>
                    {member.tags.map(tag => (
                      <span key={tag} style={{
                        background: 'rgba(201,168,76,0.07)',
                        border: '1px solid rgba(201,168,76,0.18)',
                        color: '#999', fontSize: '11px',
                        padding: '4px 11px', borderRadius: '24px',
                        letterSpacing: '0.02em',
                      }}>{tag}</span>
                    ))}
                  </div>

                  {/* License */}
                  <div style={{
                    fontSize: '11px', color: '#444',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '8px', padding: '10px 14px',
                    marginBottom: '24px', letterSpacing: '0.03em',
                    fontFamily: 'DM Mono, monospace',
                  }}>
                    {member.license}
                  </div>

                  {/* Contact */}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <a href={`tel:${member.phone.replace(/-/g, '')}`} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      background: 'linear-gradient(135deg, #C9A84C, #E2C070)',
                      color: '#0A0A0A',
                      padding: '12px 22px', borderRadius: '10px',
                      fontSize: '13px', fontWeight: '700', textDecoration: 'none',
                      letterSpacing: '0.03em',
                    }}>
                      📞 {member.phone}
                    </a>
                    <a href={`mailto:${member.email}`} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C',
                      padding: '12px 22px', borderRadius: '10px',
                      fontSize: '13px', fontWeight: '600', textDecoration: 'none',
                    }}>
                      ✉️ Email
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section style={{ padding: '80px 32px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ maxWidth: '560px', margin: '0 auto' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '20px' }}>
              Work With Us
            </div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '300', color: '#F5F3EE', marginBottom: '16px' }}>
              Ready to Work With<br />
              <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>Our Team?</span>
            </h2>
            <p style={{ fontSize: '15px', color: '#666', marginBottom: '36px', lineHeight: '1.8' }}>
              One call connects you with licensed expertise and the full power of our platform.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="tel:8016358462" style={{
                background: 'linear-gradient(135deg, #C9A84C, #E2C070)', color: '#0A0A0A',
                padding: '16px 36px', borderRadius: '10px',
                fontWeight: '700', fontSize: '15px', textDecoration: 'none',
                letterSpacing: '0.03em',
              }}>
                📞 Call 801-635-8462
              </a>
              <Link href="/contact" style={{
                border: '1px solid rgba(201,168,76,0.4)', color: '#C9A84C',
                padding: '16px 36px', borderRadius: '10px',
                fontWeight: '600', fontSize: '15px', textDecoration: 'none',
              }}>
                Send a Message
              </Link>
            </div>
          </div>
        </section>

      </main>

      <style>{`
        .team-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }
        @media (max-width: 768px) {
          .team-grid {
            grid-template-columns: 1fr;
          }
        }
        .team-card {
          transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
        }
        .team-card:hover {
          border-color: rgba(201,168,76,0.3) !important;
          transform: translateY(-6px);
          box-shadow: 0 24px 60px rgba(0,0,0,0.5);
        }
      `}</style>

      <Footer />
    </>
  )
}
